import { describe, expect, it } from "vitest";
import { SPREADS } from "./spreads";

describe("spread catalog", () => {
  it("contains exactly the nine documented spreads with unique ids", () => {
    expect(SPREADS.map(({ id }) => id)).toEqual([
      "la-semilla",
      "el-espejo",
      "la-encrucijada",
      "el-umbral",
      "el-nudo",
      "el-sendero",
      "los-dos-rostros",
      "la-rosa",
      "el-circulo",
    ]);
    expect(new Set(SPREADS.map(({ id }) => id)).size).toBe(9);
  });

  it("has a unique position and a layout entry for every card in each spread", () => {
    for (const spread of SPREADS) {
      const positionIds = spread.positions.map(({ id }) => id);
      const layoutIds = spread.layout.map(({ positionId }) => positionId);

      expect(spread.positions).toHaveLength(spread.cardCount);
      expect(new Set(positionIds).size).toBe(spread.cardCount);
      expect(layoutIds).toHaveLength(spread.cardCount);
      expect(new Set(layoutIds).size).toBe(spread.cardCount);
      expect([...layoutIds].sort((a, b) => a - b)).toEqual(
        [...positionIds].sort((a, b) => a - b),
      );
      expect(spread.purpose).toBeTruthy();
      expect(spread.interpretivePath).toBeTruthy();
      expect(spread.relationships.length).toBeGreaterThan(0);
    }
  });
});
