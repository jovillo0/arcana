import type {
  InterpretationLensId,
  InterpretationTradition,
} from "../../types/domain";

export const INTERPRETATION_TRADITIONS: readonly InterpretationTradition[] = [
  {
    id: "hermetic-rosicrucian",
    name: "Hermético / Rosacruz",
    description: "Sigue cómo una idea cambia a lo largo de la tirada y qué tensiones conviven.",
  },
  {
    id: "marseille",
    name: "Tarot de Marsella",
    description: "Fíjate en los números, el orden de las cartas y los cambios entre posiciones.",
  },
  {
    id: "rider-waite-smith",
    name: "Rider-Waite-Smith",
    description: "Lee los símbolos de las imágenes y pregúntate qué posibilidades representan para ti.",
  },
  {
    id: "psychological-archetypal",
    name: "Psicológico / Arquetípico",
    description: "Explora patrones y tensiones propios como preguntas, no como etiquetas.",
  },
  {
    id: "intuitive-contemplative",
    name: "Intuitivo / Contemplativo",
    description: "Empieza por la imagen que más te llama y deja abiertas varias lecturas.",
  },
  {
    id: "synthesis",
    name: "Síntesis",
    description: "Reúne distintas perspectivas con cautela; ninguna cierra la respuesta.",
  },
  {
    id: "automatic",
    name: "Automático",
    description: "Propone una perspectiva según la intención y la confianza del análisis local de la pregunta.",
  },
];

export const INTERPRETATION_LENSES: readonly (
  InterpretationTradition & { readonly id: InterpretationLensId }
)[] = INTERPRETATION_TRADITIONS.filter(
  (tradition): tradition is InterpretationTradition & { readonly id: InterpretationLensId } =>
    tradition.id !== "automatic",
);
