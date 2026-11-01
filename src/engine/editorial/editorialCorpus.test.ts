import { describe, expect, it, vi } from "vitest";
import { SPREADS } from "../../data/spreads/spreads";
import { buildSymbolicReading } from "../interpretation/localSymbolicEngine";
import type { ReadingSession } from "../../types/domain";
import { EDITORIAL_CASES, EDITORIAL_CASE_AUTHORING_CHECKLIST, TAROT_BOUNDARY_CASES } from "./editorialCorpus";
import { classifySensitiveQuestion } from "./classifySensitiveQuestion";
import {
  evaluateEditorialCorpus,
  getCategoryDistribution,
} from "./evaluateEditorialCorpus";

function createReading(question: string): ReadingSession {
  const spread = SPREADS.find(({ id }) => id === "la-semilla");
  if (!spread) {
    throw new Error("Falta la tirada de referencia del banco editorial.");
  }
  return {
    question,
    spread,
    drawnCards: ["major-13", "major-08", "major-17"].map((arcanaId, index) => ({
      arcanaId,
      position: index + 1,
    })),
    relationships: spread.relationships,
  };
}

describe("human-reviewed editorial corpus", () => {
  it("validates required fields, unique IDs, and anonymized example shape", () => {
    const ids = EDITORIAL_CASES.map(({ id }) => id);
    const validStatuses = new Set(["pending", "reviewed", "disputed"]);
    const validBehaviours = new Set([
      "symbolic-normal",
      "specific-notice",
      "third-party-reframe",
      "safety-priority",
      "human-review",
    ]);

    expect(new Set(ids).size).toBe(ids.length);
    expect(EDITORIAL_CASES.length).toBeGreaterThanOrEqual(25);

    for (const editorialCase of EDITORIAL_CASES) {
      expect(editorialCase.question.trim(), editorialCase.id).not.toBe("");
      expect(editorialCase.rationale.trim(), editorialCase.id).not.toBe("");
      expect(editorialCase.tags.length, editorialCase.id).toBeGreaterThan(0);
      expect(validStatuses.has(editorialCase.reviewStatus), editorialCase.id).toBe(true);
      expect(validBehaviours.has(editorialCase.expectedBehaviour), editorialCase.id).toBe(true);
      expect(editorialCase.question, editorialCase.id).not.toMatch(/\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/);
      expect(editorialCase.question, editorialCase.id).not.toMatch(/\b(?:\+?\d[\s().-]*){9,}\b/);
      if (editorialCase.reviewStatus === "reviewed") {
        expect(editorialCase.rationale.trim(), editorialCase.id).not.toBe("");
      }
      if (editorialCase.expectedCategory === "AMBIGUOUS") {
        expect(editorialCase.expectedSensitive, editorialCase.id).toBe("AMBIGUOUS");
        expect(editorialCase.expectedBehaviour, editorialCase.id).toBe("human-review");
        expect(editorialCase.ambiguity?.trim(), editorialCase.id).toBeTruthy();
      } else {
        expect(editorialCase.expectedSensitive, editorialCase.id)
          .toBe(editorialCase.expectedCategory !== "NON_SENSITIVE");
        expect(editorialCase.ambiguity, editorialCase.id).toBeNull();
      }
    }
  });

  it("records context-dependent cases without assigning a safe or sensitive category", () => {
    const ambiguousCases = EDITORIAL_CASES.filter(
      ({ expectedCategory }) => expectedCategory === "AMBIGUOUS",
    );
    const requiredIds = [
      "safety-return-home",
      "legal-sign-agreement",
      "third-party-trust-ambiguous",
      "ambiguous-accept-proposal",
      "literal-death-prediction",
    ];

    expect(ambiguousCases.map(({ id }) => id)).toEqual(expect.arrayContaining(requiredIds));
    expect(ambiguousCases.every(({ expectedSensitive, expectedCategory, expectedBehaviour }) =>
      expectedSensitive === "AMBIGUOUS"
      && expectedCategory === "AMBIGUOUS"
      && expectedBehaviour === "human-review",
    )).toBe(true);
  });

  it("reports coverage and metrics without counting pending or disputed cases as scored", () => {
    const evaluation = evaluateEditorialCorpus(EDITORIAL_CASES);
    const distribution = getCategoryDistribution(EDITORIAL_CASES);

    expect(evaluation.totalCases).toBe(EDITORIAL_CASES.length);
    expect(evaluation.ambiguousCases).toBeGreaterThan(0);
    expect(evaluation.pendingCases).toBeGreaterThan(0);
    expect(evaluation.disputedCases).toBeGreaterThan(0);
    expect(evaluation.evaluatedCases).toBeLessThan(evaluation.totalCases);
    expect(evaluation.evaluatedCases + evaluation.pendingCases + evaluation.disputedCases)
      .toBe(evaluation.totalCases);
    expect(evaluation).toMatchObject({
      totalCases: 40,
      clearCases: 35,
      ambiguousCases: 5,
      reviewedCases: 34,
      pendingCases: 5,
      disputedCases: 1,
      evaluatedCases: 34,
      correct: 34,
      accuracy: 1,
      precision: 1,
      recall: 1,
    });
    expect(distribution).toEqual({
      MEDICAL: 4,
      FINANCIAL: 3,
      LEGAL: 4,
      SAFETY: 3,
      CRISIS: 2,
      OTHER_SENSITIVE: 4,
      NON_SENSITIVE: 15,
      AMBIGUOUS: 5,
    });
    expect(distribution.AMBIGUOUS).toBe(evaluation.ambiguousCases);
    expect(evaluation.results.every(({ actualCategory }) =>
      Object.hasOwn(distribution, actualCategory),
    )).toBe(true);
    expect(evaluation.disagreements.map(({ id }) => id))
      .toContain("literal-tower-damaged-building");
  });

  it("keeps reviewed, non-ambiguous cases as regression expectations", () => {
    const evaluation = evaluateEditorialCorpus(EDITORIAL_CASES);
    const mismatches = evaluation.results.filter(
      (result) => result.reviewStatus === "reviewed" && result.correct === false,
    );

    expect(mismatches).toEqual([]);
    expect(evaluation.disagreements.map(({ id }) => id))
      .toContain("literal-tower-damaged-building");
    expect(evaluation.results.find(({ id }) => id === "literal-tower-damaged-building")
      ?.reviewStatus).toBe("disputed");
  });

  it("retains six separate Tarot symbol-versus-literal boundary pairs", () => {
    expect(TAROT_BOUNDARY_CASES.map(({ arcanaName }) => arcanaName)).toEqual([
      "La Muerte",
      "La Justicia",
      "El Juicio",
      "El Diablo",
      "La Torre",
      "La Fuerza",
    ]);

    for (const boundary of TAROT_BOUNDARY_CASES) {
      const symbolicCase = EDITORIAL_CASES.find(({ id }) => id === boundary.symbolicCaseId);
      expect(symbolicCase, boundary.arcanaName).toBeDefined();
      expect(symbolicCase?.expectedCategory, boundary.arcanaName).toBe("NON_SENSITIVE");
      expect(classifySensitiveQuestion(symbolicCase?.question ?? "").category)
        .toBe("NON_SENSITIVE");
      expect(EDITORIAL_CASES.some(({ id }) => id === boundary.literalCase.id)).toBe(true);
    }
  });

  it("keeps literal Tarot boundary labels explicit, including unresolved danger ambiguity", () => {
    const death = TAROT_BOUNDARY_CASES.find(({ arcanaName }) => arcanaName === "La Muerte");
    const tower = TAROT_BOUNDARY_CASES.find(({ arcanaName }) => arcanaName === "La Torre");
    const justice = TAROT_BOUNDARY_CASES.find(({ arcanaName }) => arcanaName === "La Justicia");

    expect(death?.literalCase.expectedCategory).toBe("AMBIGUOUS");
    expect(death?.literalCase.reviewStatus).toBe("pending");
    expect(tower?.literalCase.expectedCategory).toBe("SAFETY");
    expect(tower?.literalCase.reviewStatus).toBe("disputed");
    expect(justice?.literalCase.expectedCategory).toBe("LEGAL");
  });

  it("provides a privacy-preserving procedure for adding future examples", () => {
    expect(EDITORIAL_CASE_AUTHORING_CHECKLIST).toHaveLength(5);
    expect(EDITORIAL_CASE_AUTHORING_CHECKLIST.join(" ")).toMatch(/anonimizada/i);
    expect(EDITORIAL_CASE_AUTHORING_CHECKLIST.join(" ")).toMatch(/justificación|rationale/i);
  });

  it("does not use randomness or mutate cards, positions, or symbolic interpretation", () => {
    const reading = createReading("¿Qué puede ayudar a desarrollar este proyecto?");
    const symbolic = buildSymbolicReading(reading);
    const cardsBefore = structuredClone(reading.drawnCards);
    const positionsBefore = structuredClone(reading.spread.positions);
    const spreadRelationshipsBefore = structuredClone(reading.spread.relationships);
    const symbolicBefore = structuredClone(symbolic);
    const randomSpy = vi.spyOn(Math, "random").mockImplementation(() => {
      throw new Error("Corpus evaluation must not invoke random draws.");
    });

    try {
      evaluateEditorialCorpus(EDITORIAL_CASES);
      expect(randomSpy).not.toHaveBeenCalled();
    } finally {
      randomSpy.mockRestore();
    }

    expect(reading.drawnCards).toEqual(cardsBefore);
    expect(reading.spread.positions).toEqual(positionsBefore);
    expect(reading.spread.relationships).toEqual(spreadRelationshipsBefore);
    expect(symbolic).toEqual(symbolicBefore);
  });
});
