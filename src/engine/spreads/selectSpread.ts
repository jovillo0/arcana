import { SPREADS } from "../../data/spreads/spreads";
import type { QuestionAnalysis, QuestionIntent, Spread, SpreadRecommendation } from "../../types/domain";

const SPREAD_BY_INTENT: Readonly<Record<QuestionIntent, string>> = {
  general: "la-semilla",
  decision: "la-encrucijada",
  transformation: "el-umbral",
  blockage: "el-nudo",
  selfKnowledge: "el-espejo",
  project: "el-sendero",
  open: "el-circulo",
};

const SIGNAL_EXPLANATIONS: Readonly<Record<string, string>> = {
  "menciona elegir o decidir": "estás pensando qué elegir",
  "compara alternativas explícitas": "comparas opciones",
  "plantea una elección condicional": "te preguntas si continuar o cambiar de rumbo",
  "menciona un cambio o una transición": "estás atravesando un cambio",
  "describe el cierre o comienzo de una etapa": "estás cerrando o empezando una etapa",
  "describe un bloqueo o impedimento": "algo te está frenando",
  "expresa que algo no avanza": "sientes que algo no termina de avanzar",
  "menciona una dificultad persistente o repetida": "una dificultad parece repetirse",
  "pregunta por un patrón propio": "quieres observar un patrón propio",
  "explora el autoconocimiento o la experiencia interior": "quieres comprender mejor tu experiencia interior",
  "menciona un proyecto o una iniciativa": "estás pensando en un proyecto",
  "pregunta por el desarrollo de un proceso": "quieres entender cómo se desarrolla un proceso",
  "describe una situación compleja o con muchas dimensiones": "tu situación reúne varios factores",
  "pide contemplar el conjunto de una situación": "quieres mirar la situación en conjunto",
  "combina señales de varias intenciones": "tu pregunta reúne varias dimensiones",
};

const SPREAD_PURPOSES: Readonly<Record<QuestionIntent, string>> = {
  general: "ubicar el punto de partida y reconocer qué empieza a tomar forma",
  decision: "comparar tus opciones y aclarar qué criterio te importa más",
  transformation: "recorrer qué estás dejando atrás, qué impulsa el cambio y qué empieza a surgir",
  blockage: "mirar qué te frena, qué sostiene el bloqueo y qué perspectiva puede abrirse",
  selfKnowledge: "relacionar lo que reconoces de ti con tus recursos y cómo integrarlos",
  project: "ordenar el origen del proyecto, sus recursos, desafíos y orientación",
  open: "mirar distintas dimensiones de la consulta sin imponer un recorrido temporal",
};

function explainQuestionSignals(analysis: QuestionAnalysis): string {
  const reasons = [...new Set(
    analysis.signals
      .map((signal) => SIGNAL_EXPLANATIONS[signal])
      .filter((reason): reason is string => Boolean(reason)),
  )].slice(0, 2);

  if (reasons.length === 0) {
    return "tu pregunta es amplia y todavía no señala un tema concreto";
  }
  if (reasons.length === 1) {
    return reasons[0] ?? "tu pregunta es amplia";
  }
  return `${reasons[0]} y ${reasons[1]}`;
}

function capitalizeFirst(value: string): string {
  return `${value.charAt(0).toLocaleUpperCase("es")}${value.slice(1)}`;
}

function findSpread(spreadId: string, catalog: readonly Spread[]): Spread {
  const spread = catalog.find(({ id }) => id === spreadId);
  if (!spread) {
    throw new Error(`No se encontró la tirada requerida "${spreadId}" en el catálogo.`);
  }
  return spread;
}

export function selectSpread(
  analysis: QuestionAnalysis,
  catalog: readonly Spread[] = SPREADS,
): SpreadRecommendation {
  const spread = findSpread(SPREAD_BY_INTENT[analysis.consultationType], catalog);

  return {
    spread,
    explanation: `${capitalizeFirst(explainQuestionSignals(analysis))}. ${spread.name} te ayuda a ${SPREAD_PURPOSES[analysis.consultationType]}.`,
  };
}
