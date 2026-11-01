import type { EditorialValidationIssue, NarrativeReading } from "../../types/domain";
import { PROHIBITED_CLAIM_RULES } from "./editorialGuide";

function getNarrativeSections(narrative: NarrativeReading): readonly [string, string][] {
  return [
    ["opening", narrative.opening],
    ...narrative.cards.flatMap((card) => [
      [`card-${card.positionId}-interpretation`, card.interpretation] as [string, string],
      [`card-${card.positionId}-light`, card.lightReflection] as [string, string],
      [`card-${card.positionId}-shadow`, card.shadowReflection] as [string, string],
      [`card-${card.positionId}-question`, card.question] as [string, string],
    ]),
    ...narrative.relationships.map(({ relationship, text }) =>
      [`relationship-${relationship.fromPositionId}-${relationship.toPositionId}`, text] as [string, string],
    ),
    ["movement", narrative.movement],
    ["synthesis", narrative.synthesis],
    ...narrative.reflectionQuestions.map((question, index) =>
      [`reflection-${index + 1}`, question] as [string, string],
    ),
    ...(narrative.safetyNotice ? [["safety-notice", narrative.safetyNotice] as [string, string]] : []),
  ];
}

export function validateNarrative(
  narrative: NarrativeReading,
): EditorialValidationIssue[] {
  const issues: EditorialValidationIssue[] = [];
  for (const [section, text] of getNarrativeSections(narrative)) {
    for (const rule of PROHIBITED_CLAIM_RULES) {
      const match = rule.expression.exec(text);
      if (match) {
        issues.push({
          rule: rule.id,
          section,
          excerpt: match[0],
        });
      }
    }
  }
  return issues;
}
