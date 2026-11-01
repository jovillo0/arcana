import type {
  EditorialCategory,
  NarrativeCard,
  NarrativeReading,
  ReadingSession,
} from "../../types/domain";
import { classifySensitiveQuestion } from "./classifySensitiveQuestion";

const CATEGORY_NOTICES: Readonly<Partial<Record<EditorialCategory, string>>> = {
  MEDICAL: "Los Arcanos pueden utilizarse aquí únicamente como marco de reflexión personal. No permiten evaluar un estado de salud, valorar un tratamiento ni anticipar su evolución. Para decisiones médicas, consulta a profesionales de salud cualificados.",
  FINANCIAL: "Esta lectura puede servir para reflexionar sobre tu relación con la incertidumbre y la decisión, pero no permite determinar la conveniencia financiera de una inversión o movimiento económico. Basa las decisiones financieras reales en información adecuada y, si lo necesitas, en asesoramiento profesional.",
  LEGAL: "La responsabilidad, el equilibrio y las consecuencias pueden contemplarse simbólicamente, pero la tirada no permite anticipar el resultado de un procedimiento jurídico. Para decisiones legales, consulta asesoramiento jurídico cualificado.",
  SAFETY: "La lectura no puede evaluar una situación de peligro. Si existe un riesgo inmediato para ti o para otra persona, contacta con los servicios de emergencia locales o con alguien de confianza que pueda ayudarte ahora.",
  CRISIS: "Esta lectura no puede valorar una crisis. Si tú u otra persona estáis en peligro inmediato, contacta ahora con los servicios de emergencia locales o con una persona de confianza.",
  OTHER_SENSITIVE: "Esta lectura solo ofrece reflexión simbólica general. No establece diagnósticos, hechos privados ni certezas sobre una situación sensible; busca información verificada y apoyo profesional apropiado cuando lo necesites.",
};

const THIRD_PARTY_NOTICE = "Los Arcanos no permiten conocer los pensamientos, sentimientos, intenciones, secretos ni acciones de otra persona. Esta lectura se centra en lo que tú percibes, necesitas comprender y puedes conversar o verificar.";

function reframeThirdPartyQuestion(cards: readonly NarrativeCard[]): NarrativeCard[] {
  return cards.map((card) => ({
    ...card,
    interpretation: `En la posición «${card.heading}», este símbolo puede servir para explorar tu propia percepción de la relación, las preguntas que permanecen abiertas y qué información necesitarías para comprender mejor la situación, sin atribuir pensamientos ni intenciones a la otra persona.`,
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
