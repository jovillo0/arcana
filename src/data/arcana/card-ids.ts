export const ARCANA_IDS: readonly string[] = Object.freeze(
  Array.from({ length: 22 }, (_, number) => `major-${String(number).padStart(2, "0")}`),
);
