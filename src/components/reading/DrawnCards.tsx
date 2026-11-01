import { ARCANA_BY_ID } from "../../data/arcana/arcana";
import type { DrawnCard } from "../../types/domain";
import { ArcanaCard } from "../cards/ArcanaCard";
import { ArcanaEmblem } from "../brand/ArcanaEmblem";

interface DrawnCardsProps {
  readonly cards: readonly DrawnCard[];
}

export function DrawnCards({ cards }: DrawnCardsProps) {
  if (cards.length === 0) {
    return (
      <div className="reading-empty" aria-live="polite">
        <ArcanaEmblem className="reading-empty__mark" />
        <p>Las cartas aparecerán aquí</p>
        <span>El azar es independiente de cualquier pregunta.</span>
      </div>
    );
  }

  return (
    <div className="reading-grid" aria-live="polite" aria-label="Cartas extraídas">
      {cards.map(({ arcanaId, position }) => {
        const arcana = ARCANA_BY_ID.get(arcanaId);
        if (!arcana) {
          throw new Error(`No se encontró el Arcano con identificador "${arcanaId}".`);
        }

        return <ArcanaCard arcana={arcana} key={arcanaId} position={position} />;
      })}
    </div>
  );
}
