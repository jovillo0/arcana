export interface EditorialVoiceGuide {
  readonly voice: readonly string[];
  readonly preferredPhrases: readonly string[];
  readonly avoidPhrases: readonly string[];
}

export const EDITORIAL_VOICE: EditorialVoiceGuide = {
  voice: [
    "reflexiva",
    "simbólica",
    "elegante",
    "clara",
    "cercana",
    "orientadora",
    "contemplativa",
    "prudente",
    "no determinista",
  ],
  preferredPhrases: [
    "puede contemplarse como",
    "invita a considerar",
    "puede poner de relieve",
    "simbólicamente, esta relación",
    "una posible lectura es",
    "esta posición invita a preguntarse",
    "la secuencia puede sugerir",
    "si te sirve",
    "qué pequeño paso está bajo tu control",
    "no tienes que resolverlo todo hoy",
  ],
  avoidPhrases: [
    "esto ocurrirá",
    "las cartas predicen",
    "el destino indica",
    "el Tarot confirma",
    "esta persona siente",
    "esto demuestra que",
    "debes hacer",
    "vas a",
    "seguro que",
    "inevitablemente",
    "las cartas perciben tu energía",
    "el universo te está diciendo",
  ],
};

export interface ProhibitedClaimRule {
  readonly id: string;
  readonly expression: RegExp;
}

export const PROHIBITED_CLAIM_RULES: readonly ProhibitedClaimRule[] = [
  {
    id: "categorical-prediction",
    expression: /\b(?:esto|eso|todo)\s+(?:ocurrirá|sucederá|pasará)\b|\b(?:vas a|seguro que|inevitablemente)\b/i,
  },
  {
    id: "fortune-telling-certainty",
    expression: /\b(?:las cartas predicen|el destino indica|el tarot confirma|esto demuestra que)\b/i,
  },
  {
    id: "directive-advice",
    expression: /\b(?:debes|deberías|tienes que|hazlo ahora|no lo hagas|invierte|no inviertas|deja tu medicación)\b/i,
  },
  {
    id: "third-party-mind-reading",
    expression: /\b(?:esa persona|esta persona|él|ella|mi pareja|mi ex)\s+(?:siente|piensa|quiere|oculta|hará|va a hacer|tiene dudas)\b/i,
  },
  {
    id: "clinical-diagnosis",
    expression: /\b(?:padeces|tienes|sufres|indica|confirma|revela|muestra|diagnostica)\s+(?:(?:de|un|una)\s+)?(?:depresión|ansiedad|adicción|trastorno|trauma|patología|enfermedad|diagnóstico|diagnostico|síntoma|sintoma)\b/i,
  },
  {
    id: "medical-outcome",
    expression: /\b(?:te recuperarás|vas a sanar|(?:el sol|la tirada|el arcano)\s+(?:indica|promete|confirma)\s+(?:la\s+)?(?:recuperación|cura|sanación)|evolucionará favorablemente)\b/i,
  },
  {
    id: "supernatural-certainty",
    expression: /\b(?:las cartas perciben tu energía|el universo te está diciendo|esta carta ha venido a ti porque|el universo quiere que)\b/i,
  },
  {
    id: "literal-death-claim",
    expression: /\b(?:la muerte anuncia|la muerte predice|vas a morir)\b/i,
  },
];
