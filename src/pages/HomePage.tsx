import { useEffect, useMemo, useRef, useState } from "react";
import { QuestionForm } from "../components/questions/QuestionForm";
import { ArcanaEmblem } from "../components/brand/ArcanaEmblem";
import { QuestionRecommendation } from "../components/questions/QuestionRecommendation";
import { ReadingSummary } from "../components/reading/ReadingSummary";
import { SpreadReveal } from "../components/reading/SpreadReveal";
import { RitualPreparation } from "../components/ritual/RitualPreparation";
import { ManualSpreadPicker } from "../components/spreads/ManualSpreadPicker";
import { SPREADS } from "../data/spreads/spreads";
import { localQuestionAnalyzer } from "../engine/questions/analyseQuestion";
import { buildSymbolicReading } from "../engine/interpretation/localSymbolicEngine";
import { buildNarrativeReading } from "../engine/narrative/buildNarrativeReading";
import type {
  InterpretationLensId,
  InterpretationLensPreference,
  QuestionAnalysis,
} from "../types/domain";
import { selectAutomaticLens } from "../engine/interpretation/selectAutomaticLens";
import {
  beginShuffling,
  completeShuffling,
  confirmManualSpread,
  confirmRecommendedSpread,
  createQuestionState,
  openManualSpreadChoices,
  openReadingSummary,
  prepareAnotherDraw,
  returnToRevealed,
  returnToRecommendation,
  revealNextCard,
  startRitual,
  type ExperienceState,
} from "../engine/reading/readingFlow";
import { selectSpread } from "../engine/spreads/selectSpread";

const SHUFFLE_PRESENTATION_MS = 900;

export function HomePage() {
  const [experience, setExperience] = useState<ExperienceState>(() => createQuestionState());
  const [hasStarted, setHasStarted] = useState(false);
  const [interpretationLens, setInterpretationLens] =
    useState<InterpretationLensId>("hermetic-rosicrucian");
  const [lensPreference, setLensPreference] =
    useState<InterpretationLensPreference>("hermetic-rosicrucian");
  const [questionAnalysis, setQuestionAnalysis] = useState<QuestionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const completionButton = useRef<HTMLButtonElement>(null);
  const previousStage = useRef(experience.stage);
  const symbolicReading = useMemo(
    () => experience.stage === "summary" ? buildSymbolicReading(experience.reading) : null,
    [experience],
  );
  const narrativeReading = useMemo(
    () => experience.stage === "summary" && symbolicReading
      ? buildNarrativeReading(experience.reading, symbolicReading, interpretationLens)
      : null,
    [experience, interpretationLens, symbolicReading],
  );

  useEffect(() => {
    if (
      experience.stage === "revealed" &&
      (previousStage.current === "revealing" || previousStage.current === "summary")
    ) {
      completionButton.current?.focus();
    } else if (previousStage.current !== experience.stage) {
      const focusTarget = experience.stage === "question" && hasStarted
        ? document.querySelector<HTMLElement>("#consultation-question")
        : document.querySelector<HTMLElement>(
          experience.stage === "question" ? ".intro h1" : "main h2",
        );
      if (focusTarget) {
        if (focusTarget.matches("h1, h2")) {
          focusTarget.tabIndex = -1;
        }
        focusTarget.focus();
      }
    }
    previousStage.current = experience.stage;
  }, [experience.stage, hasStarted]);

  function changeLensPreference(preference: InterpretationLensPreference) {
    setLensPreference(preference);
    if (preference === "automatic") {
      if (questionAnalysis) {
        setInterpretationLens(selectAutomaticLens(questionAnalysis));
      }
    } else {
      setInterpretationLens(preference);
    }
  }

  useEffect(() => {
    if (experience.stage !== "shuffling") {
      return;
    }

    const shufflingState = experience;
    const timeoutId = window.setTimeout(() => {
      try {
        const completedState = completeShuffling(shufflingState);
        setExperience((current) => current.stage === "shuffling" ? completedState : current);
        setError(null);
      } catch (shuffleError) {
        setExperience((current) => current.stage === "shuffling"
          ? { stage: "ritual", question: current.question, spread: current.spread }
          : current);
        setError(
          shuffleError instanceof Error
            ? shuffleError.message
            : "No se pudo completar el barajado. Inténtalo de nuevo.",
        );
      }
    }, SHUFFLE_PRESENTATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [experience]);

  function handleAnalyse() {
    if (experience.stage !== "question") {
      return;
    }
    if (!experience.question.trim()) {
      setError("Escribe una pregunta para poder proponer una tirada.");
      return;
    }

    try {
      const analysis = localQuestionAnalyzer.analyze(experience.question);
      const recommendation = selectSpread(analysis);
      setQuestionAnalysis(analysis);
      if (lensPreference === "automatic") {
        setInterpretationLens(selectAutomaticLens(analysis));
      }
      setExperience({
        stage: "recommendation",
        question: experience.question,
        analysis,
        recommendation,
      });
      setError(null);
    } catch (analysisError) {
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : "No se pudo analizar la consulta. Inténtalo de nuevo.",
      );
    }
  }

  function beginRitualShuffle() {
    try {
      setExperience((current) => beginShuffling(current));
      setError(null);
    } catch (transitionError) {
      setError(
        transitionError instanceof Error
          ? transitionError.message
          : "No se pudo iniciar la preparación.",
      );
    }
  }

  function changeQuestion(question: string) {
    setExperience((current) => current.stage === "question"
      ? { ...current, question }
      : current);
    setQuestionAnalysis(null);
    setError(null);
  }

  function resetConsultation() {
    setExperience(createQuestionState());
    setQuestionAnalysis(null);
    setHasStarted(false);
    setError(null);
  }

  return (
    <main className="page-shell">
      <header className="site-header">
        <a aria-label="ARCANA, inicio" className="wordmark" href={import.meta.env.BASE_URL}>
          <ArcanaEmblem className="wordmark__symbol" />
          ARCANA
        </a>
        <span className="header-note">UN ESPACIO DE REFLEXIÓN</span>
      </header>

      {!hasStarted && experience.stage === "question" && (
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow"><span /> LOS VEINTIDÓS ARCANOS MAYORES</p>
          <h1 id="page-title">ARCANA<br /><em>otra perspectiva.</em></h1>
          <p className="intro__copy">
            Un espacio simbólico para contemplar aquello que te importa.
          </p>
          <button
            className="draw-button intro__start"
            onClick={() => setHasStarted(true)}
            type="button"
          >
            Comenzar <span aria-hidden="true">↗</span>
          </button>
        </section>
      )}

      {experience.stage === "question" && hasStarted && (
        <section aria-label="Escribe tu consulta" className="ritual-panel">
          <div className="ritual-panel__heading">
            <span className="step-mark">01</span>
            <div>
              <h2>¿Qué deseas explorar?</h2>
            </div>
          </div>
          <QuestionForm
            error={error}
            lens={lensPreference}
            onLensChange={changeLensPreference}
            onQuestionChange={changeQuestion}
            onSubmit={handleAnalyse}
            question={experience.question}
          />
        </section>
      )}

      {experience.stage === "recommendation" && (
        <>
          <QuestionRecommendation
            question={experience.question}
            onAccept={() => {
              setExperience((current) => startRitual(confirmRecommendedSpread(current)));
              setError(null);
            }}
            onChooseAnother={() => {
              setExperience((current) => openManualSpreadChoices(current));
              setError(null);
            }}
            recommendation={experience.recommendation}
          />
          {error && <p className="error-message" role="alert">{error}</p>}
          <button className="text-button restart-button" onClick={resetConsultation} type="button">
            Formular otra pregunta
          </button>
        </>
      )}

      {experience.stage === "choosing" && (
        <ManualSpreadPicker
          onCancel={() => {
            setExperience((current) => returnToRecommendation(current));
            setError(null);
          }}
          onSelect={(spread) => {
            setExperience((current) => startRitual(confirmManualSpread(current, spread)));
            setError(null);
          }}
          spreads={SPREADS}
        />
      )}

      {(experience.stage === "ritual" || experience.stage === "shuffling") && (
        <>
          {error && <p className="error-message" role="alert">{error}</p>}
          <RitualPreparation
            isShuffling={experience.stage === "shuffling"}
            onBegin={beginRitualShuffle}
            onReturnToQuestion={() => {
              if (experience.stage === "ritual") {
                setExperience(createQuestionState(experience.question));
                setQuestionAnalysis(null);
                setError(null);
              }
            }}
            question={experience.question}
            spread={experience.spread}
          />
        </>
      )}

      {(experience.stage === "revealing" || experience.stage === "revealed") && (
        <>
          <section className="confirmed-context">
            <p className="eyebrow">TU CONSULTA · {experience.reading.spread.name}</p>
            <p>“{experience.reading.question}”</p>
          </section>
          <SpreadReveal
            onRevealNext={() => {
              setExperience((current) => revealNextCard(current));
              setError(null);
            }}
            reading={experience.reading}
            revealedPositionIds={experience.revealedPositionIds}
          />
          {experience.stage === "revealed" && (
            <div className="reading-complete">
              <button
                className="draw-button"
                onClick={() => setExperience((current) => openReadingSummary(current))}
                ref={completionButton}
                type="button"
              >
                Contemplar la tirada <span aria-hidden="true">↗</span>
              </button>
            </div>
          )}
        </>
      )}

      {experience.stage === "summary" && (
        symbolicReading && narrativeReading && (
        <ReadingSummary
          onNewQuestion={resetConsultation}
          onLensChange={changeLensPreference}
          onReturnToSpread={() => setExperience((current) => returnToRevealed(current))}
          onPrepareAnother={() => {
            setExperience((current) => prepareAnotherDraw(current));
            setError(null);
          }}
          interpretation={symbolicReading}
          lens={interpretationLens}
          lensPreference={lensPreference}
          narrative={narrativeReading}
          reading={experience.reading}
        />
        )
      )}

      <footer className="site-footer">
        <span>ARCANA · SISTEMA SIMBÓLICO PROPIO</span>
        <p>Una experiencia de reflexión, no una predicción cierta del futuro.</p>
      </footer>
    </main>
  );
}
