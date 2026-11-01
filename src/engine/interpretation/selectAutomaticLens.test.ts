import { describe, expect, it } from "vitest";
import { analyseQuestion } from "../questions/analyseQuestion";
import { selectAutomaticLens } from "./selectAutomaticLens";

describe("selectAutomaticLens", () => {
  it.each([
    ["¿Qué debería considerar para elegir entre estas dos opciones?", "marseille"],
    ["Estoy atravesando un cambio importante y quiero comprender esta transición.", "hermetic-rosicrucian"],
    ["¿Qué me está impidiendo avanzar?", "rider-waite-smith"],
    ["¿Qué patrón mío debería observar?", "psychological-archetypal"],
    ["Estoy comenzando un nuevo proyecto y quiero comprender su desarrollo.", "intuitive-contemplative"],
    ["Quiero comprender las fuerzas que intervienen en esta situación tan compleja.", "synthesis"],
    ["¿Qué debería contemplar sobre mi situación actual?", "synthesis"],
  ] as const)("selects a perspective for: %s", (question, expectedLens) => {
    expect(selectAutomaticLens(analyseQuestion(question))).toBe(expectedLens);
  });

  it("uses synthesis when competing intents leave the analysis uncertain", () => {
    const analysis = analyseQuestion("Estoy bloqueado y atravieso un cambio.");

    expect(analysis.confidence).toBeLessThan(0.55);
    expect(selectAutomaticLens(analysis)).toBe("synthesis");
  });
});