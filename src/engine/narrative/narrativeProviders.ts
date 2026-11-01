import { INTERPRETATION_LENSES } from "../../data/traditions/traditions";
import { ARCANA_BY_ID } from "../../data/arcana/arcana";
import { applyEditorialPolicy } from "../editorial/applyEditorialPolicy";
import { getExternalNarrativeRestriction } from "../editorial/classifySensitiveQuestion";
import { validateNarrative } from "../editorial/prohibitedClaims";
import { buildNarrativeReading } from "./buildNarrativeReading";
import type {
  InterpretationLensId,
  NarrativeReading,
  ReadingSession,
  SymbolicReading,
} from "../../types/domain";

export interface NarrativeProviderInput {
  readonly reading: ReadingSession;
  readonly symbolicReading: SymbolicReading;
  readonly lensId: InterpretationLensId;
  readonly externalConsent?: boolean;
}

export type NarrativeFallbackReason =
  | "sensitive-question"
  | "pending-review"
  | "consent-required"
  | "not-configured"
  | "timeout"
  | "http-error"
  | "invalid-response"
  | "editorial-rejection"
  | "request-error";

export interface NarrativeGenerationResult {
  readonly narrative: NarrativeReading;
  readonly provider: "local" | "gemini";
  readonly model?: string;
  readonly fallbackReason?: NarrativeFallbackReason;
  readonly fallbackDetail?: string;
}

export interface NarrativeProvider {
  generateNarrative(input: NarrativeProviderInput): Promise<NarrativeReading>;
}

interface GeminiNarrativeResponse {
  readonly opening: string;
  readonly cards: readonly {
    readonly positionId: number;
    readonly interpretation: string;
    readonly lightReflection: string;
    readonly shadowReflection: string;
    readonly question: string;
  }[];
  readonly relationships: readonly {
    readonly fromPositionId: number;
    readonly toPositionId: number;
    readonly text: string;
  }[];
  readonly movement: string;
  readonly synthesis: string;
  readonly reflectionQuestions: readonly string[];
}

interface GeminiProxyStatus {
  readonly configured: boolean;
  readonly model: string;
}

class GeminiProviderError extends Error {
  constructor(
    readonly reason: NarrativeFallbackReason,
    message: string,
  ) {
    super(message);
    this.name = "GeminiProviderError";
  }
}

function redactApiKey(value: string): string {
  return value
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, "[redactado]")
    .replace(/key=[^&\s"'`]+/gi, "key=[redactado]");
}

export class LocalNarrativeProvider implements NarrativeProvider {
  async generateNarrative(input: NarrativeProviderInput): Promise<NarrativeReading> {
    return buildNarrativeReading(input.reading, input.symbolicReading, input.lensId);
  }
}

function createGeminiRequestData(
  input: NarrativeProviderInput,
  lens: (typeof INTERPRETATION_LENSES)[number],
  base: NarrativeReading,
) {
  const cardNames = new Map(input.symbolicReading.cards.map((card) => {
    const arcana = ARCANA_BY_ID.get(card.arcanaId);
    if (!arcana) {
      throw new Error(`No se encontró el Arcano "${card.arcanaId}" para la narrativa.`);
    }
    return [card.positionId, arcana.name] as const;
  }));

  return {
    question: input.reading.question,
    spread: {
      name: input.reading.spread.name,
      positions: input.reading.spread.positions.map(({ id, name, description }) => ({
        id,
        name,
        description,
      })),
    },
    lens: { id: lens.id, name: lens.name, description: lens.description },
    symbolicReading: {
      cards: input.symbolicReading.cards.map((card) => ({
        positionId: card.positionId,
        positionName: card.positionName,
        positionMeaning: card.positionMeaning,
        arcanaName: cardNames.get(card.positionId),
        core: card.core,
        lightDimension: card.lightDimension,
        shadowDimension: card.shadowDimension,
        geometry: card.geometry,
        symbols: card.symbols,
        transformativePrinciple: card.transformativePrinciple,
        initiatoryQuestion: card.initiatoryQuestion,
        stage: card.stage,
        observations: card.observations,
      })),
      relationships: input.symbolicReading.relationships.map((relationship) => ({
        fromPositionId: relationship.fromPositionId,
        toPositionId: relationship.toPositionId,
        type: relationship.type,
        patterns: relationship.patterns,
        spreadStructure: relationship.spreadStructure,
        observations: relationship.observations,
      })),
      sequenceObservations: input.symbolicReading.sequenceObservations,
      dominantStages: input.symbolicReading.dominantStages,
      reflectionQuestions: base.reflectionQuestions,
    },
  };
}

export class GeminiNarrativeProvider implements NarrativeProvider {
  constructor(
    private readonly fetcher: typeof fetch = globalThis.fetch.bind(globalThis),
    private readonly timeoutMs = 60_000,
  ) {}

  async getStatus(): Promise<GeminiProxyStatus> {
    const response = await this.fetcher("/__dev/gemini-status");
    if (!response.ok) {
      throw new GeminiProviderError("request-error", "No se pudo consultar el estado local de Gemini.");
    }
    const status: unknown = await response.json();
    if (
      !isRecord(status)
      || typeof status.configured !== "boolean"
      || typeof status.model !== "string"
    ) {
      throw new GeminiProviderError("invalid-response", "El proxy local devolvió un estado no válido.");
    }
    return { configured: status.configured, model: status.model };
  }

  async generateNarrative(input: NarrativeProviderInput): Promise<NarrativeReading> {
    if (input.externalConsent !== true) {
      throw new GeminiProviderError(
        "consent-required",
        "Se requiere consentimiento explícito antes de enviar datos a Gemini.",
      );
    }
    const restriction = getExternalNarrativeRestriction(input.reading.question);
    if (restriction) {
      throw new GeminiProviderError(
        restriction,
        restriction === "pending-review"
          ? "Esta consulta está pendiente de revisión editorial y se mantuvo en local."
          : "Por privacidad, esta consulta se mantuvo en el proveedor local.",
      );
    }

    const lens = INTERPRETATION_LENSES.find(({ id }) => id === input.lensId);
    if (!lens) {
      throw new Error(`No existe la perspectiva "${input.lensId}".`);
    }

    const base = buildNarrativeReading(input.reading, input.symbolicReading, input.lensId);
    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(() => controller.abort(), this.timeoutMs);
    let response: Response;
    try {
      response = await this.fetcher("/__dev/gemini-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(createGeminiRequestData(input, lens, base)),
      });
    } catch (error) {
      if (controller.signal.aborted) {
        throw new GeminiProviderError("timeout", "La solicitud a Gemini superó el tiempo límite.");
      }
      throw new GeminiProviderError(
        "request-error",
        error instanceof Error ? error.message : "Falló la solicitud a Gemini.",
      );
    } finally {
      globalThis.clearTimeout(timeoutId);
    }

    if (!response.ok) {
      let detail = `Gemini respondió con HTTP ${response.status}.`;
      try {
        const errorResponse: unknown = await response.json();
        if (isRecord(errorResponse) && typeof errorResponse.error === "string") {
          const localMessage = redactApiKey(errorResponse.error);
          if (response.status === 503 && localMessage.includes("ARCANA_GEMINI_API_KEY")) {
            throw new GeminiProviderError("not-configured", "No hay una clave Gemini local configurada.");
          }
          detail = localMessage;
        } else if (isRecord(errorResponse) && isRecord(errorResponse.error)) {
          const providerMessage = typeof errorResponse.error.message === "string"
            ? redactApiKey(errorResponse.error.message)
            : null;
          const providerStatus = typeof errorResponse.error.status === "string"
            ? errorResponse.error.status
            : null;
          detail = [providerStatus, providerMessage].filter(Boolean).join(": ") || detail;
        }
      } catch {
        if (response.status === 503) {
          throw new GeminiProviderError("not-configured", "No hay una clave Gemini local configurada.");
        }
      }
      throw new GeminiProviderError(
        "http-error",
        detail,
      );
    }

    let providerResponse: unknown;
    try {
      providerResponse = await response.json();
    } catch {
      throw new GeminiProviderError("invalid-response", "Gemini no devolvió una respuesta JSON válida.");
    }

    if (!isRecord(providerResponse)) {
      throw new GeminiProviderError("invalid-response", "Gemini devolvió una estructura de respuesta inválida.");
    }
    const candidates = Array.isArray(providerResponse.candidates) ? providerResponse.candidates : [];
    const firstCandidate = candidates[0];
    const content = isRecord(firstCandidate) && isRecord(firstCandidate.content)
      ? firstCandidate.content
      : null;
    const parts = content && Array.isArray(content.parts) ? content.parts : [];
    const text = parts
      .filter(isRecord)
      .map((part) => typeof part.text === "string" ? part.text : "")
      .join("")
      .trim();
    if (!text) {
      const providerError = isRecord(providerResponse.error)
        && typeof providerResponse.error.message === "string"
        ? providerResponse.error.message
        : null;
      throw new GeminiProviderError(
        "invalid-response",
        providerError ?? "La respuesta de Gemini no contenía texto estructurado.",
      );
    }

    let generated: unknown;
    try {
      generated = JSON.parse(text);
    } catch {
      throw new GeminiProviderError("invalid-response", "Gemini devolvió JSON mal formado.");
    }

    return mapAndValidateGeminiNarrative(input, generated, base);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 10_000;
}

function hasValidShape(value: unknown): value is GeminiNarrativeResponse {
  if (!isRecord(value)) {
    return false;
  }
  const cards = value.cards;
  const relationships = value.relationships;
  const reflectionQuestions = value.reflectionQuestions;
  return isNonEmptyString(value.opening)
    && isNonEmptyString(value.movement)
    && isNonEmptyString(value.synthesis)
    && Array.isArray(cards)
    && cards.every((card) =>
      isRecord(card)
      && Number.isInteger(card.positionId)
      && isNonEmptyString(card.interpretation)
      && isNonEmptyString(card.lightReflection)
      && isNonEmptyString(card.shadowReflection)
      && isNonEmptyString(card.question),
    )
    && Array.isArray(relationships)
    && relationships.every((relationship) =>
      isRecord(relationship)
      && Number.isInteger(relationship.fromPositionId)
      && Number.isInteger(relationship.toPositionId)
      && isNonEmptyString(relationship.text),
    )
    && Array.isArray(reflectionQuestions)
    && reflectionQuestions.every(isNonEmptyString);
}

function mapAndValidateGeminiNarrative(
  input: NarrativeProviderInput,
  value: unknown,
  base: NarrativeReading,
): NarrativeReading {
  if (!hasValidShape(value)) {
    throw new GeminiProviderError("invalid-response", "La respuesta no cumple el contrato narrativo.");
  }

  if (value.cards.length !== base.cards.length || value.relationships.length !== base.relationships.length) {
    throw new GeminiProviderError("invalid-response", "Gemini alteró el número de cartas o relaciones.");
  }

  const cards = value.cards.map((card, index) => {
    const original = base.cards[index];
    if (!original || card.positionId !== original.positionId) {
      throw new GeminiProviderError("invalid-response", "Gemini alteró el orden o la posición de una carta.");
    }
    return {
      ...original,
      interpretation: card.interpretation,
      lightReflection: card.lightReflection,
      shadowReflection: card.shadowReflection,
      question: card.question,
    };
  });

  const relationships = value.relationships.map((relationship, index) => {
    const original = base.relationships[index];
    if (
      !original
      || relationship.fromPositionId !== original.relationship.fromPositionId
      || relationship.toPositionId !== original.relationship.toPositionId
    ) {
      throw new GeminiProviderError("invalid-response", "Gemini alteró las relaciones calculadas por ARCANA.");
    }
    return { ...original, text: relationship.text };
  });

  if (
    value.reflectionQuestions.length !== base.reflectionQuestions.length
    || value.reflectionQuestions.some((question, index) => question !== base.reflectionQuestions[index])
  ) {
    throw new GeminiProviderError(
      "invalid-response",
      "Gemini alteró las preguntas reflexivas definidas por ARCANA.",
    );
  }

  const disclaimer = base.opening.slice(base.opening.indexOf("Las cartas no confirman"));
  const candidate = applyEditorialPolicy(input.reading, {
    ...base,
    opening: `${value.opening} ${disclaimer}`,
    cards,
    relationships,
    movement: value.movement,
    synthesis: value.synthesis,
  });
  const issues = validateNarrative(candidate);
  if (issues.length > 0) {
    throw new GeminiProviderError(
      "editorial-rejection",
      `La narrativa de Gemini no superó la política editorial (${issues.map(({ rule }) => rule).join(", ")}).`,
    );
  }
  return candidate;
}

export async function generateNarrativeWithFallback(
  input: NarrativeProviderInput,
  provider: "local" | "gemini",
  options: {
    readonly local?: NarrativeProvider;
    readonly gemini?: NarrativeProvider;
    readonly model?: string;
  } = {},
): Promise<NarrativeGenerationResult> {
  const local = options.local ?? new LocalNarrativeProvider();
  if (provider === "local") {
    return { narrative: await local.generateNarrative(input), provider: "local" };
  }

  try {
    const narrative = await (options.gemini ?? new GeminiNarrativeProvider()).generateNarrative(input);
    return { narrative, provider: "gemini", ...(options.model ? { model: options.model } : {}) };
  } catch (error) {
    const reason = error instanceof GeminiProviderError ? error.reason : "request-error";
    const narrative = await local.generateNarrative(input);
    return {
      narrative,
      provider: "local",
      fallbackReason: reason,
      ...(error instanceof GeminiProviderError
        ? { fallbackDetail: redactApiKey(error.message) }
        : {}),
      ...(options.model ? { model: options.model } : {}),
    };
  }
}
