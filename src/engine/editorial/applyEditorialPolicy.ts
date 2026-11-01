import type {
  EditorialCategory,
  NarrativeCard,
  NarrativeReading,
  ReadingSession,
} from "../../types/domain";
import { classifySensitiveQuestion } from "./classifySensitiveQuestion";

const CATEGORY_NOTICES: Readonly<Partial<Record<EditorialCategory, string>>> = {
  MEDICAL: "Si esta consulta tiene que ver con tu salud, usa la lectura solo para ordenar lo que quieres preguntar. No puede evaluar síntomas ni recomendar tratamientos; consulta con personal sanitario cualificado.",
  FINANCIAL: "Si estás valorando una decisión económica, esta lectura no puede decirte qué opción te conviene. Compara costes, riesgos e información verificable; busca asesoramiento profesional si lo necesitas.",
  LEGAL: "Si esta consulta afecta a un asunto legal, la lectura no puede anticipar su resultado. Para decidir, apóyate en los documentos y en asesoramiento jurídico cualificado.",
  SAFETY: "Las cartas no pueden evaluar si una situación es segura. Si tú u otra persona estáis ante un riesgo inmediato, contacta con los servicios de emergencia locales o con alguien de confianza que pueda acompañarte.",
  CRISIS: "Las cartas no pueden valorar una crisis. Si tú u otra persona estáis en peligro inmediato, contacta ahora con los servicios de emergencia locales o con una persona de confianza.",
  OTHER_SENSITIVE: "Esta lectura no puede confirmar hechos privados ni ofrecer diagnósticos. Si necesitas decidir qué hacer, busca información verificable y apoyo profesional que conozca tu situación.",
};

const THIRD_PARTY_NOTICE = "Las cartas no pueden decirte qué piensa o siente otra persona. Sí pueden ayudarte a aclarar qué percibes, qué necesitas preguntar y qué conversación respetuosa podrías iniciar.";

function reframeThirdPartyQuestion(cards: readonly NarrativeCard[]): NarrativeCard[] {
  return cards.map((card) => ({
    ...card,
    interpretation: `En esta posición, el símbolo puede ayudarte a mirar tu propia percepción de la relación: qué has observado, qué sigue sin estar claro y qué necesitarías preguntar o comprobar.`,
  }));
}

export function applyEditorialPolicy(
  reading: ReadingSession,
  narrative: NarrativeReading,
): NarrativeReading {
  const classification = classifySensitiveQuestion(reading.question);
  const notice = CATEGORY_NOTICES[classification.category];
  const safetyNotice = [
    classification.thirdPartyFocus ? THIRD_PARTY_NOTICE : undefined,
    notice,
  ].filter((entry): entry is string => Boolean(entry)).join(" ");
  const prioritizeRealWorldSupport =
    classification.category === "CRISIS" || classification.category === "SAFETY";

  if (classification.thirdPartyFocus) {
    return {
      ...narrative,
      cards: reframeThirdPartyQuestion(narrative.cards),
      reflectionQuestions: [
        "¿Qué incertidumbre percibes en esta relación y qué información necesitarías para comprenderla mejor?",
        "¿Qué podrías expresar directamente para abrir una conversación respetuosa?",
      ],
      editorialCategory: classification.category,
      thirdPartyFocus: true,
      prioritizeRealWorldSupport,
      ...(safetyNotice ? { safetyNotice } : {}),
    };
  }

  return {
    ...narrative,
    editorialCategory: classification.category,
    thirdPartyFocus: false,
    prioritizeRealWorldSupport,
    ...(safetyNotice ? { safetyNotice } : {}),
  };
}
