import type { Spread } from "../../types/domain";

interface SpreadPreviewProps {
  readonly spread: Spread;
}

export function SpreadPreview({ spread }: SpreadPreviewProps) {
  return (
    <div className="spread-preview">
      <div
        aria-label={`Disposición de ${spread.name}`}
        className="spread-preview__layout"
        role="img"
      >
        {spread.layout.map(({ positionId, x, y }) => {
          const position = spread.positions.find(({ id }) => id === positionId);
          if (!position) {
            throw new Error(`La tirada "${spread.id}" no define la posición ${positionId}.`);
          }

          return (
            <span
              aria-hidden="true"
              className="spread-preview__position"
              key={positionId}
              style={{ left: `${x}%`, top: `${y}%` }}
              title={`${positionId}. ${position.name}`}
            >
              {positionId}
            </span>
          );
        })}
      </div>
      <div className="spread-preview__details">
        <p className="spread-preview__label">Qué mira cada posición</p>
        <ol className="spread-preview__list">
          {spread.positions.map(({ id, name, description }) => (
            <li key={id}>
              <span>{String(id).padStart(2, "0")}</span>
              <div>
                <strong>{name}</strong>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
