import { InterpretationLensSelector } from "../reading/InterpretationLensSelector";
import type { InterpretationLensPreference } from "../../types/domain";

interface QuestionFormProps {
  readonly question: string;
  readonly error: string | null;
  readonly lens: InterpretationLensPreference;
  readonly onLensChange: (lens: InterpretationLensPreference) => void;
  readonly onQuestionChange: (question: string) => void;
  readonly onSubmit: () => void;
}

export function QuestionForm({
  question,
  error,
  lens,
  onLensChange,
  onQuestionChange,
  onSubmit,
}: QuestionFormProps) {
  return (
    <form
      className="question-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="consultation-question">Tu pregunta</label>
      <p id="question-help">
        Formula una pregunta abierta sobre aquello que quieras contemplar.
      </p>
      <textarea
        autoFocus
        aria-describedby={`question-help${error ? " question-error" : ""}`}
        aria-invalid={error ? "true" : undefined}
        id="consultation-question"
        onChange={(event) => onQuestionChange(event.currentTarget.value)}
        placeholder="Escribe aquí tu pregunta..."
        rows={4}
        value={question}
      />
      {error && <p className="error-message" id="question-error" role="alert">{error}</p>}
      <InterpretationLensSelector onChange={onLensChange} value={lens} />
      <button className="draw-button" type="submit">
        Proponer una tirada <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
