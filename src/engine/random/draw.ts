import { ARCANA_IDS } from "../../data/arcana/card-ids";
import type { DrawnCard } from "../../types/domain";
import { shuffleArcana, type RandomSource } from "./shuffle";

export function drawArcana(
  count: number,
  random: RandomSource = Math.random,
): DrawnCard[] {
  if (!Number.isInteger(count) || count < 1 || count > ARCANA_IDS.length) {
    throw new RangeError(`La cantidad debe ser un entero entre 1 y ${ARCANA_IDS.length}.`);
  }

  return shuffleArcana(ARCANA_IDS, random)
    .slice(0, count)
    .map((arcanaId, index) => ({ position: index + 1, arcanaId }));
}
