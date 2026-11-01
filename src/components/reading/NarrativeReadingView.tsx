import { ARCANA_BY_ID } from "../../data/arcana/arcana";
import type { NarrativeReading, NarrativeRelationship } from "../../types/domain";

interface NarrativeReadingViewProps {
  readonly narrative: NarrativeReading;
}

function renderRelationship({ relationship, text }: NarrativeRelationship) {
  const from = ARCANA_BY_ID.get(relationship.fromCardId);
  const to = ARCANA_BY_ID.get(relationship.toCardId);
  if (!from || !to) {
    throw new Error("La relación narrativa contiene un Arcano desconocido.");
  }

  return (
    <li
      data-from-card-id={relationship.fromCardId}
      data-to-card-id={relationship.toCardId}
      key={`${relationship.fromPositionId}-${relationship.toPositionId}`}
    >
      <details className="narrative-relationship">
        <summary>{from.name} ↔ {to.name}</summary>
        <p>{text}</p>
      </details>
    </li>
  );
}

export function NarrativeReadingView({ narrative }: NarrativeReadingViewProps) {
  const prioritizedRelationships = [...narrative.relationships].sort(
    (left, right) => right.relationship.strength - left.relationship.strength,
  );
  const featuredRelationships = prioritizedRelationships.slice(0, 3);
  const additionalRelationships = prioritizedRelationships.slice(3);

  if (narrative.prioritizeRealWorldSupport) {
    return (
      <div aria-label="Orientación prioritaria">
        {narrative.safetyNotice && (
          <p className="narrative-reading__notice" role="alert">{narrative.safetyNotice}</p>
        )}
        <section aria-labelledby="real-world-support-title" className="narrative-reading__section">
          <p className="eyebrow">APOYO PRÁCTICO</p>
          <h3 id="real-world-support-title">Prioriza la ayuda adecuada</h3>
          <p>
            Aquí lo importante es el apoyo práctico, no una lectura de cartas. Si hay peligro
            inmediato, contacta con los servicios de emergencia locales o con alguien de confianza
            que pueda acompañarte. Para decidir qué hacer, apóyate en información directa.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div aria-label="Narrativa simbólica de la lectura">
      {narrative.safetyNotice && (
        <p className="narrative-reading__notice" role="note">{narrative.safetyNotice}</p>
      )}
      <p className="narrative-reading__opening">{narrative.opening}</p>
      <p className="narrative-reading__guide">
        Puedes empezar por cada carta y, si te ayuda, seguir sus vínculos hasta el cierre. Quédate
        con lo que te sirva; no hace falta que todo encaje.
      </p>

      <details aria-labelledby="narrative-cards-title" className="narrative-reading__section">
        <summary>
          <span className="eyebrow">CADA POSICIÓN</span>
          <h3 id="narrative-cards-title">Los Arcanos en la tirada</h3>
        </summary>
        <ol className="narrative-card-list">
          {narrative.cards.map((card) => {
            const arcana = ARCANA_BY_ID.get(card.arcanaId);
            if (!arcana) {
              throw new Error(`No se encontró el Arcano "${card.arcanaId}" en la narrativa.`);
            }
            return (
              <li
                className="narrative-card"
                data-arcana-id={card.arcanaId}
                data-position-id={card.positionId}
                key={card.positionId}
              >
                <details>
                  <summary>
                    <p className="narrative-card__position">POSICIÓN {card.positionId}</p>
                    <h4>{card.heading}</h4>
                  </summary>
                  <div className="narrative-card__content">
                    <p>{card.interpretation}</p>
                    <p className="narrative-card__dimension">
                      <strong>Posibilidad:</strong> {card.lightReflection}.
                    </p>
                    <p className="narrative-card__dimension">
                      <strong>Reto posible:</strong> {card.shadowReflection}.
                    </p>
                    <p className="narrative-card__question-label">Para preguntarte</p>
                    <blockquote>«{card.question}»</blockquote>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      </details>

      <details aria-labelledby="narrative-relationships-title" className="narrative-reading__section">
        <summary>
          <span className="eyebrow">VÍNCULOS</span>
          <h3 id="narrative-relationships-title">Relaciones entre los Arcanos</h3>
        </summary>
        {narrative.relationships.length === 0 ? (
          <p>Una sola carta no establece relaciones entre Arcanos en esta lectura.</p>
        ) : (
          <>
            <p className="narrative-reading__relationship-note">
              Primero aparecen los vínculos con más señales simbólicas en común.
            </p>
            <ol className="narrative-relationship-list">
              {featuredRelationships.map(renderRelationship)}
            </ol>
            {additionalRelationships.length > 0 && (
              <details className="narrative-reading__additional-relationships">
                <summary>Ver los otros {additionalRelationships.length} vínculos</summary>
                <ol className="narrative-relationship-list">
                  {additionalRelationships.map(renderRelationship)}
                </ol>
              </details>
            )}
          </>
        )}
      </details>

      <details aria-labelledby="narrative-movement-title" className="narrative-reading__section">
        <summary>
          <span className="eyebrow">RECORRIDO</span>
          <h3 id="narrative-movement-title">Movimiento de la tirada</h3>
        </summary>
        <p>{narrative.movement}</p>
      </details>

      <details
        aria-labelledby="narrative-synthesis-title"
        className="narrative-reading__section narrative-reading__section--synthesis"
      >
        <summary>
          <span className="eyebrow">CIERRE · SÍNTESIS</span>
          <h3 id="narrative-synthesis-title">Una mirada de conjunto</h3>
        </summary>
        <p>{narrative.synthesis}</p>
      </details>

      <details aria-labelledby="narrative-reflection-title" className="narrative-reading__section">
        <summary>
          <span className="eyebrow">PARA CONTEMPLAR</span>
          <h3 id="narrative-reflection-title">Preguntas abiertas</h3>
        </summary>
        <ol className="narrative-reflection-list">
          {narrative.reflectionQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
