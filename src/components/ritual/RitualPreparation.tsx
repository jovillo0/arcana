import type { Spread } from "../../types/domain";
import { ArcanaEmblem } from "../brand/ArcanaEmblem";

interface RitualPreparationProps {
  readonly question: string;
  readonly spread: Spread;
  readonly isShuffling: boolean;
  readonly onBegin: () => void;
  readonly onReturnToQuestion: () => void;
}

export function RitualPreparation({
  question,
  spread,
  isShuffling,
  onBegin,
  onReturnToQuestion,
}: RitualPreparationProps) {
  return (
    <section aria-labelledby="ritual-title" className="ritual-preparation">
      <ArcanaEmblem className="ritual-preparation__emblem" />
      <p className="eyebrow">PREPARACIÓN · {spread.cardCount} {spread.cardCount === 1 ? "CARTA" : "CARTAS"}</p>
      <h2 id="ritual-title">Antes de barajar.</h2>
      <blockquote>“{question}”</blockquote>
      <div className="concentration-copy">
        <p>Tómate un momento para respirar y mantener tu pregunta presente.</p>
      </div>

      <div className="ritual-spread-info">
        <div>
          <span className="field-label">
            {spread.cardCount} {spread.cardCount === 1 ? "CARTA" : "CARTAS"}
          </span>
          <h3>{spread.name}</h3>
          <p>{spread.purpose}</p>
        </div>
      </div>

      {!isShuffling ? (
        <div className="ritual-preparation__actions">
          <button className="draw-button draw-button--primary" onClick={onBegin} type="button">
            Barajar los Arcanos <span aria-hidden="true">↗</span>
          </button>
          <button className="text-button" onClick={onReturnToQuestion} type="button">
            Volver a revisar mi pregunta
          </button>
        </div>
      ) : (
        <div aria-live="polite" className="shuffle-state" role="status">
          <ArcanaEmblem className="shuffle-state__seal" />
          <p>Barajando los Arcanos…</p>
        </div>
      )}
    </section>
  );
}
