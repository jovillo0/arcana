import type { EditorialCategory } from "../../types/domain.ts";
import { EDITORIAL_CASES } from "./editorialCorpus.ts";

export interface EditorialClassification {
  readonly category: EditorialCategory;
  readonly thirdPartyFocus: boolean;
}

const CRISIS_PATTERNS: readonly RegExp[] = [
  /\b(?:quiero|voy a|pienso en|intento|plan(?:eo|eando)?)\s+(?:suicidarme|quitarme la vida|hacerme daño|hacerme dano)\b/i,
  /\b(?:suicidio|suicida|autolesión|autolesion|hacer daño a alguien|hacer dano a alguien)\b/i,
  /\b(?:no quiero vivir|no puedo mantenerme a salvo|estoy en peligro inmediato)\b/i,
];

const SAFETY_PATTERNS: readonly RegExp[] = [
  /\b(?:violencia|maltrato|abuso|amenaza|acoso|agresión|agresion|arma|peligro|seguridad personal|me está siguiendo|me esta siguiendo)\b/i,
];

const STRUCTURAL_HAZARD_PATTERNS: readonly RegExp[] = [
  /\b(?:edificios?|estructuras?|puentes?|pared(?:es)?|techos?)\b.{0,45}\b(?:dañad[oa]s?|agrietad[oa]s?|inestables?|derrumbe|colaps\w*)\b/i,
  /\b(?:dañad[oa]s?|agrietad[oa]s?|inestables?|derrumbe|colaps\w*)\b.{0,45}\b(?:edificios?|estructuras?|puentes?|pared(?:es)?|techos?)\b/i,
];

const MEDICAL_PATTERNS: readonly RegExp[] = [
  /\b(?:salud|médic\w*|medic\w*|enfermedad|síntoma\w*|sintoma\w*|diagnóstico|diagnostico|embarazo|tratamiento|terapia|antibi[oó]tic\w*|dosis|fármaco\w*|farmaco\w*|pastilla\w*|curar\w*|sanar\w*)\b/i,
];

const FINANCIAL_PATTERNS: readonly RegExp[] = [
  /\b(?:dinero|finanzas?|financiero\w*|deuda\w*|hipoteca\w*|inversi[oó]n\w*|invertir|préstamo\w*|prestamo\w*|ahorro\w*|bancarrota|quiebra|jubilaci[oó]n)\b/i,
];

const LEGAL_PATTERNS: readonly RegExp[] = [
  /\b(?:demanda\w*|juicio\w*|abogad\w*|legal\w*|denuncia\w*|custodia|divorcio|contrato\w*|desahucio|procedimiento jurídico|procedimiento juridico|tribunal)\b/i,
  /\bfirm\w*\b.{0,25}\b(?:un\s+)?acuerdo\b/i,
  /\b(?:un\s+)?acuerdo\b.{0,25}\bfirm\w*\b/i,
];

const OTHER_SENSITIVE_PATTERNS: readonly RegExp[] = [
  /\b(?:abuso sexual|violencia sexual|adicci[oó]n|trastorno|depresi[oó]n|ansiedad|trauma|diagn[oó]stico psicol[oó]gico)\b/i,
];

const THIRD_PARTY_PATTERNS: readonly RegExp[] = [
  /\b(?:qué|que)\s+(?:sient\w*|piens\w*|opina|quiere|intenta|pretende)\b.{0,70}\b(?:él|ella|esa persona|esta persona|mi pareja|mi ex|mi jefe|mi amiga|mi amigo|mi compañero|mi companero)\b/i,
  /\b(?:qué|que)\s+(?:sient\w*|piens\w*|opina|quiere|intenta|pretende)\b.{0,60}(?:de mí|de mi|por mí|por mi|sobre mí|sobre mi)(?!\p{L})/iu,
  /\b(?:me está ocultando|me esta ocultando|me engaña|me engana|me miente|me traiciona)\b/i,
  /\b(?:va a volver|volverá|volvera|me dejará|me dejara|me elegirá|me elegira)\b.{0,60}\b(?:él|ella|esa persona|mi pareja|mi ex)\b/i,
];

function matchesAny(question: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(question));
}

function questionWithSymbolicArcanaContext(question: string): string {
  return question
    .replace(
      /\b(?:arcano(?:\s+mayor)?(?:\s+del)?|carta(?:\s+del)?)\s+(?:el\s+)?juicio\b/gi,
      "símbolo",
    )
    .replace(
      /\bel juicio(?=\s+(?:aparec\w*|sale|surge)\b.{0,25}\b(?:tirada|lectura)\b)/gi,
      "el símbolo",
    );
}

export function classifySensitiveQuestion(question: string): EditorialClassification {
  const thirdPartyFocus = matchesAny(question, THIRD_PARTY_PATTERNS);
  const symbolicContextQuestion = questionWithSymbolicArcanaContext(question);
  const financialContextQuestion = question.replace(
    /\bdeuda\w*\s+emocional\w*\b/gi,
    "asunto personal",
  );
  let category: EditorialCategory = "NON_SENSITIVE";

  if (matchesAny(question, CRISIS_PATTERNS)) {
    category = "CRISIS";
  } else if (
    matchesAny(question, SAFETY_PATTERNS)
    || matchesAny(question, STRUCTURAL_HAZARD_PATTERNS)
    || /\b(?:es|sería|seria)\s+seguro\s+(?:volver|ir|quedarme|caminar|salir|dormir)\b/i.test(question)
  ) {
    category = "SAFETY";
  } else if (matchesAny(question, OTHER_SENSITIVE_PATTERNS)) {
    category = "OTHER_SENSITIVE";
  } else if (matchesAny(question, MEDICAL_PATTERNS)) {
    category = "MEDICAL";
  } else if (matchesAny(financialContextQuestion, FINANCIAL_PATTERNS)) {
    category = "FINANCIAL";
  } else if (matchesAny(symbolicContextQuestion, LEGAL_PATTERNS)) {
    category = "LEGAL";
  } else if (thirdPartyFocus) {
    category = "OTHER_SENSITIVE";
  }

  return { category, thirdPartyFocus };
}

function normalizeForEditorialMatch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/[¿?¡!.,;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getExternalNarrativeRestriction(
  question: string,
): "sensitive-question" | "pending-review" | null {
  const classification = classifySensitiveQuestion(question);
  if (classification.category !== "NON_SENSITIVE" || classification.thirdPartyFocus) {
    return "sensitive-question";
  }
  const normalizedQuestion = normalizeForEditorialMatch(question);
  const pendingCase = EDITORIAL_CASES.some((editorialCase) =>
    editorialCase.reviewStatus !== "reviewed"
    && editorialCase.ambiguity !== null
    && normalizeForEditorialMatch(editorialCase.question) === normalizedQuestion,
  );
  return pendingCase ? "pending-review" : null;
}
