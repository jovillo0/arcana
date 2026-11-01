import type {
  CardInterpretation,
  InterpretationLensId,
  NarrativeCard,
} from "../../types/domain";
import { ARCANA_BY_ID } from "../../data/arcana/arcana";

interface NarrativeContext {
  readonly lens: InterpretationLensId;
}

function getArcanaName(arcanaId: string): string {
  const arcana = ARCANA_BY_ID.get(arcanaId);
  if (!arcana) {
    throw new Error(`No se encontró el Arcano "${arcanaId}" para la narración.`);
  }
  return arcana.name;
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
  const position = `«${card.positionName}» (${lowerInitial(card.positionMeaning)})`;
  const core = lowerInitial(card.core);
  const geometry = lowerInitial(card.geometry);

  switch (context.lens) {
    case "hermetic-rosicrucian":
      return `La idea central: ${core}. En ${position}, la imagen geométrica «${geometry}» ayuda a contemplar esta posibilidad.`;
    case "marseille":
      return `El número ${arcanaNumber(card.arcanaId)} sitúa esta carta en la secuencia. En ${position}, esta idea cobra un matiz propio: ${core}.`;
    case "rider-waite-smith":
      return `Los símbolos de la imaginería propia de ARCANA —${card.symbols.join(", ").toLocaleLowerCase("es")}— acompañan ${position}. La idea que evocan: ${core}.`;
    case "psychological-archetypal":
      return `En ${position}, esta carta plantea una idea: ${core}. Puedes explorar qué patrones de percepción aparecen, sin tomarla como una etiqueta.`;
    case "intuitive-contemplative":
      return `En ${position}, los símbolos —${card.symbols.join(", ").toLocaleLowerCase("es")}— forman una imagen abierta. La idea que dejan sobre la mesa: ${core}.`;
    case "synthesis":
      return `En ${position}, esta carta aporta una idea: ${core}. También puedes mirar qué respuesta abre para ti.`;
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

  return {
    arcanaId: card.arcanaId,
    positionId: card.positionId,
    heading: `${arcana.romanNumeral} · ${arcana.name}`,
    interpretation: buildPositionInterpretation(card, context),
    lightReflection: lowerInitial(card.lightDimension),
    shadowReflection: lowerInitial(card.shadowDimension),
    question: card.initiatoryQuestion,
  };
}

export function getArcanaNameForNarrative(arcanaId: string): string {
  return getArcanaName(arcanaId);
}
