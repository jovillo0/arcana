import { ARCANA } from "../data/arcana/arcana";
import type { Arcana, JourneyStage } from "../types/domain";

export const GALLERY_STAGES: readonly {
  readonly id: JourneyStage | "all";
  readonly label: string;
  readonly range: string;
  readonly start: number;
  readonly end: number;
}[] = [
  { id: "all", label: "Todas", range: "0–XXI", start: 0, end: 21 },
  { id: "constituirse", label: "Constituirse", range: "0–V", start: 0, end: 5 },
  {
    id: "entrar-en-el-mundo",
    label: "Entrar en el mundo",
    range: "VI–X",
    start: 6,
    end: 10,
  },
  { id: "transformarse", label: "Transformarse", range: "XI–XVI", start: 11, end: 16 },
  { id: "reintegrarse", label: "Reintegrarse", range: "XVII–XXI", start: 17, end: 21 },
];

export function getGalleryArcana(stage: JourneyStage | "all"): readonly Arcana[] {
  if (stage === "all") return ARCANA;
  return ARCANA.filter((arcana) => arcana.journeyStage === stage);
}

export const GALLERY_CHECKLIST = [
  "Se reconoce el motivo principal en miniatura",
  "La composición es distinta de cartas próximas",
  "La geometría está integrada y no parece superpuesta",
  "La materia aporta significado",
  "La iluminación tiene función simbólica",
  "El uso de oro está controlado",
  "No recuerda excesivamente a una baraja tradicional",
  "Es coherente con ARCANA",
  "Necesita revisión artística",
] as const;
