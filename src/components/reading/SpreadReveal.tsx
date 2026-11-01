import { useEffect, useRef } from "react";
import { ARCANA_BY_ID } from "../../data/arcana/arcana";
import type { ReadingSession, SpreadPosition } from "../../types/domain";
import { ArcanaEmblem } from "../brand/ArcanaEmblem";
import { CardFrame } from "../cards/CardFrame";

interface SpreadRevealProps {
  readonly reading: ReadingSession;
  readonly revealedPositionIds: readonly number[];
  readonly onRevealNext: () => void;
}

function romanPosition(position: number): string {
  const numerals: readonly [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let remaining = position;
  let result = "";

  for (const [value, symbol] of numerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}

function getPosition(positionId: number, positions: readonly SpreadPosition[]): SpreadPosition {
  const position = positions.find(({ id }) => id === positionId);
  if (!position) {
    throw new Error(`No se encontró la posición ${positionId} en la tirada.`);
  }
  return position;
}

export function SpreadReveal({
  reading,
  revealedPositionIds,
  onRevealNext,
}: SpreadRevealProps) {
  const nextRevealButton = useRef<HTMLButtonElement>(null);
  const previousRevealCount = useRef(revealedPositionIds.length);
  const nextCard = reading.drawnCards.find(
    ({ position }) => !revealedPositionIds.includes(position),
  );
  const progress = `${revealedPositionIds.length}/${reading.drawnCards.length}`;
  const remainingCount = reading.drawnCards.length - revealedPositionIds.length;

  useEffect(() => {
    if (previousRevealCount.current !== revealedPositionIds.length && nextCard) {
      nextRevealButton.current?.focus();
    }
    previousRevealCount.current = revealedPositionIds.length;
  }, [nextCard, revealedPositionIds.length]);

  return (
    <section aria-labelledby="reveal-title" className="spread-reveal">
      <div className="section-heading">
        <div>
          <p className="eyebrow">LA TIRADA · {reading.spread.name}</p>
          <h2 id="reveal-title">
            {nextCard ? "Revela la siguiente carta" : "La tirada está completa"}
          </h2>
        </div>
        <span aria-label={`${revealedPositionIds.length} de ${reading.drawnCards.length} cartas reveladas`} className="draw-count">
          {progress}
        </span>
      </div>

      <div
        aria-label={`Disposición de ${reading.spread.name}`}
        className="tarot-table"
        role="group"
      >
        {reading.drawnCards.map(({ arcanaId, position }) => {
          const arcana = ARCANA_BY_ID.get(arcanaId);
          if (!arcana) {
            throw new Error(`No se encontró el Arcano con identificador "${arcanaId}".`);
          }
          const positionData = getPosition(position, reading.spread.positions);
          const isRevealed = revealedPositionIds.includes(position);
          const isNext = nextCard?.position === position;
          const layout = reading.spread.layout.find(({ positionId }) => positionId === position);
          if (!layout) {
            throw new Error(`No se encontró la disposición visual para la posición ${position}.`);
          }

          return (
            <div
              className={`tarot-slot${isRevealed ? " is-revealed" : ""}`}
              data-state={isRevealed ? "revealed" : isNext ? "next" : "pending"}
              key={position}
              style={{ left: `${layout.x}%`, top: `${layout.y}%` }}
            >
              <div className="tarot-card__inner">
                <div aria-hidden="true" className="tarot-card__face tarot-card__back">
                  <span className="tarot-card__back-inset">
                    <ArcanaEmblem className="tarot-card__back-emblem" />
                  </span>
                </div>
                {isRevealed && (
                  <div
                    aria-label={`${arcana.romanNumeral} · ${arcana.name}. Posición ${romanPosition(position)}, ${positionData.name}`}
                    className="tarot-card__face tarot-card__front"
                    role="group"
                  >
                    <CardFrame
                      arcana={arcana}
                      className="card-frame--reveal"
                      positionLabel={`POSICIÓN ${romanPosition(position)} · ${positionData.name}`}
                    />
                  </div>
                )}
              </div>
              {!isRevealed && isNext && (
                <button
                  aria-label={`Revelar posición ${romanPosition(position)}: ${positionData.name}`}
                  className="tarot-slot__trigger"
                  onClick={onRevealNext}
                  ref={nextRevealButton}
                  type="button"
                />
              )}
              {!isRevealed && (
                <span className="tarot-slot__caption">
                  {`${romanPosition(position)} · ${positionData.name}`}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p aria-live="polite" className="reveal-announcement" role="status">
        {revealedPositionIds.length === 0
          ? "Las cartas ya están elegidas. Pulsa una carta boca abajo para revelar la primera."
          : nextCard
            ? `Revelada la carta ${revealedPositionIds.length} de ${reading.drawnCards.length}. Quedan ${remainingCount}. Siguiente: ${getPosition(nextCard.position, reading.spread.positions).name}.`
            : `La tirada está completa: ${reading.drawnCards.length} cartas reveladas.`}
      </p>
    </section>
  );
}
