import { describe, expect, it } from "vitest";
import { ARCANA } from "../data/arcana/arcana";
import { GALLERY_CHECKLIST, GALLERY_STAGES, getGalleryArcana } from "./arcanaGalleryModel";

describe("art review gallery model", () => {
  it("offers all 22 Major Arcana in ascending order", () => {
    expect(getGalleryArcana("all")).toHaveLength(22);
    expect(getGalleryArcana("all").map(({ number }) => number)).toEqual(
      Array.from({ length: 22 }, (_, number) => number),
    );
  });

  it("groups the deck into the four documented journey stages", () => {
    expect(GALLERY_STAGES.slice(1).map(({ id, start, end }) => {
      const cards = getGalleryArcana(id);
      return [cards.length, cards[0]?.number, cards.at(-1)?.number, start, end];
    })).toEqual([
      [6, 0, 5, 0, 5],
      [5, 6, 10, 6, 10],
      [6, 11, 16, 11, 16],
      [5, 17, 21, 17, 21],
    ]);
  });

  it("keeps the human checklist descriptive and local to the gallery", () => {
    expect(GALLERY_CHECKLIST).toHaveLength(9);
    expect(ARCANA).toHaveLength(22);
  });
});
