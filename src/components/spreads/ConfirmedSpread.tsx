import type { Spread } from "../../types/domain";
import { SpreadPreview } from "./SpreadPreview";

interface ConfirmedSpreadProps {
  readonly spread: Spread;
  readonly onPrepare: () => void;
  readonly onChange: () => void;
}

export function ConfirmedSpread({
  spread,
  onPrepare,
  onChange,
}: ConfirmedSpreadProps) {
  return (
    <section aria-labelledby="confirmed-spread-title" className="confirmed-spread">
      <div className="section-heading">
        <div>
          <p className="eyebrow">TIRADA CONFIRMADA</p>
          <h2 id="confirmed-spread-title">{spread.name}</h2>
        </div>
        <button className="text-button" onClick={onChange} type="button">Cambiar tirada</button>
      </div>
      <p className="confirmed-spread__purpose">{spread.purpose}</p>
      <span className="card-count">{spread.cardCount} {spread.cardCount === 1 ? "carta" : "cartas"}</span>
      <SpreadPreview spread={spread} />
      <button className="draw-button" onClick={onPrepare} type="button">
        Preparar la tirada <span aria-hidden="true">↗</span>
      </button>
    </section>
  );
}
