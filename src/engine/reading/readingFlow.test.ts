import { describe, expect, it, vi } from "vitest";
import { SPREADS } from "../../data/spreads/spreads";
import type { Spread } from "../../types/domain";
import {
  beginShuffling,
  completeShuffling,
  createRitualState,
  openReadingSummary,
  prepareAnotherDraw,
  revealNextCard,
  returnToRevealed,
  type ExperienceState,
} from "./readingFlow";

const spread: Spread = SPREADS.find(({ id }) => id === "la-encrucijada")
  ?? (() => {
    throw new Error("No se encuentra la tirada La Encrucijada para sus pruebas.");
  })();

function reachRevealing(question = "¿Qué deseo explorar?", random = () => 0.42) {
  const ritual = createRitualState(question, spread);
  return completeShuffling(beginShuffling(ritual), random);
}

describe("reading flow", () => {
  it("does not extract any cards before the user starts shuffling", () => {
    const random = vi.fn(() => 0.5);
    const ritual = createRitualState("Una pregunta reflexiva.", spread);

    expect(ritual.stage).toBe("ritual");
    expect(random).not.toHaveBeenCalled();

    const shuffling = beginShuffling(ritual);
    expect(shuffling.stage).toBe("shuffling");
    expect(random).not.toHaveBeenCalled();

    completeShuffling(shuffling, random);
    expect(random).toHaveBeenCalled();
  });

  it.each(SPREADS)("draws exactly one unique card per position in $name", (selectedSpread) => {
    const state = completeShuffling(
      beginShuffling(createRitualState("Una pregunta reflexiva.", selectedSpread)),
      () => 0.42,
    );
    if (state.stage !== "revealing") {
      throw new Error("Se esperaba un estado de revelación.");
    }

    const { reading } = state;
    expect(reading.drawnCards).toHaveLength(selectedSpread.positions.length);
    expect(reading.drawnCards.map(({ position }) => position)).toEqual(
      selectedSpread.positions.map(({ id }) => id),
    );
    expect(new Set(reading.drawnCards.map(({ position }) => position)).size).toBe(
      selectedSpread.positions.length,
    );
    expect(new Set(reading.drawnCards.map(({ arcanaId }) => arcanaId)).size).toBe(
      selectedSpread.positions.length,
    );
  });

  it("reveals one card at a time in spread-position order without changing the draw", () => {
    const initial = reachRevealing();
    if (initial.stage !== "revealing") {
      throw new Error("Se esperaba un estado de revelación.");
    }
    const originalDraw = [...initial.reading.drawnCards];
    let state: ExperienceState = initial;

    for (const position of spread.positions) {
      if (state.stage !== "revealing") {
        throw new Error("La secuencia terminó antes de revelar todas las cartas.");
      }
      expect(state.reading.drawnCards).toEqual(originalDraw);
      state = revealNextCard(state);
      expect(
        state.stage === "revealed" || state.stage === "revealing"
          ? state.revealedPositionIds
          : [],
      ).toEqual(spread.positions.slice(0, position.id).map(({ id }) => id));
    }

    expect(state.stage).toBe("revealed");
    if (state.stage === "revealed") {
      expect(state.reading.drawnCards).toEqual(originalDraw);
    }
  });

  it("enables the final view only after all cards have been revealed", () => {
    const initial = reachRevealing();
    if (initial.stage !== "revealing") {
      throw new Error("Se esperaba un estado de revelación.");
    }
    expect(() => openReadingSummary(initial)).toThrow("todas las cartas estén reveladas");

    let state: ExperienceState = initial;
    for (let index = 0; index < spread.cardCount; index += 1) {
      state = revealNextCard(state);
    }
    expect(state.stage).toBe("revealed");
    expect(openReadingSummary(state).stage).toBe("summary");
  });

  it("produces the same draw for different questions with the same random source", () => {
    const first = reachRevealing("¿Qué quiero comprender sobre mi trabajo?");
    const second = reachRevealing("¿Qué necesito contemplar en una relación?");

    if (first.stage !== "revealing" || second.stage !== "revealing") {
      throw new Error("Se esperaba un estado de revelación.");
    }

    expect(first.reading.drawnCards).toEqual(second.reading.drawnCards);
    expect(first.reading.question).not.toBe(second.reading.question);
  });

  it("creates a fresh ritual from the summary without drawing until a new explicit start", () => {
    const initial = reachRevealing();
    if (initial.stage !== "revealing") {
      throw new Error("Se esperaba un estado de revelación.");
    }

    let state: ExperienceState = initial;
    for (let index = 0; index < spread.cardCount; index += 1) {
      state = revealNextCard(state);
    }

    const summary = openReadingSummary(state);
    const random = vi.fn(() => 0.5);
    const ritual = prepareAnotherDraw(summary);

    expect(ritual.stage).toBe("ritual");
    expect(random).not.toHaveBeenCalled();
  });

  it("returns from the summary to the same fully revealed draw without drawing again", () => {
    const initial = reachRevealing();
    if (initial.stage !== "revealing") {
      throw new Error("Se esperaba un estado de revelación.");
    }
    const originalDraw = initial.reading.drawnCards;
    let state: ExperienceState = initial;

    for (let index = 0; index < spread.cardCount; index += 1) {
      state = revealNextCard(state);
    }

    const summary = openReadingSummary(state);
    const returned = returnToRevealed(summary);
    const random = vi.fn(() => 0.5);

    expect(returned.stage).toBe("revealed");
    if (returned.stage !== "revealed") {
      throw new Error("Se esperaba volver a la tirada revelada.");
    }
    expect(returned.reading.drawnCards).toBe(originalDraw);
    expect(returned.revealedPositionIds).toEqual(spread.positions.map(({ id }) => id));
    expect(random).not.toHaveBeenCalled();
  });
});
