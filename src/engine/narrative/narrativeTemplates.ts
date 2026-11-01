import type {
  CardInterpretation,
  InterpretationLensId,
  NarrativeCard,
} from "../../types/domain";
import { ARCANA_BY_ID } from "../../data/arcana/arcana";

interface NarrativeContext {
  readonly question: string;
  readonly lens: InterpretationLensId;
}

function getArcanaName(arcanaId: string): string {
  const arcana = ARCANA_BY_ID.get(arcanaId);
  if (!arcana) {
    throw new Error(`No se encontró el Arcano "${arcanaId}" para la narración.`);
  }
  return arcana.name;
}

function contextualQuestion(question: string): string {
  const normalized = question.trim().replace(/\s+/g, " ");
  return normalized.length > 140 ? `${normalized.slice(0, 137).trimEnd()}…` : normalized;
}

function cleanFragment(value: string): string {
  return value.trim().replace(/[.,;:]+$/u, "");
}

function lowerInitial(value: string): string {
  const fragment = cleanFragment(value);
  return `${fragment.charAt(0).toLocaleLowerCase("es")}${fragment.slice(1)}`;
}

function buildPositionInterpretation(
  card: CardInterpretation,
  context: NarrativeContext,
): string {
  const questionContext = `Frente a tu pregunta «${contextualQuestion(context.question)}»,`;
  const position = `la posición «${card.positionName}» —${lowerInitial(card.positionMeaning)}—`;
  const core = lowerInitial(card.core);
  const geometry = lowerInitial(card.geometry);
  const light = lowerInitial(card.lightDimension);
  const shadow = lowerInitial(card.shadowDimension);

  switch (context.lens) {
    case "hermetic-rosicrucian":
      return `En ${position}, ${core} entra en diálogo con la geometría de ${geometry}. ${questionContext} el principio transformador —${lowerInitial(card.transformativePrinciple)}— abre una reflexión sobre las polaridades de luz (${light}) y sombra (${shadow}).`;
    case "marseille":
      return `El número ${arcanaNumber(card.arcanaId)} sitúa este Arcano en la secuencia de la tirada. En ${position}, ${core} invita a observar la estructura y sus polaridades (${light} y ${shadow}). ${questionContext} puede considerarse qué matiz aporta este lugar, sin convertir el orden en una predicción.`;
    case "rider-waite-smith":
      return `En ${position}, ${core} se acompaña de motivos de la imaginería propia de ARCANA —${card.symbols.join(", ").toLocaleLowerCase("es")}—. ${questionContext} esta escena simbólica puede abrir una pregunta sobre qué acción o posibilidad de respuesta representa para ti.`;
    case "psychological-archetypal":
      return `La posición «${card.positionName}» orienta la atención hacia ${lowerInitial(card.positionMeaning)}. ${questionContext} ${core} puede servir como imagen para explorar patrones de percepción, tensión e integración, sin describir hechos ni diagnosticarte.`;
    case "intuitive-contemplative":
      return `En la posición «${card.positionName}» —${lowerInitial(card.positionMeaning)}—, ${core} puede quedar como una imagen abierta frente a tu pregunta. Los símbolos de ${card.symbols.join(", ").toLocaleLowerCase("es")} ofrecen puntos de atención; la resonancia queda a tu propia contemplación.`;
    case "synthesis":
      return `En ${position}, ${core} reúne una dimensión de acción y otra de contemplación. ${questionContext} puede explorarse mediante el principio «${lowerInitial(card.transformativePrinciple)}», manteniendo abiertas sus distintas posibilidades.`;
  }
}

function arcanaNumber(arcanaId: string): number {
  const arcana = ARCANA_BY_ID.get(arcanaId);
  if (!arcana) {
    throw new Error(`No se encontró el Arcano "${arcanaId}" para la narración.`);
  }
  return arcana.number;
}

export function narrateCard(
  card: CardInterpretation,
  context: NarrativeContext,
): NarrativeCard {
  const arcana = ARCANA_BY_ID.get(card.arcanaId);
  if (!arcana) {
    throw new Error(`No se encontró el Arcano "${card.arcanaId}" para la narración.`);
  }

  const lightLead = context.lens === "intuitive-contemplative"
    ? "Como una posibilidad para observar"
    : "En su dimensión luminosa";
  const shadowLead = context.lens === "psychological-archetypal"
    ? "Como aspecto que podría merecer atención"
    : "En su dimensión sombría";

  return {
    arcanaId: card.arcanaId,
    positionId: card.positionId,
    heading: `${arcana.romanNumeral} · ${arcana.name}`,
    interpretation: buildPositionInterpretation(card, context),
    lightReflection: `${lightLead}: ${lowerInitial(card.lightDimension)}`,
    shadowReflection: `${shadowLead}: ${lowerInitial(card.shadowDimension)}`,
    question: card.initiatoryQuestion,
  };
}

export function getArcanaNameForNarrative(arcanaId: string): string {
  return getArcanaName(arcanaId);
}
