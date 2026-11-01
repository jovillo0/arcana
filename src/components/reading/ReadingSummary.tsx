import { ARCANA_BY_ID } from "../../data/arcana/arcana";
import { InterpretationLensSelector } from "./InterpretationLensSelector";
import { NarrativeProviderExperiment } from "./NarrativeProviderExperiment";
import { NarrativeReadingView } from "./NarrativeReadingView";
import { SymbolicReadingView } from "./SymbolicReadingView";
import type {
  InterpretationLensId,
  InterpretationLensPreference,
  NarrativeReading,
  ReadingSession,
  SymbolicReading,
} from "../../types/domain";

interface ReadingSummaryProps {
  readonly reading: ReadingSession;
  readonly interpretation: SymbolicReading;
  readonly narrative: NarrativeReading;
  readonly lens: InterpretationLensId;
  readonly lensPreference: InterpretationLensPreference;
  readonly onLensChange: (lens: InterpretationLensPreference) => void;
  readonly onReturnToSpread: () => void;
  readonly onPrepareAnother: () => void;
  readonly onNewQuestion: () => void;
}

export function ReadingSummary({
  reading,
  interpretation,
  narrative,
  lens,
  lensPreference,
  onLensChange,
  onReturnToSpread,
  onPrepareAnother,
  onNewQuestion,
}: ReadingSummaryProps) {
  return (
    <section aria-labelledby="reading-summary-title" className="reading-summary">
      <p className="eyebrow">
        {narrative.prioritizeRealWorldSupport ? "ORIENTACIÓN PRIORITARIA" : "RECORRIDO CONTEMPLATIVO"}
      </p>
      <h2 id="reading-summary-title">
        {narrative.prioritizeRealWorldSupport ? "Prioriza apoyo práctico" : "Contemplar la tirada"}
      </h2>
      {!narrative.prioritizeRealWorldSupport && (
        <>
          <p className="reading-summary__question">“{reading.question}”</p>
          <div className="reading-summary__spread">
            <span>{reading.spread.cardCount} {reading.spread.cardCount === 1 ? "CARTA" : "CARTAS"}</span>
            <h3>{reading.spread.name}</h3>
          </div>
          <details className="reading-summary__cards">
            <summary>Ver las cartas y sus posiciones</summary>
            <ol className="reading-summary__list">
              {reading.drawnCards.map(({ arcanaId, position }) => {
                const arcana = ARCANA_BY_ID.get(arcanaId);
                const spreadPosition = reading.spread.positions.find(({ id }) => id === position);
                if (!arcana || !spreadPosition) {
                  throw new Error(`La lectura contiene una carta o posición inválida (${position}).`);
                }

                return (
                  <li key={position}>
                    <span className="reading-summary__position">
                      POSICIÓN {position} · {spreadPosition.name}
                    </span>
                    <span className="reading-summary__arcana">
                      {arcana.romanNumeral} · {arcana.name}
                    </span>
                    <span className="reading-summary__core">{arcana.symbolicCore}</span>
                  </li>
                );
              })}
            </ol>
          </details>
          <InterpretationLensSelector
            onChange={onLensChange}
            resolvedLens={lens}
            value={lensPreference}
          />
        </>
      )}
      <NarrativeReadingView narrative={narrative} />
      {import.meta.env.DEV && !narrative.prioritizeRealWorldSupport && (
        <NarrativeProviderExperiment
          input={{ reading, symbolicReading: interpretation, lensId: lens }}
          key={lens}
          localNarrative={narrative}
        />
      )}
      {!narrative.prioritizeRealWorldSupport && (
        <details className="symbolic-reading-details">
          <summary>Ver detalles simbólicos adicionales</summary>
          <SymbolicReadingView interpretation={interpretation} />
        </details>
      )}
      <div className="recommendation-actions reading-summary__actions">
        {!narrative.prioritizeRealWorldSupport && (
          <button className="draw-button" onClick={onReturnToSpread} type="button">
            Volver a contemplar la tirada
          </button>
        )}
        {!narrative.prioritizeRealWorldSupport && (
          <button className="text-button" onClick={onPrepareAnother} type="button">
            Hacer otra tirada con esta pregunta
          </button>
        )}
        <button className="text-button" onClick={onNewQuestion} type="button">
          Nueva consulta
        </button>
      </div>
    </section>
  );
}
