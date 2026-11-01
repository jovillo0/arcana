import { ARCANA_BY_ID } from "../../data/arcana/arcana";
import type {
  Arcana,
  CardInterpretation,
  JourneyStage,
  ReadingSession,
  SpreadPosition,
  SymbolicCardRelationship,
  SymbolicReading,
  SymbolicRelationshipPattern,
} from "../../types/domain";

const JOURNEY_STAGES: readonly JourneyStage[] = [
  "constituirse",
  "entrar-en-el-mundo",
  "transformarse",
  "reintegrarse",
];

const STAGE_LABELS: Readonly<Record<JourneyStage, string>> = {
  constituirse: "Constituirse",
  "entrar-en-el-mundo": "Entrar en el mundo",
  transformarse: "Transformarse",
  reintegrarse: "Reintegrarse",
};

const STOP_WORDS = new Set([
  "aquello", "desde", "entre", "hacia", "para", "puede", "pueden",
  "todavia", "sobre", "dentro", "forma", "relacion", "hacer", "dejar",
  "permitir", "aquella", "aquello", "cuando", "donde", "mismo", "misma",
]);

const PATTERN_PRIORITY: Readonly<Record<SymbolicRelationshipPattern, number>> = {
  tension: 0,
  contrast: 1,
  "stage-jump": 2,
  "stage-return": 3,
  "stage-progression": 4,
  transition: 5,
  repetition: 6,
  reinforcement: 7,
  continuity: 8,
};

function stageIndex(stage: JourneyStage): number {
  return JOURNEY_STAGES.indexOf(stage);
}

function tokenize(text: string): ReadonlySet<string> {
  return new Set(
    text
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .match(/\p{L}{5,}/gu)
      ?.filter((word) => !STOP_WORDS.has(word)) ?? [],
  );
}

function sharedConcepts(first: Arcana, second: Arcana): string[] {
  const firstTerms = tokenize(`${first.symbolicCore} ${first.transformativePrinciple}`);
  const secondTerms = tokenize(`${second.symbolicCore} ${second.transformativePrinciple}`);
  return [...firstTerms].filter((term) => secondTerms.has(term));
}

function getCard(id: string): Arcana {
  const card = ARCANA_BY_ID.get(id);
  if (!card) {
    throw new Error(`No se encontró el Arcano con identificador "${id}".`);
  }
  return card;
}

function getPosition(positionId: number, reading: ReadingSession): SpreadPosition {
  const position = reading.spread.positions.find(({ id }) => id === positionId);
  if (!position) {
    throw new Error(
      `La tirada "${reading.spread.id}" no define la posición ${positionId} de la lectura.`,
    );
  }
  return position;
}

function orderedDraw(reading: ReadingSession) {
  if (reading.drawnCards.length !== reading.spread.positions.length) {
    throw new Error(
      `La lectura contiene ${reading.drawnCards.length} cartas para ${reading.spread.positions.length} posiciones.`,
    );
  }

  const cardsByPosition = new Map<number, (typeof reading.drawnCards)[number]>();
  for (const drawnCard of reading.drawnCards) {
    if (cardsByPosition.has(drawnCard.position)) {
      throw new Error(`La lectura contiene más de una carta en la posición ${drawnCard.position}.`);
    }
    cardsByPosition.set(drawnCard.position, drawnCard);
  }

  return reading.spread.positions.map((position) => {
    const drawnCard = cardsByPosition.get(position.id);
    if (!drawnCard) {
      throw new Error(`La lectura no contiene una carta para la posición ${position.id}.`);
    }
    return drawnCard;
  });
}

export function interpretCardInPosition(
  arcana: Arcana,
  position: SpreadPosition,
): CardInterpretation {
  return {
    arcanaId: arcana.id,
    positionId: position.id,
    positionName: position.name,
    positionMeaning: position.description,
    core: arcana.symbolicCore,
    lightDimension: arcana.light,
    shadowDimension: arcana.shadow,
    geometry: arcana.geometry,
    symbols: [...arcana.symbols],
    transformativePrinciple: arcana.transformativePrinciple,
    initiatoryQuestion: arcana.initiatoryQuestion,
    stage: arcana.journeyStage,
    observations: [
      `En esta posición, «${position.name}» dirige la atención hacia ${position.description.charAt(0).toLocaleLowerCase("es")}${position.description.slice(1)}`,
      "Las dimensiones luminosa y sombría son posibilidades del mismo principio; la posición no selecciona una de ellas automáticamente.",
    ],
  };
}

function describeStageMovement(
  fromCard: Arcana,
  toCard: Arcana,
  stageDelta: number,
  cardDelta: number,
): { patterns: SymbolicRelationshipPattern[]; observations: string[] } {
  if (stageDelta > 1) {
    return {
      patterns: ["stage-jump", "contrast"],
      observations: [
        `La secuencia pasa de ${STAGE_LABELS[fromCard.journeyStage]} a ${STAGE_LABELS[toCard.journeyStage]}, con un salto entre movimientos.`,
        "Este contraste describe la estructura del recorrido, no una oposición fija entre los Arcanos.",
      ],
    };
  }

  if (stageDelta === 1) {
    return {
      patterns: ["transition", "stage-progression"],
      observations: [
        `La secuencia avanza de ${STAGE_LABELS[fromCard.journeyStage]} hacia ${STAGE_LABELS[toCard.journeyStage]}.`,
        "Puede contemplarse como una transición entre movimientos del recorrido de ARCANA.",
      ],
    };
  }

  if (stageDelta < -1) {
    return {
      patterns: ["stage-jump", "stage-return", "contrast"],
      observations: [
        `La secuencia retorna de ${STAGE_LABELS[fromCard.journeyStage]} a ${STAGE_LABELS[toCard.journeyStage]}, saltando movimientos.`,
        "El retorno señala una relación estructural con una etapa anterior, no una regresión personal.",
      ],
    };
  }

  if (stageDelta === -1) {
    return {
      patterns: ["transition", "stage-return"],
      observations: [
        `La secuencia vuelve de ${STAGE_LABELS[fromCard.journeyStage]} a ${STAGE_LABELS[toCard.journeyStage]}.`,
        "Puede leerse como retorno a un principio anterior desde otro punto del recorrido.",
      ],
    };
  }

  if (cardDelta > 0) {
    return {
      patterns: ["continuity", "stage-progression"],
      observations: [
        `Ambos Arcanos pertenecen a ${STAGE_LABELS[fromCard.journeyStage]} y la secuencia avanza dentro de ese movimiento.`,
      ],
    };
  }

  if (cardDelta < 0) {
    return {
      patterns: ["continuity", "stage-return"],
      observations: [
        `Ambos Arcanos pertenecen a ${STAGE_LABELS[fromCard.journeyStage]} y la secuencia vuelve a un principio anterior dentro de ese movimiento.`,
      ],
    };
  }

  return {
    patterns: ["continuity"],
    observations: [
      `Ambos Arcanos participan del movimiento ${STAGE_LABELS[fromCard.journeyStage]}.`,
    ],
  };
}

export function analyzeRelationships(
  reading: ReadingSession,
): SymbolicCardRelationship[] {
  const orderedCards = orderedDraw(reading);
  const relationships: SymbolicCardRelationship[] = [];
  let previousNonZeroDirection = 0;

  for (let fromIndex = 0; fromIndex < orderedCards.length; fromIndex += 1) {
    for (let toIndex = fromIndex + 1; toIndex < orderedCards.length; toIndex += 1) {
      const fromDraw = orderedCards[fromIndex];
      const toDraw = orderedCards[toIndex];
      if (!fromDraw || !toDraw) {
        throw new Error("No se pudo establecer una relación entre las cartas ordenadas.");
      }

      const fromCard = getCard(fromDraw.arcanaId);
      const toCard = getCard(toDraw.arcanaId);
      const stageDelta = stageIndex(toCard.journeyStage) - stageIndex(fromCard.journeyStage);
      const cardDelta = toCard.number - fromCard.number;
      const movement = describeStageMovement(fromCard, toCard, stageDelta, cardDelta);
      const patterns = [...movement.patterns];
      const observations = [...movement.observations];
      const concepts = sharedConcepts(fromCard, toCard);
      const spreadStructure = reading.spread.relationships
        .filter((relationship) =>
          relationship.fromPositions.includes(fromDraw.position)
          && relationship.toPositions.includes(toDraw.position),
        )
        .map(({ type, description }) => ({ type, description }));

      observations.push(
        ...spreadStructure.map(({ description }) =>
          `La estructura de «${reading.spread.name}» vincula estas posiciones: ${description}`,
        ),
      );

      if (concepts.length > 0) {
        patterns.push("repetition", "reinforcement");
        observations.push(
          `Los principios comparten términos simbólicos (${concepts.join(", ")}), que reaparecen con el matiz propio de cada posición.`,
        );
      }

      if (toIndex === fromIndex + 1 && stageDelta !== 0) {
        const direction = Math.sign(stageDelta);
        if (previousNonZeroDirection !== 0 && direction !== previousNonZeroDirection) {
          patterns.push("tension");
          observations.push(
            "El sentido del movimiento entre etapas cambia respecto al paso anterior; puede contemplarse como una tensión o giro de la secuencia.",
          );
        }
        previousNonZeroDirection = direction;
      }

      const uniquePatterns = [...new Set(patterns)].sort(
        (left, right) => PATTERN_PRIORITY[left] - PATTERN_PRIORITY[right],
      );
      const primaryPattern = uniquePatterns[0];
      if (!primaryPattern) {
        throw new Error("No se pudo clasificar la relación simbólica.");
      }

      relationships.push({
        fromCardId: fromCard.id,
        fromPositionId: fromDraw.position,
        toCardId: toCard.id,
        toPositionId: toDraw.position,
        type: primaryPattern,
        patterns: uniquePatterns,
        spreadStructure,
        strength: Math.min(0.95, 0.35 + (uniquePatterns.length - 1) * 0.12 + (concepts.length > 0 ? 0.1 : 0)),
        observations,
      });
    }
  }

  return relationships;
}

function describeSequence(relationship: SymbolicCardRelationship): string {
  const fromCard = getCard(relationship.fromCardId);
  const toCard = getCard(relationship.toCardId);
  const isAdjacent = relationship.toPositionId === relationship.fromPositionId + 1;

  if (!isAdjacent) {
    return `Entre las posiciones ${relationship.fromPositionId} y ${relationship.toPositionId}, ${fromCard.name} y ${toCard.name} comparten una relación de ${relationship.type.replaceAll("-", " ")}.`;
  }

  return `La secuencia pasa de ${fromCard.name} (${STAGE_LABELS[fromCard.journeyStage]}) a ${toCard.name} (${STAGE_LABELS[toCard.journeyStage]}): ${relationship.observations[0]?.charAt(0).toLocaleLowerCase("es") ?? "los principios se ponen en relación"}`;
}

export function buildSymbolicReading(reading: ReadingSession): SymbolicReading {
  const orderedCards = orderedDraw(reading);
  const cards = orderedCards.map((drawnCard) => {
    const arcana = getCard(drawnCard.arcanaId);
    const position = getPosition(drawnCard.position, reading);
    return interpretCardInPosition(arcana, position);
  });
  const relationships = analyzeRelationships(reading);
  const stageCounts = new Map<JourneyStage, number>();

  for (const card of cards) {
    stageCounts.set(card.stage, (stageCounts.get(card.stage) ?? 0) + 1);
  }

  const dominantStages = JOURNEY_STAGES
    .filter((stage) => stageCounts.has(stage))
    .sort((left, right) =>
      (stageCounts.get(right) ?? 0) - (stageCounts.get(left) ?? 0)
      || JOURNEY_STAGES.indexOf(left) - JOURNEY_STAGES.indexOf(right),
    );

  return {
    cards,
    relationships,
    sequenceObservations: relationships
      .filter((relationship) => relationship.toPositionId === relationship.fromPositionId + 1)
      .map(describeSequence),
    dominantStages,
    tensions: relationships.filter(({ patterns }) => patterns.includes("tension")),
    reinforcements: relationships.filter(({ patterns }) => patterns.includes("reinforcement")),
    reflectionQuestions: [...new Set(cards.map(({ initiatoryQuestion }) => initiatoryQuestion))],
  };
}
