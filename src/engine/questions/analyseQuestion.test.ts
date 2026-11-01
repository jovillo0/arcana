import { describe, expect, it } from "vitest";
import { analyseQuestion } from "./analyseQuestion";

describe("analyseQuestion", () => {
  it.each([
    ["¿Qué debería considerar para elegir entre estas dos opciones?", "decision"],
    ["¿Qué me está impidiendo avanzar?", "blockage"],
    ["Estoy comenzando un nuevo proyecto y quiero comprender su desarrollo.", "project"],
    ["Estoy atravesando un cambio importante y quiero comprender esta transición.", "transformation"],
    ["¿Qué patrón mío debería observar?", "selfKnowledge"],
    ["Quiero comprender las fuerzas que intervienen en esta situación tan compleja.", "open"],
    ["¿Qué debería contemplar sobre mi situación actual?", "general"],
  ] as const)("classifies the consultation: %s", (question, expectedIntent) => {
    const analysis = analyseQuestion(question);

    expect(analysis.consultationType).toBe(expectedIntent);
    expect(analysis.explanation.length).toBeGreaterThan(0);
    expect(analysis.confidence).toBeGreaterThanOrEqual(0);
    expect(analysis.confidence).toBeLessThanOrEqual(1);
  });

  it("captures multiple signals for a consultation with several intentions", () => {
    const analysis = analyseQuestion(
      "Estoy bloqueado con un proyecto y no sé si debería continuarlo o abandonarlo.",
    );

    expect(analysis.consultationType).toBe("decision");
    expect(analysis.secondaryTypes).toEqual(
      expect.arrayContaining(["blockage", "project"]),
    );
    expect(analysis.signals.length).toBeGreaterThanOrEqual(3);
    expect(analysis.confidence).toBeGreaterThanOrEqual(0);
    expect(analysis.confidence).toBeLessThanOrEqual(1);
  });

  it("uses general orientation and low confidence for an empty question", () => {
    const analysis = analyseQuestion("   ");

    expect(analysis.consultationType).toBe("general");
    expect(analysis.signals).toEqual([]);
    expect(analysis.confidence).toBe(0.35);
  });
});
