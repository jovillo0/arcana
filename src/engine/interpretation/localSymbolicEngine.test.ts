import { describe, expect, it, vi } from "vitest";
import { ARCANA } from "../../data/arcana/arcana";
import { SPREADS } from "../../data/spreads/spreads";
import type { ReadingSession, Spread } from "../../types/domain";
import { buildSymbolicReading, interpretCardInPosition } from "./localSymbolicEngine";

function createReading(
  spread: Spread,
  arcanaIds: readonly string[],
): ReadingSession {
  if (arcanaIds.length !== spread.positions.length) {
    throw new Error("Cada prueba debe asignar una carta a cada posición.");
  }

  const isolatedSpread: Spread = {
    ...spread,
    positions: spread.positions.map((position) => ({ ...position })),
    layout: spread.layout.map((position) => ({ ...position })),
    relationships: spread.relationships.map((relationship) => ({
      ...relationship,
      fromPositions: [...relationship.fromPositions],
      toPositions: [...relationship.toPositions],
    })),
  };

  return {
    question: "¿Qué merece contemplación en este proceso?",
    spread: isolatedSpread,
    drawnCards: isolatedSpread.positions.map((position, index) => {
      const arcanaId = arcanaIds[index];
      if (!arcanaId) {
        throw new Error(`Falta la carta para la posición ${position.id}.`);
      }
      return { position: position.id, arcanaId };
    }),
    relationships: isolatedSpread.relationships,
  };
}

function getSpread(id: string): Spread {
  const spread = SPREADS.find((candidate) => candidate.id === id);
  if (!spread) {
    throw new Error(`No existe la tirada ${id}.`);
  }
  return spread;
}

function freezeReading(reading: ReadingSession): ReadingSession {
  reading.drawnCards.forEach((drawnCard) => Object.freeze(drawnCard));
  Object.freeze(reading.drawnCards);
  reading.spread.positions.forEach((position) => Object.freeze(position));
  Object.freeze(reading.spread.positions);
  reading.spread.relationships.forEach((relationship) => Object.freeze(relationship));
  Object.freeze(reading.spread.relationships);
  Object.freeze(reading.spread);
  return Object.freeze(reading);
}

describe("local symbolic interpretation engine", () => {
  it("does not mutate the original drawn cards, positions, or order", () => {
    const reading = freezeReading(
      createReading(getSpread("la-semilla"), ["major-02", "major-16", "major-19"]),
    );
    const originalDrawnCards = reading.drawnCards.map((drawnCard) => ({ ...drawnCard }));

    buildSymbolicReading(reading);

    expect(reading.drawnCards).toEqual(originalDrawnCards);
  });

  it("never calls the random number generator", () => {
    const randomSpy = vi.spyOn(Math, "random").mockImplementation(() => {
      throw new Error("Interpretation must not use randomness.");
    });

    try {
      buildSymbolicReading(
        createReading(getSpread("la-semilla"), ["major-02", "major-16", "major-19"]),
      );
      expect(randomSpy).not.toHaveBeenCalled();
    } finally {
      randomSpy.mockRestore();
    }
  });

  it("preserves each Arcana's original spread position", () => {
    const reading = createReading(
      getSpread("la-semilla"),
      ["major-02", "major-16", "major-19"],
    );
    const result = buildSymbolicReading(reading);

    expect(result.cards.map(({ arcanaId, positionId }) => [arcanaId, positionId])).toEqual([
      ["major-02", 1],
      ["major-16", 2],
      ["major-19", 3],
    ]);
  });

  it.each(SPREADS)("interprets every card and position in %s", (spread) => {
    const cards = ARCANA.slice(0, spread.positions.length);
    const result = buildSymbolicReading(
      createReading(spread, cards.map(({ id }) => id)),
    );

    expect(result.cards).toHaveLength(spread.positions.length);
    expect(result.cards.map(({ positionId }) => positionId)).toEqual(
      spread.positions.map(({ id }) => id),
    );
    expect(result.cards.every(({ core, lightDimension, shadowDimension }) =>
      Boolean(core && lightDimension && shadowDimension),
    )).toBe(true);
  });

  it("produces relationships for a multi-card reading", () => {
    const result = buildSymbolicReading(
      createReading(getSpread("la-semilla"), ["major-02", "major-16", "major-19"]),
    );

    expect(result.relationships.length).toBeGreaterThan(0);
    expect(result.sequenceObservations).toHaveLength(2);
    expect(result.relationships[0]?.spreadStructure).toContainEqual({
      type: "sequence",
      description: "La condición da contexto al potencial emergente.",
    });
  });

  it("treats sequence direction as meaningful", () => {
    const spread = getSpread("la-semilla");
    const forward = buildSymbolicReading(
      createReading(spread, ["major-02", "major-16", "major-19"]),
    );
    const reverse = buildSymbolicReading(
      createReading(spread, ["major-19", "major-16", "major-02"]),
    );

    expect(forward.relationships[0]?.fromCardId).toBe("major-02");
    expect(reverse.relationships[0]?.fromCardId).toBe("major-19");
    expect(forward.relationships[0]?.patterns).toContain("stage-jump");
    expect(reverse.relationships[0]?.patterns).toContain("stage-return");
    expect(forward.sequenceObservations[0]).not.toBe(reverse.sequenceObservations[0]);
  });

  it("identifies transitions, returns, and jumps between journey stages", () => {
    const reading = createReading(
      getSpread("la-semilla"),
      ["major-04", "major-16", "major-19"],
    );
    const result = buildSymbolicReading(reading);
    const transition = result.relationships.find(
      ({ fromCardId, toCardId }) => fromCardId === "major-16" && toCardId === "major-19",
    );

    expect(result.relationships[0]?.patterns).toContain("stage-jump");
    expect(result.relationships[0]?.patterns).toContain("contrast");
    expect(transition?.patterns).toContain("transition");
    expect(transition?.patterns).toContain("stage-progression");
    expect(result.dominantStages).toContain("transformarse");
    expect(result.dominantStages).toContain("reintegrarse");
  });

  it("keeps light and shadow as stable coexisting dimensions without random selection", () => {
    const arcana = ARCANA.find(({ id }) => id === "major-02");
    const position = getSpread("la-semilla").positions[0];
    if (!arcana || !position) {
      throw new Error("Faltan datos simbólicos de prueba.");
    }

    const first = interpretCardInPosition(arcana, position);
    const second = interpretCardInPosition(arcana, position);

    expect(first.lightDimension).toBe(arcana.light);
    expect(first.shadowDimension).toBe(arcana.shadow);
    expect(second.lightDimension).toBe(first.lightDimension);
    expect(second.shadowDimension).toBe(first.shadowDimension);
  });

  it("returns equivalent structured interpretations for successive calls", () => {
    const reading = createReading(
      getSpread("la-semilla"),
      ["major-02", "major-16", "major-19"],
    );

    expect(buildSymbolicReading(reading)).toEqual(buildSymbolicReading(reading));
  });

  it("does not use the consultation wording to derive symbolic relationships", () => {
    const reading = createReading(
      getSpread("la-semilla"),
      ["major-02", "major-16", "major-19"],
    );
    const unrelatedQuestion = {
      ...reading,
      question: "¿Qué color debería elegir para una pared?",
    };

    expect(buildSymbolicReading(unrelatedQuestion)).toEqual(buildSymbolicReading(reading));
  });

  it("supports all nine existing spreads without replacing their definitions", () => {
    for (const spread of SPREADS) {
      const reading = createReading(
        spread,
        ARCANA.slice(0, spread.positions.length).map(({ id }) => id),
      );
      const result = buildSymbolicReading(reading);

      expect(result.cards).toHaveLength(spread.cardCount);
      expect(reading.spread.id).toBe(spread.id);
    }
  });
});
