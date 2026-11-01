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
  constituirse: "Constituirse",
  "entrar-en-el-mundo": "Entrar en el mundo",
  transformarse: "Transformarse",
  reintegrarse: "Reintegrarse",
};

const PATTERN_LABELS: Readonly<Record<SymbolicRelationshipPattern, string>> = {
  continuity: "continuidad",
  contrast: "contraste estructural",
  reinforcement: "refuerzo",
  tension: "tensión",
  transition: "transición",
  repetition: "repetición conceptual",
  "stage-progression": "progresión entre etapas",
  "stage-return": "retorno a una etapa anterior",
  "stage-jump": "salto entre etapas",
};

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
  return `Esta lectura simbólica de «${reading.spread.name}», contemplada desde la lente ${lens.name}, toma como punto de partida la pregunta que has formulado. Las cartas no confirman hechos ni predicen resultados; ofrecen imágenes y relaciones para una reflexión personal.`;
}

function buildRelationshipText(
  relationship: SymbolicCardRelationship,
  lens: InterpretationTradition,
): string {
  const fromName = getArcanaNameForNarrative(relationship.fromCardId);
  const toName = getArcanaNameForNarrative(relationship.toCardId);
  const detectedPatterns = relationship.patterns
    .map((pattern) => PATTERN_LABELS[pattern])
    .join(" y ");
  const observation = relationship.observations[0]
    ?? "estas posiciones aparecen vinculadas en la lectura simbólica";

  return `${fromName} y ${toName} quedan relacionados por ${detectedPatterns}, según el análisis simbólico. Desde la lente ${lens.name}, ${observation.charAt(0).toLocaleLowerCase("es")}${observation.slice(1)} Esta relación puede contemplarse como una posibilidad, no como un hecho sobre tu situación.`;
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
    .join(" → ");
  const sequence = symbolicReading.sequenceObservations.join(" ");
  const endpoints = first.positionId === last.positionId
    ? `La lectura se concentra en ${getArcanaNameForNarrative(first.arcanaId)}.`
    : `El recorrido comienza con ${getArcanaNameForNarrative(first.arcanaId)} en la posición ${first.positionId} y concluye con ${getArcanaNameForNarrative(last.arcanaId)} en la posición ${last.positionId}.`;
  const stageMovement = stages.length > 0
    ? ` Los movimientos más presentes son ${stages}.`
    : "";

  return `La secuencia sugiere simbólicamente un recorrido. ${endpoints}${stageMovement}${sequence ? ` ${sequence}` : ""}`;
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
    ? `El movimiento más representado es ${STAGE_LABELS[dominantStage]}`
    : "La tirada reúne varios movimientos del viaje";
  const tensionClause = symbolicReading.tensions.length > 0
    ? ` Las tensiones detectadas en ${symbolicReading.tensions.length} relación(es) invitan a observar los cambios de dirección sin reducirlos a una oposición fija.`
    : "";
  const reinforcementClause = symbolicReading.reinforcements.length > 0
    ? ` También aparecen ${symbolicReading.reinforcements.length} relación(es) de refuerzo o repetición conceptual.`
    : "";
  const mainRelationship = symbolicReading.relationships[0];
  const relationshipClause = mainRelationship
    ? ` Entre sus vínculos, ${getArcanaNameForNarrative(mainRelationship.fromCardId)} y ${getArcanaNameForNarrative(mainRelationship.toCardId)} forman una relación de ${mainRelationship.patterns.map((pattern) => PATTERN_LABELS[pattern]).join(" y ")} ya identificada por la lectura simbólica.`
    : "";

  return `${stageClause}. El paso de ${getArcanaNameForNarrative(first.arcanaId)} en la posición ${first.positionId} a ${getArcanaNameForNarrative(last.arcanaId)} en la posición ${last.positionId} permite contemplar cómo el núcleo de la tirada se relaciona con su cierre, sin afirmar un desenlace.${relationshipClause}${tensionClause}${reinforcementClause} Una posible síntesis es observar qué aspectos de este recorrido resuenan con la pregunta y cuáles permanecen abiertos.`;
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
    narrateCard(card, { question: reading.question, lens: lens.id }),
  );

  const narrative = applyEditorialPolicy(reading, {
    opening: buildOpening(reading, lens),
    cards,
    relationships: symbolicReading.relationships.map((relationship) => ({
      relationship,
      text: buildRelationshipText(relationship, lens),
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
