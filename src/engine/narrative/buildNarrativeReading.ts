import { INTERPRETATION_LENSES } from "../../data/traditions/traditions";
import { applyEditorialPolicy } from "../editorial/applyEditorialPolicy";
import { validateNarrative } from "../editorial/prohibitedClaims";
import type {
  InterpretationLensId,
  InterpretationTradition,
  JourneyStage,
  NarrativeCard,
  NarrativeReading,
  ReadingSession,
  SymbolicCardRelationship,
  SymbolicRelationshipPattern,
  SymbolicReading,
} from "../../types/domain";
import { getArcanaNameForNarrative, narrateCard } from "./narrativeTemplates";

const STAGE_LABELS: Readonly<Record<JourneyStage, string>> = {
  constituirse: "dar forma a una posibilidad",
  "entrar-en-el-mundo": "llevar una idea a la práctica",
  transformarse: "atravesar un cambio",
  reintegrarse: "integrar lo aprendido",
};

const PATTERN_LABELS: Readonly<Record<SymbolicRelationshipPattern, string>> = {
  continuity: "un hilo que continúa",
  contrast: "un contraste",
  reinforcement: "un refuerzo",
  tension: "una tensión",
  transition: "un cambio de dirección",
  repetition: "una idea que reaparece",
  "stage-progression": "un paso hacia otra etapa",
  "stage-return": "un regreso a una etapa anterior",
  "stage-jump": "un salto entre etapas",
};

function joinInSpanish(values: readonly string[]): string {
  if (values.length < 2) {
    return values[0] ?? "";
  }
  const last = values[values.length - 1];
  return `${values.slice(0, -1).join(", ")} y ${last}`;
}

function getLens(
  lensId: InterpretationLensId,
): InterpretationTradition & { readonly id: InterpretationLensId } {
  const lens = INTERPRETATION_LENSES.find(({ id }) => id === lensId);
  if (!lens) {
    throw new Error(`No existe la lente interpretativa "${lensId}".`);
  }
  return lens;
}

function buildOpening(reading: ReadingSession, lens: InterpretationTradition): string {
  const question = reading.question.trim();
  const punctuation = /[.!?]$/u.test(question) ? "" : ".";

  return `Has preguntado: «${question}»${punctuation} La tirada «${reading.spread.name}» ofrece una forma simbólica de mirar el tema desde ${lens.name}. No es una respuesta cerrada ni una predicción; tómala como un punto de partida. Las cartas no confirman hechos ni predicen resultados.`;
}

function buildRelationshipText(
  relationship: SymbolicCardRelationship,
): string {
  const fromName = getArcanaNameForNarrative(relationship.fromCardId);
  const toName = getArcanaNameForNarrative(relationship.toCardId);
  const detectedPatterns = joinInSpanish(
    relationship.patterns.map((pattern) => PATTERN_LABELS[pattern]),
  );

  return `La relación entre ${fromName} y ${toName} combina ${detectedPatterns}. Si te resuena, puedes preguntarte qué te resulta familiar en ese vínculo y qué posibilidad distinta quieres explorar. Es una lectura posible, no una afirmación sobre tu situación.`;
}

function buildMovement(symbolicReading: SymbolicReading): string {
  if (symbolicReading.cards.length === 0) {
    throw new Error("La lectura simbólica no contiene cartas para narrar su movimiento.");
  }

  const first = symbolicReading.cards[0];
  const last = symbolicReading.cards[symbolicReading.cards.length - 1];
  if (!first || !last) {
    throw new Error("No se pudo determinar el inicio o el cierre de la secuencia.");
  }

  const stages = symbolicReading.dominantStages
    .map((stage) => STAGE_LABELS[stage])
    ;
  const stageSummary = joinInSpanish(stages);
  const sequence = symbolicReading.sequenceObservations.join(" ");
  const endpoints = first.positionId === last.positionId
    ? `se centra en ${getArcanaNameForNarrative(first.arcanaId)}`
    : `empieza con ${getArcanaNameForNarrative(first.arcanaId)} en la posición ${first.positionId} y llega a ${getArcanaNameForNarrative(last.arcanaId)} en la posición ${last.positionId}`;
  const stageMovement = stages.length > 0
    ? ` En el camino aparecen estos movimientos: ${stageSummary}.`
    : "";

  return `Si miras las cartas como un recorrido, ${endpoints}.${stageMovement}${sequence ? ` ${sequence}` : ""} Puedes preguntarte qué cambió entre el inicio y el cierre; la secuencia no anuncia un resultado.`;
}

function buildSynthesis(
  symbolicReading: SymbolicReading,
  cards: readonly NarrativeCard[],
): string {
  const first = cards[0];
  const last = cards[cards.length - 1];
  if (!first || !last) {
    throw new Error("Se necesitan cartas narrativas para construir la síntesis.");
  }

  const dominantStage = symbolicReading.dominantStages[0];
  const stageClause = dominantStage
    ? `El foco está en ${STAGE_LABELS[dominantStage]}`
    : "La tirada reúne varios movimientos del recorrido";
  const tensionCount = symbolicReading.tensions.length;
  const tensionClause = tensionCount > 0
    ? tensionCount === 1
      ? " También aparece una tensión; puedes mirarla sin forzar una sola respuesta."
      : " También aparecen varias tensiones; puedes observarlas sin forzar una sola respuesta."
    : "";
  const reinforcementClause = symbolicReading.reinforcements.length > 0
    ? " Algunos vínculos refuerzan una misma idea."
    : "";
  const mainRelationship = symbolicReading.relationships[0];
  const relationshipClause = mainRelationship
    ? ` Un vínculo que destaca es el de ${getArcanaNameForNarrative(mainRelationship.fromCardId)} y ${getArcanaNameForNarrative(mainRelationship.toCardId)}: ${joinInSpanish(mainRelationship.patterns.map((pattern) => PATTERN_LABELS[pattern]))}.`
    : "";

  return `${stageClause}. Las cartas van de ${getArcanaNameForNarrative(first.arcanaId)} en la posición ${first.positionId} a ${getArcanaNameForNarrative(last.arcanaId)} en la posición ${last.positionId}.${relationshipClause}${tensionClause}${reinforcementClause} Si te sirve, una forma de aterrizarlo es preguntarte: ¿qué pequeño paso, dentro de tu control, te ayudaría a explorar esta idea? No hace falta resolverlo todo hoy.`;
}

function buildReflectionQuestions(
  reading: ReadingSession,
  symbolicReading: SymbolicReading,
  cards: readonly NarrativeCard[],
): string[] {
  const questions: string[] = [];
  const openingCard = cards[0];
  const closingCard = cards[cards.length - 1];

  if (openingCard) {
    questions.push(openingCard.question);
  }
  if (closingCard && closingCard.positionId !== openingCard?.positionId) {
    questions.push(closingCard.question);
  }
  if (symbolicReading.tensions.length > 0) {
    const tension = symbolicReading.tensions[0];
    if (tension) {
      questions.push(
        `Al volver a «${reading.question.trim()}», ¿qué dos perspectivas de esta tensión puedes sostener a la vez?`,
      );
    }
  } else if (symbolicReading.relationships.length > 0) {
    questions.push(
      `¿Qué relación entre las posiciones de «${reading.spread.name}» te ayuda a mirar tu pregunta desde otro ángulo?`,
    );
  }

  return [...new Set(questions)].slice(0, 3);
}

export function buildNarrativeReading(
  reading: ReadingSession,
  symbolicReading: SymbolicReading,
  lensId: InterpretationLensId,
): NarrativeReading {
  if (
    reading.drawnCards.length !== reading.spread.positions.length
    || symbolicReading.cards.length !== reading.spread.positions.length
  ) {
    throw new Error("La lectura sorteada, la tirada y la lectura simbólica deben contener el mismo número de cartas.");
  }

  const drawnCardsByPosition = new Map<number, string>();
  for (const drawnCard of reading.drawnCards) {
    if (drawnCardsByPosition.has(drawnCard.position)) {
      throw new Error(`La lectura sorteada repite la posición ${drawnCard.position}.`);
    }
    drawnCardsByPosition.set(drawnCard.position, drawnCard.arcanaId);
  }

  for (const [index, position] of reading.spread.positions.entries()) {
    const drawnCardId = drawnCardsByPosition.get(position.id);
    const symbolicCard = symbolicReading.cards[index];
    if (!drawnCardId || !symbolicCard) {
      throw new Error(`Falta una carta sorteada o interpretada en la posición ${position.id}.`);
    }
    if (symbolicCard.positionId !== position.id || symbolicCard.arcanaId !== drawnCardId) {
      throw new Error(`La carta simbólica no coincide con la carta sorteada en la posición ${position.id}.`);
    }
  }

  const lens = getLens(lensId);
  const cards = symbolicReading.cards.map((card) =>
    narrateCard(card, { lens: lens.id }),
  );

  const narrative = applyEditorialPolicy(reading, {
    opening: buildOpening(reading, lens),
    cards,
    relationships: symbolicReading.relationships.map((relationship) => ({
      relationship,
      text: buildRelationshipText(relationship),
    })),
    movement: buildMovement(symbolicReading),
    synthesis: buildSynthesis(symbolicReading, cards),
    reflectionQuestions: buildReflectionQuestions(reading, symbolicReading, cards),
    lens,
    editorialCategory: "NON_SENSITIVE",
    thirdPartyFocus: false,
    prioritizeRealWorldSupport: false,
  });
  const issues = validateNarrative(narrative);
  if (issues.length > 0) {
    throw new Error(
      `La narrativa no superó la validación editorial: ${issues.map(({ rule, section }) => `${rule} (${section})`).join(", ")}.`,
    );
  }
  return narrative;
}
