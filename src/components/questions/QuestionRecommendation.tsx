import type { SpreadRecommendation } from "../../types/domain";
import { SpreadPreview } from "../spreads/SpreadPreview";

interface QuestionRecommendationProps {
  readonly question: string;
  readonly recommendation: SpreadRecommendation;
  readonly onAccept: () => void;
  readonly onChooseAnother: () => void;
}

export function QuestionRecommendation({
  question,
  recommendation,
  onAccept,
  onChooseAnother,
}: QuestionRecommendationProps) {
  const { spread } = recommendation;

  return (
    <section aria-labelledby="recommendation-title" className="recommendation-panel">
      <div className="recommendation-panel__top">
        <div>
          <p className="eyebrow">UNA SUGERENCIA · PUEDES ELEGIR OTRA</p>
          <h2 id="recommendation-title">Tirada propuesta</h2>
        </div>
      </div>

      <blockquote className="recommendation-question">“{question.trim()}”</blockquote>

      <div className="recommendation-spread">
        <div className="recommendation-spread__intro">
          <h3>{spread.name}</h3>
          <p className="spread-why"><strong>Por qué puede encajar:</strong> {recommendation.explanation}</p>
          <p className="spread-purpose"><strong>Qué permite explorar:</strong> {spread.purpose}</p>
          <span className="card-count">{spread.cardCount} {spread.cardCount === 1 ? "carta" : "cartas"}</span>
        </div>
        <SpreadPreview spread={spread} />
      </div>

      <div className="recommendation-actions">
        <button className="draw-button" onClick={onAccept} type="button">
          Continuar con esta tirada <span aria-hidden="true">↗</span>
        </button>
        <button className="text-button" onClick={onChooseAnother} type="button">
          Elegir otra tirada
        </button>
      </div>
    </section>
  );
}
