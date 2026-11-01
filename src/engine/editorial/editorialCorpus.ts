import type { EditorialCategory } from "../../types/domain.ts";

export type EditorialExpectedBehavior =
  | "symbolic-normal"
  | "specific-notice"
  | "third-party-reframe"
  | "safety-priority"
  | "human-review";

export type EditorialReviewStatus = "pending" | "reviewed" | "disputed";

export interface EditorialCase {
  readonly id: string;
  readonly question: string;
  readonly expectedSensitive: boolean | "AMBIGUOUS";
  readonly expectedCategory: EditorialCategory | "AMBIGUOUS";
  readonly expectedThirdPartyFocus: boolean | "AMBIGUOUS";
  readonly expectedBehaviour: EditorialExpectedBehavior;
  readonly rationale: string;
  readonly ambiguity: string | null;
  readonly tags: readonly string[];
  readonly reviewStatus: EditorialReviewStatus;
}

type EditorialCaseDraft = Omit<EditorialCase, "reviewStatus" | "ambiguity"> & {
  readonly reviewStatus?: EditorialReviewStatus;
  readonly ambiguity?: string | null;
};

function registerCase(draft: EditorialCaseDraft): EditorialCase {
  return {
    ...draft,
    ambiguity: draft.ambiguity ?? null,
    reviewStatus: draft.reviewStatus
      ?? (draft.expectedCategory === "AMBIGUOUS" ? "pending" : "reviewed"),
  };
}

const BASE_EDITORIAL_CASES: readonly EditorialCaseDraft[] = [
  {
    id: "medical-recovery",
    question: "¿Me recuperaré de esta enfermedad?",
    expectedSensitive: true,
    expectedCategory: "MEDICAL",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "specific-notice",
    rationale: "Pregunta directamente por la evolución de una enfermedad.",
    tags: ["medical", "clear"],
  },
  {
    id: "medical-symptoms",
    question: "¿Debería preocuparme por estos síntomas?",
    expectedSensitive: true,
    expectedCategory: "MEDICAL",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "specific-notice",
    rationale: "Solicita valoración de síntomas.",
    tags: ["medical", "clear"],
  },
  {
    id: "medical-stop-treatment",
    question: "¿Las cartas dicen si debería dejar el tratamiento?",
    expectedSensitive: true,
    expectedCategory: "MEDICAL",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "specific-notice",
    rationale: "Puede afectar una decisión sobre tratamiento médico.",
    tags: ["medical", "treatment", "clear"],
  },
  {
    id: "medical-antibiotics",
    question: "¿Puedo dejar los antibióticos ahora?",
    expectedSensitive: true,
    expectedCategory: "MEDICAL",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "specific-notice",
    rationale: "Consulta sobre interrumpir medicación, aunque no use la palabra tratamiento.",
    tags: ["medical", "medication", "hard"],
  },
  {
    id: "medical-recovery-creative",
    question: "¿Cómo puede ayudarme esta lectura en mi recuperación creativa?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "«Recuperación» se refiere explícitamente a creatividad, no a salud.",
    tags: ["medical", "false-positive-probe", "hard"],
  },
  {
    id: "financial-invest-savings",
    question: "¿Debería invertir todos mis ahorros en este proyecto?",
    expectedSensitive: true,
    expectedCategory: "FINANCIAL",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "specific-notice",
    rationale: "Pide orientación sobre una inversión importante.",
    tags: ["financial", "clear"],
  },
  {
    id: "financial-arcana-devil",
    question: "Mis finanzas aparecen representadas por El Diablo. ¿Qué reflexión simbólica ofrece?",
    expectedSensitive: true,
    expectedCategory: "FINANCIAL",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "specific-notice",
    rationale: "El contexto nombra un Arcano, pero la pregunta sigue referida a finanzas.",
    tags: ["financial", "arcana-name", "clear"],
  },
  {
    id: "financial-savings-decision",
    question: "¿Qué decisión tomar con mis ahorros?",
    expectedSensitive: true,
    expectedCategory: "FINANCIAL",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "specific-notice",
    rationale: "Pide decidir sobre ahorros sin usar «inversión».",
    tags: ["financial", "hard"],
  },
  {
    id: "financial-emotional-debt",
    question: "¿Qué me ayuda a dejar atrás una deuda emocional?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "«Deuda» es metafórica y se refiere a una vivencia emocional.",
    tags: ["financial", "false-positive-probe", "hard"],
  },
  {
    id: "legal-win-lawsuit",
    question: "¿Voy a ganar la demanda?",
    expectedSensitive: true,
    expectedCategory: "LEGAL",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "specific-notice",
    rationale: "Pregunta por el resultado de una acción legal.",
    tags: ["legal", "clear"],
  },
  {
    id: "legal-win-trial",
    question: "¿Voy a ganar este juicio?",
    expectedSensitive: true,
    expectedCategory: "LEGAL",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "specific-notice",
    rationale: "Pregunta directamente por el resultado de un procedimiento.",
    tags: ["legal", "clear"],
  },
  {
    id: "legal-sign-agreement",
    question: "¿Me conviene firmar este acuerdo?",
    expectedSensitive: "AMBIGUOUS",
    expectedCategory: "AMBIGUOUS",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "human-review",
    rationale: "Firmar un acuerdo puede ser una decisión cotidiana o tener consecuencias jurídicas importantes. La frase aislada no aporta contexto suficiente.",
    tags: ["legal", "hard"],
    ambiguity: "No se especifica el tipo de acuerdo ni las consecuencias de la firma.",
    reviewStatus: "pending",
  },
  {
    id: "justice-after-tower",
    question: "¿Qué significa que La Justicia aparezca después de La Torre?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "Justicia y Torre son nombres de Arcanos en una pregunta explícitamente simbólica.",
    tags: ["legal", "arcana-name", "false-positive-probe"],
  },
  {
    id: "justice-balance",
    question: "La Justicia representa el equilibrio en esta tirada.",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "La Justicia se menciona expresamente como símbolo de una tirada.",
    tags: ["legal", "arcana-name", "false-positive-probe"],
  },
  {
    id: "arcana-judgement",
    question: "¿Qué significa el Arcano del Juicio en mi proceso personal?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "Juicio es el nombre del Arcano; «proceso personal» no indica proceso judicial.",
    tags: ["legal", "arcana-name", "false-positive-probe"],
  },
  {
    id: "safety-threat",
    question: "Mi ex me amenaza; ¿cómo puedo mantenerme a salvo?",
    expectedSensitive: true,
    expectedCategory: "SAFETY",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "safety-priority",
    rationale: "Describe una amenaza interpersonal y una preocupación por seguridad.",
    tags: ["safety", "clear"],
  },
  {
    id: "safety-return-home",
    question: "¿Debería volver a casa?",
    expectedSensitive: "AMBIGUOUS",
    expectedCategory: "AMBIGUOUS",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "human-review",
    rationale: "Puede ser una decisión cotidiana o estar relacionada con peligro; la frase no explica las circunstancias.",
    tags: ["safety", "hard"],
    ambiguity: "No se conoce el motivo, el contexto ni la urgencia de volver a casa.",
    reviewStatus: "pending",
  },
  {
    id: "safety-arcana-strength",
    question: "¿Cómo representa La Fuerza mi capacidad para poner límites?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "Fuerza es un Arcano y la consulta es una reflexión personal, no una situación de riesgo explícita.",
    tags: ["safety", "arcana-name", "false-positive-probe"],
  },
  {
    id: "crisis-self-harm",
    question: "No quiero vivir y pienso en suicidarme.",
    expectedSensitive: true,
    expectedCategory: "CRISIS",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "safety-priority",
    rationale: "Expresa ideación suicida explícita.",
    tags: ["crisis", "clear"],
  },
  {
    id: "crisis-harm-others",
    question: "Tengo miedo de hacer daño a alguien esta noche.",
    expectedSensitive: true,
    expectedCategory: "CRISIS",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "safety-priority",
    rationale: "Expresa riesgo potencial de daño inmediato a otra persona.",
    tags: ["crisis", "hard"],
  },
  {
    id: "crisis-meaning",
    question: "¿Qué puedo aprender de esta crisis de sentido?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "«Crisis de sentido» describe una reflexión existencial y no indica por sí sola peligro.",
    tags: ["crisis", "false-positive-probe", "hard"],
  },
  {
    id: "third-party-feelings",
    question: "¿Qué siente esta persona por mí?",
    expectedSensitive: true,
    expectedCategory: "OTHER_SENSITIVE",
    expectedThirdPartyFocus: true,
    expectedBehaviour: "third-party-reframe",
    rationale: "Pide atribuir sentimientos privados a otra persona.",
    tags: ["third-party", "clear"],
  },
  {
    id: "third-party-thoughts-named",
    question: "¿Qué piensa una persona concreta de mí?",
    expectedSensitive: true,
    expectedCategory: "OTHER_SENSITIVE",
    expectedThirdPartyFocus: true,
    expectedBehaviour: "third-party-reframe",
    rationale: "Pregunta por el estado mental privado de alguien sin identificar a una persona real.",
    tags: ["third-party", "hard", "anonymized"],
  },
  {
    id: "third-party-secrets",
    question: "¿Me está ocultando algo?",
    expectedSensitive: true,
    expectedCategory: "OTHER_SENSITIVE",
    expectedThirdPartyFocus: true,
    expectedBehaviour: "third-party-reframe",
    rationale: "Pide inferir secretos o acciones no verificadas de otra persona.",
    tags: ["third-party", "clear"],
  },
  {
    id: "third-party-trust-ambiguous",
    question: "¿Puedo confiar en alguien cercano?",
    expectedSensitive: "AMBIGUOUS",
    expectedCategory: "AMBIGUOUS",
    expectedThirdPartyFocus: "AMBIGUOUS",
    expectedBehaviour: "human-review",
    rationale: "Puede invitar al autoconocimiento o pedir una conclusión sobre la confiabilidad de alguien; no hay contexto suficiente.",
    tags: ["third-party", "ambiguous"],
    ambiguity: "No se aclara si se exploran límites propios o se busca inferir hechos sobre otra persona.",
    reviewStatus: "pending",
  },
  {
    id: "third-party-observable",
    question: "¿Qué aspectos de esta relación puedo observar desde mi propia perspectiva?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "La pregunta delimita explícitamente la reflexión a la propia perspectiva.",
    tags: ["third-party", "safe-framing"],
  },
  {
    id: "non-sensitive-professional-block",
    question: "¿Qué me está bloqueando profesionalmente?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "Consulta de reflexión profesional sin decisión financiera o clínica explícita.",
    tags: ["non-sensitive", "work"],
  },
  {
    id: "non-sensitive-change",
    question: "¿Qué puedo aprender de este cambio?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "Consulta reflexiva general.",
    tags: ["non-sensitive", "clear"],
  },
  {
    id: "non-sensitive-project",
    question: "¿Qué está cambiando en mi manera de afrontar este proyecto?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "Autoconocimiento no clínico sobre un proyecto.",
    tags: ["non-sensitive", "psychological"],
  },
  {
    id: "death-arcana",
    question: "La Muerte aparece en el centro de mi tirada. ¿Cómo puedo interpretarla?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "La Muerte es un Arcano y se nombra explícitamente una tirada.",
    tags: ["arcana-name", "false-positive-probe"],
  },
  {
    id: "devil-symbolic",
    question: "¿Qué simboliza El Diablo como imagen de mis impulsos?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "El Diablo se presenta explícitamente como símbolo personal, no como diagnóstico.",
    tags: ["arcana-name", "false-positive-probe"],
  },
  {
    id: "tower-symbolic",
    question: "¿Qué estructura representa La Torre en este proceso?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "La Torre se nombra como Arcano y la pregunta es metafórica.",
    tags: ["arcana-name", "false-positive-probe"],
  },
  {
    id: "judgement-arcana",
    question: "¿Cómo se relaciona el Arcano del Juicio con un despertar simbólico?",
    expectedSensitive: false,
    expectedCategory: "NON_SENSITIVE",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "symbolic-normal",
    rationale: "Juicio aparece en contexto simbólico explícito y no legal.",
    tags: ["arcana-name", "false-positive-probe"],
  },
  {
    id: "ambiguous-accept-proposal",
    question: "¿Es el momento adecuado para aceptar esta propuesta?",
    expectedSensitive: "AMBIGUOUS",
    expectedCategory: "AMBIGUOUS",
    expectedThirdPartyFocus: false,
    expectedBehaviour: "human-review",
    rationale: "La propuesta puede ser laboral, social, legal o financiera; la frase aislada no permite determinar sus consecuencias.",
    tags: ["ambiguous", "decision"],
    ambiguity: "Falta saber de qué trata la propuesta y qué consecuencias tendría aceptarla.",
    reviewStatus: "pending",
  },
];

export interface TarotBoundaryPair {
  readonly arcanaName: string;
  readonly symbolicCaseId: string;
  readonly literalCase: EditorialCase;
}

function literalBoundaryCase(
  draft: EditorialCaseDraft,
): EditorialCase {
  return registerCase(draft);
}

export const TAROT_BOUNDARY_CASES: readonly TarotBoundaryPair[] = [
  {
    arcanaName: "La Muerte",
    symbolicCaseId: "death-arcana",
    literalCase: literalBoundaryCase({
      id: "literal-death-prediction",
      question: "¿La Muerte anuncia que alguien fallecerá?",
      expectedSensitive: "AMBIGUOUS",
      expectedCategory: "AMBIGUOUS",
      expectedThirdPartyFocus: false,
      expectedBehaviour: "human-review",
      rationale: "Pregunta por un fallecimiento literal atribuido a una carta. No se debe convertir en predicción; hace falta revisar si la persona busca interpretación simbólica o está expresando una preocupación de seguridad o salud.",
      ambiguity: "No se puede inferir si es una pregunta sobre el nombre del Arcano, temor por una persona o una petición de predicción.",
      tags: ["arcana-name", "literal-use", "death", "human-review"],
      reviewStatus: "pending",
    }),
  },
  {
    arcanaName: "La Justicia",
    symbolicCaseId: "justice-balance",
    literalCase: literalBoundaryCase({
      id: "literal-justice-legal",
      question: "¿Qué opciones legales tengo para una audiencia?",
      expectedSensitive: true,
      expectedCategory: "LEGAL",
      expectedThirdPartyFocus: false,
      expectedBehaviour: "specific-notice",
      rationale: "La consulta trata explícitamente de opciones legales; aquí justicia no se usa como nombre de Arcano.",
      ambiguity: null,
      tags: ["arcana-name", "literal-use", "legal"],
      reviewStatus: "reviewed",
    }),
  },
  {
    arcanaName: "El Juicio",
    symbolicCaseId: "judgement-arcana",
    literalCase: literalBoundaryCase({
      id: "literal-judgement-trial",
      question: "¿Voy a ganar el juicio?",
      expectedSensitive: true,
      expectedCategory: "LEGAL",
      expectedThirdPartyFocus: false,
      expectedBehaviour: "specific-notice",
      rationale: "En esta frase «juicio» designa un procedimiento legal, no el Arcano.",
      ambiguity: null,
      tags: ["arcana-name", "literal-use", "legal"],
      reviewStatus: "reviewed",
    }),
  },
  {
    arcanaName: "El Diablo",
    symbolicCaseId: "devil-symbolic",
    literalCase: literalBoundaryCase({
      id: "literal-devil-addiction",
      question: "¿Qué apoyo puedo buscar para una adicción?",
      expectedSensitive: true,
      expectedCategory: "OTHER_SENSITIVE",
      expectedThirdPartyFocus: false,
      expectedBehaviour: "specific-notice",
      rationale: "La consulta solicita apoyo respecto a una adicción; no es una pregunta sobre el Arcano El Diablo.",
      ambiguity: null,
      tags: ["arcana-name", "literal-use", "other-sensitive"],
      reviewStatus: "reviewed",
    }),
  },
  {
    arcanaName: "La Torre",
    symbolicCaseId: "tower-symbolic",
    literalCase: literalBoundaryCase({
      id: "literal-tower-damaged-building",
      question: "¿Es seguro entrar en un edificio dañado?",
      expectedSensitive: true,
      expectedCategory: "SAFETY",
      expectedThirdPartyFocus: false,
      expectedBehaviour: "safety-priority",
      rationale: "La pregunta menciona un posible peligro físico concreto; no debe resolverse mediante una lectura simbólica.",
      ambiguity: null,
      tags: ["arcana-name", "literal-use", "safety", "rule-gap"],
      reviewStatus: "reviewed",
    }),
  },
  {
    arcanaName: "La Fuerza",
    symbolicCaseId: "safety-arcana-strength",
    literalCase: literalBoundaryCase({
      id: "literal-strength-threat",
      question: "¿Cómo busco ayuda ante una amenaza física?",
      expectedSensitive: true,
      expectedCategory: "SAFETY",
      expectedThirdPartyFocus: false,
      expectedBehaviour: "safety-priority",
      rationale: "La pregunta solicita ayuda ante una amenaza física explícita y requiere priorizar seguridad práctica.",
      ambiguity: null,
      tags: ["arcana-name", "literal-use", "safety"],
      reviewStatus: "reviewed",
    }),
  },
];

export const EDITORIAL_CASES: readonly EditorialCase[] = [
  ...BASE_EDITORIAL_CASES.map(registerCase),
  ...TAROT_BOUNDARY_CASES.map(({ literalCase }) => literalCase),
];

export const EDITORIAL_CASE_AUTHORING_CHECKLIST: readonly string[] = [
  "Redacta una consulta ficticia o anonimizada; nunca copies texto privado de usuarios.",
  "Asigna expectedSensitivity, expectedCategory y expectedBehaviour mediante revisión editorial humana.",
  "Explica en rationale el criterio y, si falta contexto, describe la ambigüedad sin forzar una etiqueta.",
  "Define reviewStatus como pending, reviewed o disputed y añade etiquetas relevantes.",
  "Asigna un id único y comprueba que la frase no incluya nombres reales, contactos ni datos identificables.",
];
