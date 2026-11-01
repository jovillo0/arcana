import { describe, expect, it, vi } from "vitest";
import { ARCANA } from "../../data/arcana/arcana";
import { SPREADS } from "../../data/spreads/spreads";
import { INTERPRETATION_LENSES } from "../../data/traditions/traditions";
import { buildSymbolicReading } from "../interpretation/localSymbolicEngine";
import type {
  InterpretationLensId,
  NarrativeReading,
  ReadingSession,
  Spread,
  SymbolicReading,
} from "../../types/domain";
import { buildNarrativeReading } from "./buildNarrativeReading";

function createReading(
  spread: Spread,
  arcanaIds: readonly string[],
  question = "¿Qué puede ayudar a desarrollar este proyecto?",
): ReadingSession {
  if (arcanaIds.length !== spread.positions.length) {
    throw new Error("Cada carta de prueba debe corresponder a una posición.");
  }

  return {
    question,
    spread,
    drawnCards: spread.positions.map((position, index) => {
      const arcanaId = arcanaIds[index];
      if (!arcanaId) {
        throw new Error(`Falta una carta para la posición ${position.id}.`);
      }
      return { position: position.id, arcanaId };
    }),
    relationships: spread.relationships,
  };
}

function getSpread(id: string): Spread {
  const spread = SPREADS.find((candidate) => candidate.id === id);
  if (!spread) {
    throw new Error(`No existe la tirada "${id}".`);
  }
  return spread;
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.values(value).forEach((nested) => deepFreeze(nested));
    Object.freeze(value);
  }
  return value;
}

function narrate(
  reading: ReadingSession,
  symbolic: SymbolicReading,
  lens: InterpretationLensId = "hermetic-rosicrucian",
): NarrativeReading {
  return buildNarrativeReading(reading, symbolic, lens);
}

describe("local narrative reading engine", () => {
  it("does not mutate the reading or structured symbolic interpretation", () => {
    const reading = deepFreeze(
      createReading(getSpread("la-semilla"), ["major-02", "major-16", "major-19"]),
    );
    const symbolic = deepFreeze(buildSymbolicReading(reading));

    expect(() => narrate(reading, symbolic)).not.toThrow();
    expect(reading.drawnCards.map(({ arcanaId, position }) => [arcanaId, position])).toEqual([
      ["major-02", 1],
      ["major-16", 2],
      ["major-19", 3],
    ]);
  });

  it("never calls the random number generator", () => {
    const reading = createReading(
      getSpread("la-semilla"),
      ["major-02", "major-16", "major-19"],
    );
    const symbolic = buildSymbolicReading(reading);
    const randomSpy = vi.spyOn(Math, "random").mockImplementation(() => {
      throw new Error("Narrative generation must not use randomness.");
    });

    try {
      narrate(reading, symbolic);
      expect(randomSpy).not.toHaveBeenCalled();
    } finally {
      randomSpy.mockRestore();
    }
  });

  it("preserves exactly the same drawn cards and positions across lenses", () => {
    const reading = createReading(
      getSpread("la-semilla"),
      ["major-02", "major-16", "major-19"],
    );
    const symbolic = buildSymbolicReading(reading);
    const hermetic = narrate(reading, symbolic, "hermetic-rosicrucian");
    const psychological = narrate(reading, symbolic, "psychological-archetypal");

    expect(psychological.cards.map(({ arcanaId, positionId }) => [arcanaId, positionId]))
      .toEqual(hermetic.cards.map(({ arcanaId, positionId }) => [arcanaId, positionId]));
    expect(psychological.cards.map(({ arcanaId, positionId }) => [arcanaId, positionId]))
      .toEqual(reading.drawnCards.map(({ arcanaId, position }) => [arcanaId, position]));
  });

  it("produces different narrative emphasis for different lenses", () => {
    const reading = createReading(getSpread("la-semilla"), ["major-02", "major-16", "major-19"]);
    const symbolic = buildSymbolicReading(reading);
    const hermetic = narrate(reading, symbolic, "hermetic-rosicrucian");
    const marseille = narrate(reading, symbolic, "marseille");
    const riderWaiteSmith = narrate(reading, symbolic, "rider-waite-smith");
    const psychological = narrate(reading, symbolic, "psychological-archetypal");
    const contemplative = narrate(reading, symbolic, "intuitive-contemplative");
    const synthesis = narrate(reading, symbolic, "synthesis");

    expect(hermetic.cards[0]?.interpretation).toContain("geometría");
    expect(marseille.cards[0]?.interpretation).toContain("número 2");
    expect(riderWaiteSmith.cards[0]?.interpretation).toContain("imaginería propia de ARCANA");
    expect(psychological.cards[0]?.interpretation).toContain("patrones de percepción");
    expect(contemplative.cards[0]?.interpretation).toContain("imagen abierta");
    expect(synthesis.cards[0]?.interpretation).toContain("reúne");
    expect(new Set([
      hermetic.cards[0]?.interpretation,
      marseille.cards[0]?.interpretation,
      riderWaiteSmith.cards[0]?.interpretation,
      psychological.cards[0]?.interpretation,
      contemplative.cards[0]?.interpretation,
      synthesis.cards[0]?.interpretation,
    ]).size).toBe(6);
  });

  it("contextualizes with the question without changing symbolic input", () => {
    const spread = getSpread("la-semilla");
    const firstReading = createReading(
      spread,
      ["major-02", "major-16", "major-19"],
      "¿Qué puede ayudar a desarrollar este proyecto?",
    );
    const secondReading = createReading(
      spread,
      ["major-02", "major-16", "major-19"],
      "¿Cómo puedo contemplar este cambio en mi comunidad?",
    );
    const firstSymbolic = buildSymbolicReading(firstReading);
    const secondSymbolic = buildSymbolicReading(secondReading);

    expect(secondSymbolic).toEqual(firstSymbolic);
    expect(narrate(firstReading, firstSymbolic).opening)
      .toContain("la pregunta que has formulado");
    expect(narrate(firstReading, firstSymbolic).cards[0]?.interpretation)
      .not.toBe(narrate(secondReading, secondSymbolic).cards[0]?.interpretation);
  });

  it("narrates only relations already present in SymbolicReading", () => {
    const reading = createReading(getSpread("la-semilla"), ["major-02", "major-16", "major-19"]);
    const symbolic = buildSymbolicReading(reading);
    const narrative = narrate(reading, symbolic);

    expect(narrative.relationships.map(({ relationship }) => relationship))
      .toEqual(symbolic.relationships);
    expect(narrative.relationships).toHaveLength(symbolic.relationships.length);
  });

  it("rejects symbolic input whose cards do not match the immutable draw", () => {
    const reading = createReading(
      getSpread("la-semilla"),
      ["major-02", "major-16", "major-19"],
    );
    const differentReading = createReading(
      getSpread("la-semilla"),
      ["major-04", "major-10", "major-21"],
    );

    expect(() => narrate(reading, buildSymbolicReading(differentReading))).toThrow(
      "no coincide con la carta sorteada",
    );
  });

  it("derives synthesis and final questions from the symbolic reading", () => {
    const reading = createReading(
      getSpread("la-semilla"),
      ["major-04", "major-16", "major-19"],
    );
    const symbolic = buildSymbolicReading(reading);
    const narrative = narrate(reading, symbolic);

    expect(narrative.synthesis).toContain("Constituirse");
    expect(narrative.synthesis).toContain("El Emperador");
    expect(narrative.synthesis).toContain("El Sol");
    expect(narrative.synthesis).toContain(
      symbolic.relationships[0]?.type.replaceAll("-", " "),
    );
    expect(narrative.reflectionQuestions.length).toBeGreaterThanOrEqual(1);
    expect(narrative.reflectionQuestions.length).toBeLessThanOrEqual(3);
    expect(narrative.reflectionQuestions).toContain(symbolic.cards[0]?.initiatoryQuestion);
  });

  it("returns equivalent output for successive calls with identical inputs", () => {
    const reading = createReading(getSpread("la-semilla"), ["major-02", "major-16", "major-19"]);
    const symbolic = buildSymbolicReading(reading);

    expect(narrate(reading, symbolic)).toEqual(narrate(reading, symbolic));
  });

  it.each(SPREADS)("narrates the existing spread %s without changing its cards", (spread) => {
    const reading = createReading(
      spread,
      ARCANA.slice(0, spread.positions.length).map(({ id }) => id),
    );
    const symbolic = buildSymbolicReading(reading);
    const narrative = narrate(reading, symbolic, "synthesis");

    expect(narrative.cards).toHaveLength(spread.cardCount);
    expect(narrative.cards.map(({ positionId }) => positionId))
      .toEqual(spread.positions.map(({ id }) => id));
  });

  it("does not use prohibited deterministic or predictive formulations", () => {
    const reading = createReading(getSpread("la-semilla"), ["major-02", "major-16", "major-19"]);
    const symbolic = buildSymbolicReading(reading);
    const output = JSON.stringify(narrate(reading, symbolic)).toLocaleLowerCase("es");
    const prohibited = [
      /esto suceder[aá]/,
      /las cartas saben/,
      /el destino indica/,
      /\bdebes\b/,
      /el tarot confirma/,
      /significa definitivamente/,
    ];

    expect(prohibited.some((pattern) => pattern.test(output))).toBe(false);
  });

  it.each(INTERPRETATION_LENSES)(
    "presents a notice for sensitive questions with lens %s",
    (lens) => {
    const reading = createReading(
      getSpread("la-semilla"),
      ["major-02", "major-16", "major-19"],
      "¿Debo cambiar mi medicación por este síntoma?",
    );
    const narrative = narrate(reading, buildSymbolicReading(reading), lens.id);

    expect(narrative.safetyNotice).toContain("marco de reflexión personal");
    },
  );
});
