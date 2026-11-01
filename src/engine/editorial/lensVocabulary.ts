import type { InterpretationLensId } from "../../types/domain";

export interface LensVocabulary {
  readonly preferred: readonly string[];
  readonly editorialNote: string;
}

export const LENS_VOCABULARY: Readonly<Record<InterpretationLensId, LensVocabulary>> = {
  "hermetic-rosicrucian": {
    preferred: [
      "transformación", "integración", "polaridad", "umbral", "centro",
      "luz", "sombra", "correspondencia simbólica", "recorrido", "conocimiento",
      "geometría", "proceso iniciático",
    ],
    editorialNote: "Ceremonial y comprensible; presenta la tradición como lente simbólica, no como hecho sobrenatural.",
  },
  marseille: {
    preferred: [
      "número", "estructura", "posición", "equilibrio", "contraste",
      "secuencia", "dirección", "relación entre principios",
    ],
    editorialNote: "Sobria y tradicional; no atribuye al mazo histórico imágenes que ARCANA no contiene.",
  },
  "rider-waite-smith": {
    preferred: [
      "arquetipo", "escena simbólica", "acción", "motivo visual", "transición narrativa",
    ],
    editorialNote: "Se limita a los motivos visuales originales de ARCANA y no reproduce escenas de otras barajas.",
  },
  "psychological-archetypal": {
    preferred: [
      "patrones", "percepción", "conflicto", "integración", "reflexión",
      "motivaciones", "posibilidades", "autoconocimiento",
    ],
    editorialNote: "Reflexiva, no clínica: no diagnostica ni evalúa condiciones psicológicas.",
  },
  "intuitive-contemplative": {
    preferred: [
      "imagen", "resonancia", "atención", "pregunta", "contemplación",
      "apertura", "posibilidad",
    ],
    editorialNote: "Abierta sin atribuir conocimiento sobrenatural a las cartas ni al universo.",
  },
  synthesis: {
    preferred: [
      "perspectiva", "símbolo", "posibilidad", "relación", "integración",
      "contemplación",
    ],
    editorialNote: "Presenta perspectivas distintas sobre un símbolo, sin fundirlas en una doctrina histórica única.",
  },
};
