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

const INTENT_EXPLANATIONS: Readonly<Record<QuestionIntent, string>> = {
  general: "La Semilla contempla la condición de partida, el potencial emergente y una orientación.",
  decision: "La Encrucijada permite comparar dos caminos, contemplar qué pone en juego cada uno y explorar un criterio de reflexión.",
  transformation: "El Umbral organiza la reflexión en torno a lo que queda atrás, el impulso, el cambio y lo que comienza a emerger.",
  blockage: "El Nudo explora cómo aparece el bloqueo, qué tensión lo sostiene y qué perspectivas pueden ampliar su comprensión.",
  selfKnowledge: "El Espejo pone en relación lo que reconoces, tus recursos, el núcleo interior y una posible integración.",
  project: "El Sendero permite contemplar el origen, la motivación, los recursos, los desafíos y la orientación de un proceso.",
  open: "El Círculo contempla el núcleo y varias dimensiones de una consulta abierta sin imponer un recorrido temporal.",
};

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
    explanation: `Por la forma de tu pregunta, esta tirada puede ser especialmente adecuada. ${INTENT_EXPLANATIONS[analysis.consultationType]}`,
  };
}
