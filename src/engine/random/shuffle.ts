export type RandomSource = () => number;

export function shuffleArcana<T>(
  cardIds: readonly T[],
  random: RandomSource = Math.random,
): T[] {
  const shuffled = [...cardIds];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
      throw new RangeError("La fuente aleatoria debe devolver un valor entre 0 (incluido) y 1 (excluido).");
    }

    const swapIndex = Math.floor(sample * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}
