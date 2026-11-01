import type { Arcana } from "../../types/domain";

interface CardFrameProps {
  readonly arcana: Arcana;
  readonly positionLabel?: string;
  readonly stageLabel?: string;
  readonly description?: string;
  readonly className?: string;
}

export function CardFrame({
  arcana,
  positionLabel,
  stageLabel,
  description,
  className = "",
}: CardFrameProps) {
  const imageSrc = `${import.meta.env.BASE_URL}${arcana.imageRef.replace(/^\/+/, "")}`;

  return (
    <div className={`card-frame ${className}`.trim()}>
      {positionLabel && <span className="card-frame__position">{positionLabel}</span>}
      <span aria-hidden="true" className="card-frame__numeral">
        {arcana.romanNumeral}
      </span>
      <div
        aria-hidden="true"
        className="card-frame__art card-frame__art--illustrated"
      >
        <img alt="" className="card-frame__image" src={imageSrc} />
      </div>
      {stageLabel && <p className="card-frame__stage">{stageLabel}</p>}
      <h3 className="card-frame__name">{arcana.name}</h3>
      {description && <p className="card-frame__description">{description}</p>}
      <span aria-hidden="true" className="card-frame__foot-mark">◇</span>
    </div>
  );
}
