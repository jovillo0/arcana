import type { EditorialCategory } from "../../types/domain";
import { classifySensitiveQuestion } from "./classifySensitiveQuestion";
import type { EditorialCase, EditorialReviewStatus } from "./editorialCorpus";

export interface EditorialCaseResult {
  readonly id: string;
  readonly expectedCategory: EditorialCategory | "AMBIGUOUS";
  readonly actualCategory: EditorialCategory;
  readonly expectedThirdPartyFocus: boolean | "AMBIGUOUS";
  readonly actualThirdPartyFocus: boolean;
  readonly expectedSensitive: boolean | "AMBIGUOUS";
  readonly actualSensitive: boolean;
  readonly reviewStatus: EditorialReviewStatus;
  readonly ambiguous: boolean;
  readonly correct: boolean | null;
}

export interface EditorialEvaluation {
  readonly totalCases: number;
  readonly clearCases: number;
  readonly ambiguousCases: number;
  readonly reviewedCases: number;
  readonly pendingCases: number;
  readonly disputedCases: number;
  readonly evaluatedCases: number;
  readonly correct: number;
  readonly disagreements: readonly EditorialCaseResult[];
  readonly falsePositives: readonly EditorialCaseResult[];
  readonly falseNegatives: readonly EditorialCaseResult[];
  readonly categoryConfusions: readonly {
    readonly expected: EditorialCategory;
    readonly actual: EditorialCategory;
    readonly count: number;
  }[];
  readonly precision: number;
  readonly recall: number;
  readonly accuracy: number;
  readonly results: readonly EditorialCaseResult[];
}

const CATEGORIES: readonly (EditorialCategory | "AMBIGUOUS")[] = [
  "MEDICAL",
  "FINANCIAL",
  "LEGAL",
  "SAFETY",
  "CRISIS",
  "OTHER_SENSITIVE",
  "NON_SENSITIVE",
  "AMBIGUOUS",
];

function isEvaluable(result: EditorialCaseResult): boolean {
  return result.reviewStatus === "reviewed" && !result.ambiguous;
}

export function evaluateEditorialCorpus(
  cases: readonly EditorialCase[],
): EditorialEvaluation {
  const results = cases.map((editorialCase): EditorialCaseResult => {
    const actual = classifySensitiveQuestion(editorialCase.question);
    const actualSensitive = actual.category !== "NON_SENSITIVE";
    const ambiguous = editorialCase.expectedCategory === "AMBIGUOUS"
      || editorialCase.expectedSensitive === "AMBIGUOUS"
      || editorialCase.expectedThirdPartyFocus === "AMBIGUOUS";
    const correct = editorialCase.reviewStatus === "reviewed" && !ambiguous
      ? actual.category === editorialCase.expectedCategory
        && actual.thirdPartyFocus === editorialCase.expectedThirdPartyFocus
        && actualSensitive === editorialCase.expectedSensitive
      : null;

    return {
      id: editorialCase.id,
      expectedCategory: editorialCase.expectedCategory,
      actualCategory: actual.category,
      expectedThirdPartyFocus: editorialCase.expectedThirdPartyFocus,
      actualThirdPartyFocus: actual.thirdPartyFocus,
      expectedSensitive: editorialCase.expectedSensitive,
      actualSensitive,
      reviewStatus: editorialCase.reviewStatus,
      ambiguous,
      correct,
    };
  });

  const evaluated = results.filter(isEvaluable);
  const falsePositives = evaluated.filter(
    ({ expectedSensitive, actualSensitive }) => expectedSensitive === false && actualSensitive,
  );
  const falseNegatives = evaluated.filter(
    ({ expectedSensitive, actualSensitive }) => expectedSensitive === true && !actualSensitive,
  );
  const truePositives = evaluated.filter(
    ({ expectedSensitive, actualSensitive }) => expectedSensitive === true && actualSensitive,
  ).length;
  const actualPositives = evaluated.filter(({ actualSensitive }) => actualSensitive).length;
  const expectedPositives = evaluated.filter(({ expectedSensitive }) => expectedSensitive === true).length;
  const confusions = new Map<string, {
    expected: EditorialCategory;
    actual: EditorialCategory;
    count: number;
  }>();

  for (const result of evaluated) {
    if (
      result.expectedCategory === "AMBIGUOUS"
      || result.expectedCategory === result.actualCategory
    ) {
      continue;
    }
    const key = `${result.expectedCategory}->${result.actualCategory}`;
    const existing = confusions.get(key);
    confusions.set(key, {
      expected: result.expectedCategory,
      actual: result.actualCategory,
      count: (existing?.count ?? 0) + 1,
    });
  }

  return {
    totalCases: results.length,
    clearCases: results.filter(({ ambiguous }) => !ambiguous).length,
    ambiguousCases: results.filter(({ ambiguous }) => ambiguous).length,
    reviewedCases: results.filter(({ reviewStatus }) => reviewStatus === "reviewed").length,
    pendingCases: results.filter(({ reviewStatus }) => reviewStatus === "pending").length,
    disputedCases: results.filter(({ reviewStatus }) => reviewStatus === "disputed").length,
    evaluatedCases: evaluated.length,
    correct: evaluated.filter(({ correct }) => correct === true).length,
    disagreements: results.filter((result) =>
      !result.ambiguous
      && (
        result.expectedCategory !== result.actualCategory
        || result.expectedSensitive !== result.actualSensitive
        || result.expectedThirdPartyFocus !== result.actualThirdPartyFocus
      ),
    ),
    falsePositives,
    falseNegatives,
    categoryConfusions: [...confusions.values()],
    precision: actualPositives === 0 ? 1 : truePositives / actualPositives,
    recall: expectedPositives === 0 ? 1 : truePositives / expectedPositives,
    accuracy: evaluated.length === 0
      ? 1
      : evaluated.filter(({ correct }) => correct === true).length / evaluated.length,
    results,
  };
}

export function getCategoryDistribution(
  cases: readonly EditorialCase[],
): Readonly<Record<EditorialCategory | "AMBIGUOUS", number>> {
  const counts: Record<EditorialCategory | "AMBIGUOUS", number> = Object.fromEntries(
    CATEGORIES.map((category) => [category, 0]),
  ) as Record<EditorialCategory | "AMBIGUOUS", number>;
  for (const editorialCase of cases) {
    counts[editorialCase.expectedCategory] += 1;
  }
  return counts;
}
