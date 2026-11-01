import type {
  InterpretationLensId,
  InterpretationTradition,
} from "../../types/domain";

export const INTERPRETATION_TRADITIONS: readonly InterpretationTradition[] = [
  {
    id: "hermetic-rosicrucian",
    name: "Hermético / Rosacruz",
    description: "Mira las cartas como un recorrido de transformación y observa sus símbolos y polaridades.",
  },
  {
    id: "marseille",
    name: "Tarot de Marsella",
    description: "Se fija en los números, el orden y los contrastes entre posiciones.",
  },
  {
    id: "rider-waite-smith",
    name: "Rider-Waite-Smith",
    description: "Observa arquetipos y símbolos en las ilustraciones propias de ARCANA.",
  },
  {
    id: "psychological-archetypal",
    name: "Psicológico / Arquetípico",
    description: "Explora patrones y tensiones interiores como posibilidades de autoconocimiento.",
  },
  {
    id: "intuitive-contemplative",
    name: "Intuitivo / Contemplativo",
    description: "Parte de las imágenes y preguntas para una lectura abierta.",
  },
  {
    id: "synthesis",
    name: "Síntesis",
    description: "Combina varias perspectivas con cautela para ofrecer una mirada de conjunto.",
  },
  {
    id: "automatic",
    name: "Automático",
    description: "Selección automática de lente, pendiente de definición.",
  },
];

export const INTERPRETATION_LENSES: readonly (
  InterpretationTradition & { readonly id: InterpretationLensId }
)[] = INTERPRETATION_TRADITIONS.filter(
  (tradition): tradition is InterpretationTradition & { readonly id: InterpretationLensId } =>
    tradition.id !== "automatic",
);
