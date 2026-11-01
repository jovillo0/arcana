import { ARCANA_BY_ID } from "../../data/arcana/arcana";
import type {
  JourneyStage,
  SymbolicReading,
  SymbolicRelationshipPattern,
} from "../../types/domain";

interface SymbolicReadingViewProps {
  readonly interpretation: SymbolicReading;
}

const STAGE_LABELS: Readonly<Record<JourneyStage, string>> = {
  constituirse: "Constituirse",
  "entrar-en-el-mundo": "Entrar en el mundo",
  transformarse: "Transformarse",
  reintegrarse: "Reintegrarse",
};

const PATTERN_LABELS: Readonly<Record<SymbolicRelationshipPattern, string>> = {
  continuity: "Continuidad",
  contrast: "Contraste estructural",
  reinforcement: "Refuerzo",
  tension: "Tensión o giro",
  transition: "Transición",
  repetition: "Repetición conceptual",
  "stage-progression": "Progresión del viaje",
  "stage-return": "Retorno a una etapa anterior",
  "stage-jump": "Salto entre etapas",
};

export function SymbolicReadingView({ interpretation }: SymbolicReadingViewProps) {
  return (
    <div className="symbolic-reading">
      <section aria-labelledby="symbolic-cards-title" className="symbolic-reading__section">
        <p className="eyebrow">LECTURA ESTRUCTURADA</p>
        <h3 id="symbolic-cards-title">Cada Arcano en su posición</h3>
        <p className="symbolic-reading__intro">
          Estas posibilidades simbólicas se ofrecen para la reflexión; no son diagnósticos,
          predicciones ni instrucciones.
        </p>
        <ol className="symbolic-card-list">
          {interpretation.cards.map((card) => {
            const arcana = ARCANA_BY_ID.get(card.arcanaId);
            if (!arcana) {
              throw new Error(`No se encontró el Arcano "${card.arcanaId}" en la lectura simbólica.`);
            }

            return (
              <li className="symbolic-card" key={card.positionId}>
                <p className="symbolic-card__position">
                  Posición {card.positionId} · {card.positionName}
                </p>
                <h4>{arcana.romanNumeral} · {arcana.name}</h4>
                <p className="symbolic-card__position-meaning">{card.positionMeaning}</p>
                <dl className="symbolic-card__details">
                  <div>
                    <dt>Núcleo simbólico</dt>
                    <dd>{card.core}</dd>
                  </div>
                  <div>
                    <dt>Dimensión luminosa</dt>
                    <dd>{card.lightDimension}</dd>
                  </div>
                  <div>
                    <dt>Dimensión sombría</dt>
                    <dd>{card.shadowDimension}</dd>
                  </div>
                  <div>
                    <dt>Principio transformador</dt>
                    <dd>{card.transformativePrinciple}</dd>
                  </div>
                  <div>
                    <dt>Pregunta iniciática</dt>
                    <dd>{card.initiatoryQuestion}</dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="symbolic-relationships-title" className="symbolic-reading__section">
        <p className="eyebrow">LECTURA EN RELACIÓN</p>
        <h3 id="symbolic-relationships-title">Relaciones entre los Arcanos</h3>
        {interpretation.relationships.length === 0 ? (
          <p className="symbolic-reading__intro">
            Esta tirada contiene una sola carta, por lo que no hay relaciones entre cartas que analizar.
          </p>
        ) : (
          <ol className="symbolic-relationship-list">
            {interpretation.relationships.map((relationship) => {
              const from = ARCANA_BY_ID.get(relationship.fromCardId);
              const to = ARCANA_BY_ID.get(relationship.toCardId);
              if (!from || !to) {
                throw new Error("La lectura simbólica contiene una relación con un Arcano desconocido.");
              }
              return (
                <li key={`${relationship.fromPositionId}-${relationship.toPositionId}`}>
                  <p className="symbolic-relationship-list__cards">
                    {from.name} <span aria-hidden="true">→</span> {to.name}
                  </p>
                  <p className="symbolic-relationship-list__meta">
                    Posiciones {relationship.fromPositionId} y {relationship.toPositionId}
                    {" · "}{PATTERN_LABELS[relationship.type] ?? relationship.type}
                  </p>
                  <ul>
                    {relationship.spreadStructure.map(({ type, description }) => (
                      <li key={`${type}-${description}`}>{description}</li>
                    ))}
                    {relationship.observations.map((observation) => (
                      <li key={observation}>{observation}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section aria-labelledby="symbolic-movement-title" className="symbolic-reading__section">
        <p className="eyebrow">SECUENCIA</p>
        <h3 id="symbolic-movement-title">Movimiento de la tirada</h3>
        <p className="symbolic-reading__intro">
          La secuencia sugiere simbólicamente un recorrido entre estos movimientos:
          {" "}{interpretation.dominantStages.map((stage) => STAGE_LABELS[stage]).join(" · ")}.
        </p>
        {interpretation.sequenceObservations.length > 0 && (
          <ol className="symbolic-movement-list">
            {interpretation.sequenceObservations.map((observation) => (
              <li key={observation}>{observation}</li>
            ))}
          </ol>
        )}
        {interpretation.reflectionQuestions.length > 0 && (
          <div className="symbolic-reflection">
            <h4>Preguntas para continuar la reflexión</h4>
            <ul>
              {interpretation.reflectionQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
