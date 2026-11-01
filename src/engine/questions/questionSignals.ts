import type { QuestionIntent } from "../../types/domain";

export interface QuestionSignalRule {
  readonly intent: Exclude<QuestionIntent, "general">;
  readonly label: string;
  readonly pattern: RegExp;
  readonly weight: number;
}

export const QUESTION_SIGNAL_RULES: readonly QuestionSignalRule[] = [
  {
    intent: "decision",
    label: "menciona elegir o decidir",
    pattern: /\b(elegir|elijo|escoger|decidir|decision|dilema|alternativa|alternativas|opcion|opciones)\b/,
    weight: 2,
  },
  {
    intent: "decision",
    label: "compara alternativas explícitas",
    pattern: /\b(entre estas dos|entre dos|una u otra|a o b|continuar o abandonar|seguir o dejar)\b/,
    weight: 3.5,
  },
  {
    intent: "decision",
    label: "plantea una elección condicional",
    pattern: /\b(no se si|deberia .{0,45}\bo\b|conviene .{0,45}\bo\b|continuarlo o abandonarlo|continuar o dejarlo)\b/,
    weight: 2.5,
  },
  {
    intent: "transformation",
    label: "menciona un cambio o una transición",
    pattern: /\b(cambio|cambiar|transicion|transformacion|transformar|transito)\b/,
    weight: 2.5,
  },
  {
    intent: "transformation",
    label: "describe el cierre o comienzo de una etapa",
    pattern: /\b(final de etapa|fin de etapa|nueva etapa|comenzar otra etapa|terminar una etapa|cerrar un ciclo)\b/,
    weight: 3,
  },
  {
    intent: "blockage",
    label: "describe un bloqueo o impedimento",
    pattern: /\b(bloquead[oa]s?|atascad[oa]s?|obstaculos?|impedimentos?|impide|impidiendo|dificultad(?:es)?)\b/,
    weight: 2.5,
  },
  {
    intent: "blockage",
    label: "expresa que algo no avanza",
    pattern: /\b(no puedo avanzar|no consigo avanzar|no avanza|sigue sin avanzar|estancad[oa]s?)\b/,
    weight: 3,
  },
  {
    intent: "blockage",
    label: "menciona una dificultad persistente o repetida",
    pattern: /\b(sigo encontrandome|se repite|siempre me pasa|dificultad persistente|una y otra vez)\b/,
    weight: 2.5,
  },
  {
    intent: "selfKnowledge",
    label: "pregunta por un patrón propio",
    pattern: /\b(patron(?:es)? (?:mio|mia|mios|mias|personal(?:es)?|propio(?:s)?|propia(?:s)?))\b/,
    weight: 4,
  },
  {
    intent: "selfKnowledge",
    label: "explora el autoconocimiento o la experiencia interior",
    pattern: /\b(autoconocimiento|comprenderme|conocerme|sobre mi mismo|sobre mi misma|de mi interior|mi interior|mi percepcion|quien soy)\b/,
    weight: 3,
  },
  {
    intent: "project",
    label: "menciona un proyecto o una iniciativa",
    pattern: /\b(proyecto(?:s)?|iniciativa(?:s)?|plan(?:es)?)\b/,
    weight: 2.5,
  },
  {
    intent: "project",
    label: "pregunta por el desarrollo de un proceso",
    pattern: /\b(proceso(?:s)?|desarrollo|desarrollar|evolucion|recorrido)\b/,
    weight: 2,
  },
  {
    intent: "open",
    label: "describe una situación compleja o con muchas dimensiones",
    pattern: /\b(complej[oa]s?|muchas dimensiones|varias dimensiones|varias fuerzas|fuerzas que intervienen|varios factores)\b/,
    weight: 3.5,
  },
  {
    intent: "open",
    label: "pide contemplar el conjunto de una situación",
    pattern: /\b(comprender las fuerzas|comprender el conjunto|vision global|situacion amplia|no se por donde empezar)\b/,
    weight: 2.5,
  },
];

export function normalizeQuestion(question: string): string {
  return question
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
