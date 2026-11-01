import { describe, expect, it } from "vitest";
import { ARCANA } from "../../data/arcana/arcana";
import { ARCANA_IDS } from "../../data/arcana/card-ids";
import { drawArcana } from "./draw";
import { shuffleArcana } from "./shuffle";

describe("shuffleArcana", () => {
  it("returns every identifier once without mutating the source", () => {
    const identifiers = ARCANA_IDS;
    const original = [...identifiers];
    const shuffled = shuffleArcana(identifiers, () => 0.5);

    expect(shuffled).toHaveLength(identifiers.length);
    expect(new Set(shuffled).size).toBe(identifiers.length);
    expect(identifiers).toEqual(original);
    expect(shuffled).not.toBe(identifiers);
  });

  it("supports a deterministic random source for predictable tests", () => {
    const shuffled = shuffleArcana(["a", "b", "c"], () => 0);

    expect(shuffled).toEqual(["b", "c", "a"]);
  });

  it("rejects random values outside the [0, 1) range", () => {
    expect(() => shuffleArcana(["a", "b"], () => 1)).toThrow(RangeError);
  });
});

describe("drawArcana", () => {
  it.each([1, 3, 5])("draws %i distinct cards with ordered positions", (count) => {
    const drawn = drawArcana(count);

    expect(drawn).toHaveLength(count);
    expect(drawn.map(({ position }) => position)).toEqual(
      Array.from({ length: count }, (_, index) => index + 1),
    );
    expect(new Set(drawn.map(({ arcanaId }) => arcanaId)).size).toBe(count);
    expect(drawn.every(({ arcanaId }) => ARCANA_IDS.includes(arcanaId))).toBe(true);
    expect(drawn.every(({ arcanaId }) => ARCANA.some((card) => card.id === arcanaId))).toBe(true);
  });

  it.each([0, -1, 1.5, 23])("rejects invalid draw counts (%i)", (count) => {
    expect(() => drawArcana(count)).toThrow(RangeError);
  });
});
