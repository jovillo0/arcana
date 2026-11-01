import { describe, expect, it } from "vitest";
import { SPREADS } from "../../data/spreads/spreads";
import { analyseQuestion } from "../questions/analyseQuestion";
import { selectSpread } from "./selectSpread";

describe("selectSpread", () => {
  it.each([
    ["decision", "¿Qué debería considerar para elegir entre estas dos opciones?", "la-encrucijada", "comparas opciones"],
    ["transformation", "Estoy atravesando un cambio importante y quiero comprender esta transición.", "el-umbral", "estás atravesando un cambio"],
    ["blockage", "¿Qué me está impidiendo avanzar?", "el-nudo", "algo te está frenando"],
    ["selfKnowledge", "¿Qué patrón mío debería observar?", "el-espejo", "quieres observar un patrón propio"],
    ["project", "Estoy comenzando un nuevo proyecto y quiero comprender su desarrollo.", "el-sendero", "estás pensando en un proyecto"],
    ["open", "Quiero comprender las fuerzas que intervienen en esta situación tan compleja.", "el-circulo", "tu situación reúne varios factores"],
    ["general", "¿Qué debería contemplar sobre mi situación actual?", "la-semilla", "tu pregunta es amplia"],
  ] as const)("maps %s to an existing spread and explains the detected signal", (_intent, question, expectedSpreadId, expectedReason) => {
    const recommendation = selectSpread(analyseQuestion(question));

    expect(recommendation.spread.id).toBe(expectedSpreadId);
    expect(recommendation.explanation.toLocaleLowerCase("es"))
      .toContain(expectedReason.toLocaleLowerCase("es"));
    expect(recommendation.explanation).toContain("te ayuda a");
  });

  it("keeps all nine canonical spreads available for manual choice", () => {
    expect(SPREADS).toHaveLength(9);
    expect(SPREADS.map(({ id }) => id)).toContain("la-rosa");
    expect(SPREADS.map(({ id }) => id)).toContain("los-dos-rostros");
  });

  it("reports a missing canonical spread instead of silently choosing another", () => {
    expect(() =>
      selectSpread(analyseQuestion("¿Qué me impide avanzar?"), SPREADS.filter(({ id }) => id !== "el-nudo")),
    ).toThrow('No se encontró la tirada requerida "el-nudo"');
  });
});
