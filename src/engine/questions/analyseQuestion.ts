import type { ConsultationAnalyzer, QuestionAnalysis, QuestionIntent } from "../../types/domain";
import { normalizeQuestion, QUESTION_SIGNAL_RULES } from "./questionSignals";

const INTENTS: readonly QuestionIntent[] = [
  "general",
  "decision",
  "transformation",
  "blockage",
  "selfKnowledge",
  "project",
  "open",
];

const INTENT_LABELS: Readonly<Record<QuestionIntent, string>> = {
  general: "orientación general",
  decision: "decisión o elección",
  transformation: "transición o transformación",
  blockage: "bloqueo o dificultad persistente",
  selfKnowledge: "autoconocimiento",
  project: "proyecto o proceso",
  open: "consulta abierta o compleja",
};

export function analyseQuestion(question: string): QuestionAnalysis {
  const normalized = normalizeQuestion(question);
  const scores: Record<QuestionIntent, number> = {
    general: 0,
    decision: 0,
    transformation: 0,
    blockage: 0,
    selfKnowledge: 0,
    project: 0,
    open: 0,
  };
  const signals: string[] = [];

  for (const rule of QUESTION_SIGNAL_RULES) {
    if (rule.pattern.test(normalized)) {
      scores[rule.intent] += rule.weight;
      signals.push(rule.label);
    }
  }

  const detectedIntentCount = INTENTS.filter(
    (intent) => intent !== "general" && scores[intent] > 0,
  ).length;

  if (detectedIntentCount >= 3) {
    scores.open += (detectedIntentCount - 1) * 1.25;
    signals.push("combina señales de varias intenciones");
  }

  const rankedIntents = INTENTS
    .filter((intent) => intent !== "general")
    .sort((left, right) => scores[right] - scores[left]);
  const detectedIntents = rankedIntents.filter((intent) => scores[intent] > 0);
  const consultationType = detectedIntents[0] ?? "general";
  const secondaryTypes = detectedIntents.slice(1);
  const winningScore = scores[consultationType];
  const secondScore = secondaryTypes.length > 0 ? scores[secondaryTypes[0]] : 0;
  const confidence = winningScore === 0
    ? 0.35
    : Math.min(0.95, 0.45 + (0.5 * (winningScore - secondScore)) / winningScore);

  const explanation = winningScore === 0
    ? "No aparecen señales claras de una categoría especializada; una orientación general puede ser un punto de partida."
    : `Por la forma de tu pregunta, la intención que más destaca parece ser ${INTENT_LABELS[consultationType]}. Es una lectura local aproximada, no una conclusión objetiva.`;

  return {
    consultationType,
    secondaryTypes,
    confidence,
    signals,
    explanation,
    scores,
  };
}

export const localQuestionAnalyzer: ConsultationAnalyzer = Object.freeze({
  analyze: analyseQuestion,
});
