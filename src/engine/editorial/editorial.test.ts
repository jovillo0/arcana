import { describe, expect, it, vi } from "vitest";
import { SPREADS } from "../../data/spreads/spreads";
import { LENS_VOCABULARY } from "./lensVocabulary";
import { EDITORIAL_VOICE } from "./editorialGuide";
import { classifySensitiveQuestion } from "./classifySensitiveQuestion";
import { applyEditorialPolicy } from "./applyEditorialPolicy";
import { validateNarrative } from "./prohibitedClaims";
import { buildNarrativeReading } from "../narrative/buildNarrativeReading";
import { buildSymbolicReading } from "../interpretation/localSymbolicEngine";
import type { InterpretationLensId, ReadingSession } from "../../types/domain";

function createReading(question: string): ReadingSession {
  const spread = SPREADS.find(({ id }) => id === "la-semilla");
  if (!spread) {
    throw new Error("Falta la tirada de prueba.");
  }
  return {
    question,
    spread,
    drawnCards: ["major-02", "major-16", "major-19"].map((arcanaId, index) => ({
      arcanaId,
      position: index + 1,
    })),
    relationships: spread.relationships,
  };
}

describe("editorial question classification", () => {
  it.each([
    ["¿Me recuperaré de esta enfermedad?", "MEDICAL"],
    ["¿Debería invertir todos mis ahorros?", "FINANCIAL"],
    ["¿Voy a ganar este juicio?", "LEGAL"],
    ["¿Hay peligro por la violencia que estoy viviendo?", "SAFETY"],
    ["Quiero hacerme daño y no quiero vivir", "CRISIS"],
    ["¿Qué diagnóstico psicológico explica esto?", "OTHER_SENSITIVE"],
    ["¿Qué puedo aprender de este cambio?", "NON_SENSITIVE"],
  ] as const)("classifies %s as %s", (question, category) => {
    expect(classifySensitiveQuestion(question).category).toBe(category);
  });

  it.each([
    "¿Es seguro entrar en un edificio dañado?",
    "¿Es seguro permanecer cerca de una estructura inestable?",
  ])("prioritizes concrete structural hazards: %s", (question) => {
    expect(classifySensitiveQuestion(question).category).toBe("SAFETY");
  });

  it.each([
    "¿Qué siente esta persona por mí?",
    "¿Qué piensa esa persona de mí?",
    "¿Me está ocultando algo?",
  ])("marks third-party mind-reading question as reflective focus: %s", (question) => {
    const classification = classifySensitiveQuestion(question);
    expect(classification.thirdPartyFocus).toBe(true);
    expect(classification.category).toBe("OTHER_SENSITIVE");
  });

  it("does not hide a legal question just because it also mentions a Tarot reading", () => {
    expect(classifySensitiveQuestion(
      "¿La tirada indica si ganaré el juicio?",
    ).category).toBe("LEGAL");
  });
});

describe("editorial policy and narrative validation", () => {
  it("reframes third-party readings around the user's perceptions, not private mental states", () => {
    const reading = createReading("¿Qué siente esta persona por mí?");
    const symbolic = buildSymbolicReading(reading);
    const narrative = buildNarrativeReading(reading, symbolic, "psychological-archetypal");

    expect(narrative.thirdPartyFocus).toBe(true);
    expect(narrative.safetyNotice).toContain("no pueden decirte qué piensa o siente otra persona");
    expect(narrative.cards.every(({ interpretation }) =>
      interpretation.includes("tu propia percepción"),
    )).toBe(true);
    expect(narrative.reflectionQuestions[0]).toContain("¿Qué incertidumbre percibes");
    expect(JSON.stringify(narrative)).not.toMatch(/esa persona (siente|piensa|quiere)/i);
  });

  it("gives medical questions a non-predictive medical notice", () => {
    const reading = createReading("¿Me recuperaré de esta enfermedad?");
    const narrative = buildNarrativeReading(reading, buildSymbolicReading(reading), "synthesis");

    expect(narrative.editorialCategory).toBe("MEDICAL");
    expect(narrative.safetyNotice).toContain("No puede evaluar síntomas ni recomendar tratamientos");
    expect(narrative.synthesis).not.toMatch(/recuperarás|evolucionará/i);
  });

  it("does not recommend or predict a financial decision", () => {
    const reading = createReading("¿Debería invertir todos mis ahorros?");
    const narrative = buildNarrativeReading(reading, buildSymbolicReading(reading), "marseille");

    expect(narrative.editorialCategory).toBe("FINANCIAL");
    expect(narrative.safetyNotice).toContain("no puede decirte qué opción te conviene");
    expect(JSON.stringify(narrative)).not.toMatch(/\b(?:invierte|no inviertas|debes invertir)\b/i);
  });

  it("does not predict a legal case outcome", () => {
    const reading = createReading("¿Voy a ganar este juicio?");
    const narrative = buildNarrativeReading(reading, buildSymbolicReading(reading), "synthesis");

    expect(narrative.editorialCategory).toBe("LEGAL");
    expect(narrative.safetyNotice).toContain("no puede anticipar su resultado");
    expect(JSON.stringify(narrative)).not.toMatch(/ganarás|perderás|ganar el juicio/i);
  });

  it("keeps non-sensitive change questions symbolic and non-clinical", () => {
    const reading = createReading("¿Qué puedo aprender de este cambio?");
    const narrative = buildNarrativeReading(reading, buildSymbolicReading(reading), "psychological-archetypal");

    expect(narrative.editorialCategory).toBe("NON_SENSITIVE");
    expect(narrative.safetyNotice).toBeUndefined();
    expect(narrative.cards[0]?.interpretation).toContain("patrones de percepción");
    expect(narrative.cards[0]?.interpretation).not.toMatch(/diagnóstico|trastorno|patología/i);
  });

  it("allows reflective psychological language about a project without clinical framing", () => {
    const reading = createReading(
      "¿Qué está cambiando en mi manera de afrontar este proyecto?",
    );
    const narrative = buildNarrativeReading(
      reading,
      buildSymbolicReading(reading),
      "psychological-archetypal",
    );

    expect(narrative.editorialCategory).toBe("NON_SENSITIVE");
    expect(narrative.cards[0]?.interpretation).toContain("patrones de percepción");
    expect(narrative.cards[0]?.interpretation).not.toMatch(/diagnóstico|trastorno|patología/i);
  });

  it("keeps all six lens vocabularies distinct and available", () => {
    const lensIds: readonly InterpretationLensId[] = [
      "hermetic-rosicrucian",
      "marseille",
      "rider-waite-smith",
      "psychological-archetypal",
      "intuitive-contemplative",
      "synthesis",
    ];
    expect(Object.keys(LENS_VOCABULARY).sort()).toEqual([...lensIds].sort());
    expect(LENS_VOCABULARY["hermetic-rosicrucian"].preferred).toContain("polaridad");
    expect(LENS_VOCABULARY.marseille.preferred).toContain("número");
    expect(LENS_VOCABULARY["rider-waite-smith"].preferred).toContain("arquetipo");
    expect(LENS_VOCABULARY["psychological-archetypal"].preferred).toContain("autoconocimiento");
    expect(LENS_VOCABULARY["intuitive-contemplative"].preferred).toContain("resonancia");
    expect(LENS_VOCABULARY.synthesis.preferred).toContain("perspectiva");
  });

  it("defines one common editorial voice and preferred open-ended language", () => {
    expect(EDITORIAL_VOICE.voice).toContain("no determinista");
    expect(EDITORIAL_VOICE.voice).toContain("cercana");
    expect(EDITORIAL_VOICE.preferredPhrases).toContain("invita a considerar");
    expect(EDITORIAL_VOICE.preferredPhrases).toContain("si te sirve");
    expect(EDITORIAL_VOICE.avoidPhrases).toContain("el destino indica");
  });

  it("detects prohibited claims while allowing symbolic death and transformation", () => {
    const reading = createReading("¿Qué puedo aprender de este cambio?");
    const narrative = buildNarrativeReading(
      reading,
      buildSymbolicReading(reading),
      "intuitive-contemplative",
    );
    const invalid = {
      ...narrative,
      synthesis: "El destino indica que esto ocurrirá inevitablemente y debes actuar.",
    };

    expect(validateNarrative(invalid).map(({ rule }) => rule)).toEqual(
      expect.arrayContaining(["fortune-telling-certainty", "categorical-prediction", "directive-advice"]),
    );
    expect(validateNarrative({
      ...narrative,
      synthesis: "La Muerte representa simbólicamente el cierre de un ciclo y una transformación.",
    })).toEqual([]);
  });

  it.each([
    ["Esa persona siente dudas sobre ti.", "third-party-mind-reading"],
    ["El Arcano confirma un trastorno.", "clinical-diagnosis"],
    ["El Sol indica recuperación.", "medical-outcome"],
    ["El universo quiere que cambies de rumbo.", "supernatural-certainty"],
    ["La Muerte anuncia un fallecimiento.", "literal-death-claim"],
  ])("flags editorial claim %s", (claim, expectedRule) => {
    const reading = createReading("¿Qué puedo aprender de este cambio?");
    const narrative = buildNarrativeReading(
      reading,
      buildSymbolicReading(reading),
      "synthesis",
    );

    expect(validateNarrative({ ...narrative, synthesis: claim }).map(({ rule }) => rule))
      .toContain(expectedRule);
  });

  it("keeps symbolic input unchanged and never calls the random number generator", () => {
    const reading = createReading("¿Qué puedo aprender de este cambio?");
    const symbolic = buildSymbolicReading(reading);
    const beforeCards = reading.drawnCards.map(({ arcanaId, position }) => [arcanaId, position]);
    const beforePositions = structuredClone(reading.spread.positions);
    const beforeReadingRelationships = structuredClone(reading.relationships);
    const beforeRelationships = structuredClone(symbolic.relationships);
    const randomSpy = vi.spyOn(Math, "random").mockImplementation(() => {
      throw new Error("Editorial policy must not use randomness.");
    });

    try {
      const narrative = buildNarrativeReading(reading, symbolic, "hermetic-rosicrucian");
      applyEditorialPolicy(reading, narrative);
      expect(randomSpy).not.toHaveBeenCalled();
    } finally {
      randomSpy.mockRestore();
    }

    expect(reading.drawnCards.map(({ arcanaId, position }) => [arcanaId, position]))
      .toEqual(beforeCards);
    expect(reading.spread.positions).toEqual(beforePositions);
    expect(reading.relationships).toEqual(beforeReadingRelationships);
    expect(symbolic.relationships).toEqual(beforeRelationships);
  });

  it("preserves pre-existing relationship data through editorial processing", () => {
    const reading = createReading("¿Qué puedo aprender de este cambio?");
    const symbolic = buildSymbolicReading(reading);
    const narrative = buildNarrativeReading(reading, symbolic, "synthesis");
    const revised = applyEditorialPolicy(reading, narrative);

    expect(revised.relationships.map(({ relationship }) => relationship))
      .toEqual(symbolic.relationships);
  });

  it("adds category-specific notices for safety and crisis questions", () => {
    const safety = createReading("Me preocupa la violencia y mi seguridad personal.");
    const crisis = createReading("No quiero vivir y pienso en suicidarme.");

    const safetyNarrative = buildNarrativeReading(
      safety,
      buildSymbolicReading(safety),
      "intuitive-contemplative",
    );
    const crisisNarrative = buildNarrativeReading(
      crisis,
      buildSymbolicReading(crisis),
      "intuitive-contemplative",
    );

    expect(safetyNarrative.editorialCategory).toBe("SAFETY");
    expect(safetyNarrative.safetyNotice).toContain("riesgo inmediato");
    expect(safetyNarrative.prioritizeRealWorldSupport).toBe(true);
    expect(crisisNarrative.editorialCategory).toBe("CRISIS");
    expect(crisisNarrative.safetyNotice).toContain("servicios de emergencia locales");
    expect(crisisNarrative.prioritizeRealWorldSupport).toBe(true);
  });
});
