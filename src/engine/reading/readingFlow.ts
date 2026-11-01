import type {
  QuestionAnalysis,
  ReadingSession,
  Spread,
  SpreadRecommendation,
} from "../../types/domain";
import { drawArcana } from "../random/draw";
import type { RandomSource } from "../random/shuffle";

export type ExperienceState =
  | { readonly stage: "question"; readonly question: string }
  | {
      readonly stage: "recommendation";
      readonly question: string;
      readonly analysis: QuestionAnalysis;
      readonly recommendation: SpreadRecommendation;
    }
  | {
      readonly stage: "confirmed";
      readonly question: string;
      readonly analysis: QuestionAnalysis;
      readonly recommendation: SpreadRecommendation;
      readonly spread: Spread;
    }
  | {
      readonly stage: "choosing";
      readonly question: string;
      readonly analysis: QuestionAnalysis;
      readonly recommendation: SpreadRecommendation;
    }
  | { readonly stage: "ritual"; readonly question: string; readonly spread: Spread }
  | { readonly stage: "shuffling"; readonly question: string; readonly spread: Spread }
  | {
      readonly stage: "revealing";
      readonly reading: ReadingSession;
      readonly revealedPositionIds: readonly number[];
    }
  | {
      readonly stage: "revealed";
      readonly reading: ReadingSession;
      readonly revealedPositionIds: readonly number[];
    }
  | { readonly stage: "summary"; readonly reading: ReadingSession };

export function createQuestionState(question = ""): ExperienceState {
  return { stage: "question", question };
}

export function createRitualState(question: string, spread: Spread): ExperienceState {
  return { stage: "ritual", question, spread };
}

export function confirmRecommendedSpread(state: ExperienceState): ExperienceState {
  if (state.stage !== "recommendation") {
    throw new Error("No hay una recomendación disponible para confirmar.");
  }

  return {
    stage: "confirmed",
    question: state.question,
    analysis: state.analysis,
    recommendation: state.recommendation,
    spread: state.recommendation.spread,
  };
}

export function openManualSpreadChoices(state: ExperienceState): ExperienceState {
  if (state.stage === "recommendation") {
    return {
      stage: "choosing",
      question: state.question,
      analysis: state.analysis,
      recommendation: state.recommendation,
    };
  }
  if (state.stage === "confirmed") {
    return {
      stage: "choosing",
      question: state.question,
      analysis: state.analysis,
      recommendation: state.recommendation,
    };
  }
  throw new Error("No se pueden cambiar las tiradas desde esta etapa.");
}

export function returnToRecommendation(state: ExperienceState): ExperienceState {
  if (state.stage !== "choosing") {
    throw new Error("No hay una selección manual que se pueda cancelar.");
  }

  return {
    stage: "recommendation",
    question: state.question,
    analysis: state.analysis,
    recommendation: state.recommendation,
  };
}

export function confirmManualSpread(
  state: ExperienceState,
  spread: Spread,
): ExperienceState {
  if (state.stage !== "choosing") {
    throw new Error("La elección manual solo se puede confirmar desde el selector.");
  }

  return {
    stage: "confirmed",
    question: state.question,
    analysis: state.analysis,
    recommendation: state.recommendation,
    spread,
  };
}

export function startRitual(state: ExperienceState): ExperienceState {
  if (state.stage !== "confirmed") {
    throw new Error("Primero hay que confirmar una tirada.");
  }

  return createRitualState(state.question, state.spread);
}

export function beginShuffling(state: ExperienceState): ExperienceState {
  if (state.stage !== "ritual") {
    throw new Error("La tirada solo se puede iniciar desde la preparación ritual.");
  }

  return { stage: "shuffling", question: state.question, spread: state.spread };
}

export function completeShuffling(
  state: ExperienceState,
  random?: RandomSource,
): ExperienceState {
  if (state.stage !== "shuffling") {
    throw new Error("No hay un barajado iniciado que se pueda completar.");
  }

  const { spread, question } = state;
  const drawnCards = drawArcana(spread.cardCount, random).map((drawnCard, index) => {
    const position = spread.positions[index];
    if (!position) {
      throw new Error(`La tirada "${spread.id}" no define la posición ${index + 1}.`);
    }

    return { ...drawnCard, position: position.id };
  });

  if (drawnCards.length !== spread.positions.length) {
    throw new Error(`La extracción de "${spread.id}" no coincide con sus posiciones.`);
  }

  const reading: ReadingSession = {
    question,
    spread,
    drawnCards,
    relationships: spread.relationships,
  };

  return { stage: "revealing", reading, revealedPositionIds: [] };
}

export function revealNextCard(state: ExperienceState): ExperienceState {
  if (state.stage !== "revealing") {
    throw new Error("No hay cartas pendientes de revelación.");
  }

  const nextCard = state.reading.drawnCards[state.revealedPositionIds.length];
  if (!nextCard) {
    throw new Error("No se encontró la siguiente carta pendiente.");
  }

  const revealedPositionIds = [...state.revealedPositionIds, nextCard.position];
  const stage = revealedPositionIds.length === state.reading.drawnCards.length
    ? "revealed"
    : "revealing";

  return { stage, reading: state.reading, revealedPositionIds };
}

export function openReadingSummary(state: ExperienceState): ExperienceState {
  if (state.stage !== "revealed") {
    throw new Error("El resumen estará disponible cuando todas las cartas estén reveladas.");
  }

  return { stage: "summary", reading: state.reading };
}

export function returnToRevealed(state: ExperienceState): ExperienceState {
  if (state.stage !== "summary") {
    throw new Error("Solo se puede volver a la tirada desde la lectura.");
  }

  return {
    stage: "revealed",
    reading: state.reading,
    revealedPositionIds: state.reading.drawnCards.map(({ position }) => position),
  };
}

export function prepareAnotherDraw(state: ExperienceState): ExperienceState {
  if (state.stage !== "summary") {
    throw new Error("Solo se puede preparar una nueva extracción desde el resumen.");
  }

  return createRitualState(state.reading.question, state.reading.spread);
}
