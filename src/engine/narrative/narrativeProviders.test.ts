import { describe, expect, it, vi } from "vitest";
import { SPREADS } from "../../data/spreads/spreads";
import { getExternalNarrativeRestriction } from "../editorial/classifySensitiveQuestion";
import { buildSymbolicReading } from "../interpretation/localSymbolicEngine";
import type {
  InterpretationLensId,
  NarrativeReading,
  ReadingSession,
  Spread,
} from "../../types/domain";
import { buildNarrativeReading } from "./buildNarrativeReading";
import {
  generateNarrativeWithFallback,
  GeminiNarrativeProvider,
  LocalNarrativeProvider,
  type NarrativeProviderInput,
} from "./narrativeProviders";

function createInput(
  question = "¿Qué puede ayudar a desarrollar este proyecto?",
  lensId: InterpretationLensId = "hermetic-rosicrucian",
  spreadId = "la-semilla",
): NarrativeProviderInput {
  const spread: Spread = SPREADS.find(({ id }) => id === spreadId)
    ?? (() => { throw new Error(`No existe la tirada ${spreadId}.`); })();
  const reading: ReadingSession = {
    question,
    spread,
    drawnCards: spread.positions.map(({ id }, index) => ({
      position: id,
      arcanaId: ["major-02", "major-16", "major-19"][index] ?? "major-00",
    })),
    relationships: spread.relationships,
  };
  const symbolicReading = buildSymbolicReading(reading);
  return { reading, symbolicReading, lensId };
}

function validStructuredNarrative(base: NarrativeReading) {
  return {
    opening: "La secuencia ofrece una imagen para contemplar.",
    cards: base.cards.map((card) => ({
      positionId: card.positionId,
      interpretation: `${card.interpretation} (versión Gemini)`,
      lightReflection: card.lightReflection,
      shadowReflection: card.shadowReflection,
      question: card.question,
    })),
    relationships: base.relationships.map(({ relationship, text }) => ({
      fromPositionId: relationship.fromPositionId,
      toPositionId: relationship.toPositionId,
      text: `${text} (versión Gemini)`,
    })),
    movement: `${base.movement} (versión Gemini)`,
    synthesis: `${base.synthesis} (versión Gemini)`,
    reflectionQuestions: [...base.reflectionQuestions],
  };
}

function geminiResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify({
    candidates: [{
      content: { parts: [{ text: JSON.stringify(value) }] },
    }],
  }), { status, headers: { "Content-Type": "application/json" } });
}

function mockedFetch(response: Response): typeof fetch {
  return vi.fn<typeof fetch>().mockResolvedValue(response);
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.values(value).forEach((nested) => deepFreeze(nested));
    Object.freeze(value);
  }
  return value;
}

describe("narrative providers", () => {
  it("keeps the local provider self-contained and independent of Gemini", async () => {
    const input = createInput();
    const local = await new LocalNarrativeProvider().generateNarrative(input);
    const expected = buildNarrativeReading(input.reading, input.symbolicReading, input.lensId);

    expect(local).toEqual(expected);
    expect(local.cards.map(({ arcanaId, positionId }) => [arcanaId, positionId]))
      .toEqual(input.symbolicReading.cards.map(({ arcanaId, positionId }) => [arcanaId, positionId]));
  });

  it("does not call the Gemini proxy when explicit consent is absent", async () => {
    const input = createInput();
    const base = buildNarrativeReading(input.reading, input.symbolicReading, input.lensId);
    const fetcher = mockedFetch(geminiResponse(validStructuredNarrative(base)));
    const result = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(fetcher),
    });

    expect(fetcher).not.toHaveBeenCalled();
    expect(result.provider).toBe("local");
    expect(result.fallbackReason).toBe("consent-required");
  });

  it("falls back locally when the development proxy has no key configured", async () => {
    const input = { ...createInput(), externalConsent: true };
    const fetcher = mockedFetch(new Response(JSON.stringify({
      error: "ARCANA_GEMINI_API_KEY is not configured locally.",
    }), { status: 503, headers: { "Content-Type": "application/json" } }));
    const result = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(fetcher),
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result.provider).toBe("local");
    expect(result.fallbackReason).toBe("not-configured");
  });

  it("uses a valid structured response while preserving card identities and relations", async () => {
    const input = { ...createInput(), externalConsent: true };
    const frozenReading = deepFreeze({
      ...input.reading,
      drawnCards: input.reading.drawnCards.map((card) => ({ ...card })),
    });
    const frozenSymbolic = deepFreeze({
      ...input.symbolicReading,
      cards: input.symbolicReading.cards.map((card) => ({ ...card })),
      relationships: input.symbolicReading.relationships.map((relationship) => ({ ...relationship })),
    });
    const immutableInput = { ...input, reading: frozenReading, symbolicReading: frozenSymbolic };
    const base = buildNarrativeReading(immutableInput.reading, frozenSymbolic, input.lensId);
    const fetcher = mockedFetch(geminiResponse(validStructuredNarrative(base)));
    const random = vi.spyOn(Math, "random").mockImplementation(() => {
      throw new Error("Narrative providers must never use randomness.");
    });

    try {
      const result = await generateNarrativeWithFallback(immutableInput, "gemini", {
        gemini: new GeminiNarrativeProvider(fetcher),
        model: "gemini-test-model",
      });

      expect(result.provider).toBe("gemini");
      expect(result.model).toBe("gemini-test-model");
      expect(result.narrative.cards.map(({ arcanaId, positionId }) => [arcanaId, positionId]))
        .toEqual(input.reading.drawnCards.map(({ arcanaId, position }) => [arcanaId, position]));
      expect(result.narrative.relationships.map(({ relationship }) => relationship))
        .toEqual(input.symbolicReading.relationships);
      expect(result.narrative.cards[0]?.interpretation).toContain("versión Gemini");
      expect(result.narrative.reflectionQuestions).toEqual(base.reflectionQuestions);
      expect(frozenSymbolic).toEqual(input.symbolicReading);
      expect(frozenReading.drawnCards).toEqual(input.reading.drawnCards);
      expect(random).not.toHaveBeenCalled();
    } finally {
      random.mockRestore();
    }
  });

  it("falls back when Gemini returns malformed JSON or a shape with altered positions", async () => {
    const input = { ...createInput(), externalConsent: true };
    const malformed = mockedFetch(new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: "{bad json" }] } }],
    })));
    const malformedResult = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(malformed),
    });
    expect(malformedResult).toMatchObject({ provider: "local", fallbackReason: "invalid-response" });

    const base = buildNarrativeReading(input.reading, input.symbolicReading, input.lensId);
    const invalid = validStructuredNarrative(base);
    invalid.cards[0]!.positionId = 99;
    const changedPosition = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(mockedFetch(geminiResponse(invalid))),
    });
    expect(changedPosition).toMatchObject({ provider: "local", fallbackReason: "invalid-response" });
  });

  it("sends only narrative context and omits internal identifiers and redundant metrics", async () => {
    const input = { ...createInput(), externalConsent: true };
    const base = buildNarrativeReading(input.reading, input.symbolicReading, input.lensId);
    const requests: Record<string, unknown>[] = [];
    const fetcher: typeof fetch = async (_request, init) => {
      requests.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
      return geminiResponse(validStructuredNarrative(base));
    };

    const result = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(fetcher),
    });
    const sent = requests[0];
    expect(result.provider).toBe("gemini");
    expect(sent).toBeDefined();
    expect(Object.keys(sent ?? {}).sort()).toEqual(["lens", "question", "spread", "symbolicReading"]);
    const sentSymbolic = sent?.symbolicReading as {
      cards: readonly Record<string, unknown>[];
      relationships: readonly Record<string, unknown>[];
      readonly [key: string]: unknown;
    };
    expect(sentSymbolic.cards[0]).toHaveProperty("arcanaName");
    expect(sentSymbolic.cards[0]).not.toHaveProperty("arcanaId");
    expect(sentSymbolic.relationships[0]).not.toHaveProperty("strength");
    expect(sentSymbolic).not.toHaveProperty("tensions");
    expect(sentSymbolic).not.toHaveProperty("reinforcements");
  });

  it("keeps ARCANA's final reflection questions for spreads with many positions", async () => {
    const input = { ...createInput(undefined, undefined, "el-sendero"), externalConsent: true };
    const base = buildNarrativeReading(input.reading, input.symbolicReading, input.lensId);
    const requests: Record<string, unknown>[] = [];
    const fetcher: typeof fetch = async (_request, init) => {
      requests.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
      return geminiResponse(validStructuredNarrative(base));
    };
    const result = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(fetcher),
    });
    const sent = requests[0];
    const symbolicData = sent?.symbolicReading as { readonly reflectionQuestions: readonly string[] };

    expect(result.provider).toBe("gemini");
    expect(input.symbolicReading.reflectionQuestions.length).toBeGreaterThan(
      base.reflectionQuestions.length,
    );
    expect(symbolicData.reflectionQuestions).toEqual(base.reflectionQuestions);
    expect(result.narrative.reflectionQuestions).toEqual(base.reflectionQuestions);
  });

  it("falls back locally and exposes a redacted provider diagnostic for HTTP errors", async () => {
    const input = { ...createInput(), externalConsent: true };
    const result = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(mockedFetch(new Response(JSON.stringify({
        error: {
          status: "NOT_FOUND",
          message: "Model not found for API key=secret-value",
        },
      }), { status: 404, headers: { "Content-Type": "application/json" } }))),
    });
    expect(result).toMatchObject({
      provider: "local",
      fallbackReason: "http-error",
      fallbackDetail: "NOT_FOUND: Model not found for API key=[redactado]",
    });
  });

  it("does not mistake an upstream Gemini 503 for a missing local key", async () => {
    const input = { ...createInput(), externalConsent: true };
    const result = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(mockedFetch(new Response(JSON.stringify({
        error: {
          status: "UNAVAILABLE",
          message: "Gemini is temporarily unavailable.",
        },
      }), { status: 503, headers: { "Content-Type": "application/json" } }))),
    });

    expect(result).toMatchObject({
      provider: "local",
      fallbackReason: "http-error",
      fallbackDetail: "UNAVAILABLE: Gemini is temporarily unavailable.",
    });
  });

  it("falls back locally when a request times out", async () => {
    const input = { ...createInput(), externalConsent: true };
    const fetcher: typeof fetch = (_request, options) => new Promise((_resolve, reject) => {
      options?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    });
    const result = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(fetcher, 1),
    });
    expect(result).toMatchObject({ provider: "local", fallbackReason: "timeout" });
  });

  it("rejects editorially prohibited text before it can be shown", async () => {
    const input = { ...createInput(), externalConsent: true };
    const base = buildNarrativeReading(input.reading, input.symbolicReading, input.lensId);
    const generated = validStructuredNarrative(base);
    generated.synthesis = "Las cartas predicen que todo ocurrirá inevitablemente.";
    const result = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(mockedFetch(geminiResponse(generated))),
    });
    expect(result).toMatchObject({ provider: "local", fallbackReason: "editorial-rejection" });
  });

  it.each([
    "¿Qué tratamiento debería elegir para mi enfermedad?",
    "¿Qué piensa mi pareja de mí?",
  ])("never sends a sensitive or third-party question externally: %s", async (question) => {
    const input = { ...createInput(question), externalConsent: true };
    const fetcher = mockedFetch(geminiResponse({}));
    const result = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(fetcher),
    });

    expect(fetcher).not.toHaveBeenCalled();
    expect(result).toMatchObject({ provider: "local", fallbackReason: "sensitive-question" });
  });

  it("keeps exact unresolved editorial-corpus cases local", async () => {
    const input = {
      ...createInput("¿Es el momento adecuado para aceptar esta propuesta?"),
      externalConsent: true,
    };
    const fetcher = mockedFetch(geminiResponse({}));
    const result = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(fetcher),
    });

    expect(getExternalNarrativeRestriction(input.reading.question)).toBe("pending-review");
    expect(fetcher).not.toHaveBeenCalled();
    expect(result).toMatchObject({ provider: "local", fallbackReason: "pending-review" });
  });

  it.each([
    "hermetic-rosicrucian",
    "marseille",
    "rider-waite-smith",
    "psychological-archetypal",
    "intuitive-contemplative",
    "synthesis",
  ] as const)("supports the %s perspective without changing the reading", async (lensId) => {
    const input = { ...createInput(undefined, lensId), externalConsent: true };
    const base = buildNarrativeReading(input.reading, input.symbolicReading, lensId);
    const result = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(
        mockedFetch(geminiResponse(validStructuredNarrative(base))),
      ),
    });

    expect(result.provider).toBe("gemini");
    expect(result.narrative.lens.id).toBe(lensId);
    expect(result.narrative.cards.map(({ arcanaId, positionId }) => [arcanaId, positionId]))
      .toEqual(input.reading.drawnCards.map(({ arcanaId, position }) => [arcanaId, position]));
  });

  it("keeps local and Gemini narratives attached to the same immutable reading", async () => {
    const input = { ...createInput(), externalConsent: true };
    const local = await generateNarrativeWithFallback(input, "local");
    const base = local.narrative;
    const gemini = await generateNarrativeWithFallback(input, "gemini", {
      gemini: new GeminiNarrativeProvider(
        mockedFetch(geminiResponse(validStructuredNarrative(base))),
      ),
    });

    expect(local.narrative.cards.map(({ arcanaId, positionId }) => [arcanaId, positionId]))
      .toEqual(gemini.narrative.cards.map(({ arcanaId, positionId }) => [arcanaId, positionId]));
    expect(gemini.narrative.relationships.map(({ relationship }) => relationship))
      .toEqual(local.narrative.relationships.map(({ relationship }) => relationship));
    expect(input.symbolicReading).toEqual(buildSymbolicReading(input.reading));
  });
});
