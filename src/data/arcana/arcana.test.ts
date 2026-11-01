import { describe, expect, it } from "vitest";
import { ARCANA } from "./arcana";
import { ARCANA_IDS } from "./card-ids";

const ALL_ARTWORK = [
  "/cards/major-00.svg",
  "/cards/major-01.svg",
  "/cards/major-02.svg",
  "/cards/major-03.svg",
  "/cards/major-04.svg",
  "/cards/major-05.svg",
  "/cards/major-06.svg",
  "/cards/major-07.svg",
  "/cards/major-08.svg",
  "/cards/major-09.svg",
  "/cards/major-10.svg",
  "/cards/major-11.svg",
  "/cards/major-12.svg",
  "/cards/major-13.svg",
  "/cards/major-14.svg",
  "/cards/major-15.svg",
  "/cards/major-16.svg",
  "/cards/major-17.svg",
  "/cards/major-18.svg",
  "/cards/major-19.svg",
  "/cards/major-20.svg",
  "/cards/major-21.svg",
];

const EXPECTED_NAMES = [
  "El Loco",
  "El Mago",
  "La Sacerdotisa",
  "La Emperatriz",
  "El Emperador",
  "El Sumo Sacerdote",
  "Los Enamorados",
  "El Carro",
  "La Justicia",
  "El Ermitaño",
  "La Rueda de la Fortuna",
  "La Fuerza",
  "El Colgado",
  "La Muerte",
  "La Templanza",
  "El Diablo",
  "La Torre",
  "La Estrella",
  "La Luna",
  "El Sol",
  "El Juicio",
  "El Mundo",
];

describe("ARCANA catalog", () => {
  it("contains the 22 traditional Major Arcana in order without duplicates", () => {
    expect(ARCANA).toHaveLength(22);
    expect(ARCANA.map(({ number }) => number)).toEqual(
      Array.from({ length: 22 }, (_, number) => number),
    );
    expect(ARCANA.map(({ name }) => name)).toEqual(EXPECTED_NAMES);
    expect(new Set(ARCANA.map(({ id }) => id)).size).toBe(22);
    expect(ARCANA.map(({ id }) => id)).toEqual(ARCANA_IDS);
  });

  it("stores every required symbolic field for every Arcana", () => {
    for (const arcana of ARCANA) {
      expect(arcana.romanNumeral).toBeTruthy();
      expect(arcana.symbolicCore).toBeTruthy();
      expect(arcana.light).toBeTruthy();
      expect(arcana.shadow).toBeTruthy();
      expect(arcana.geometry).toBeTruthy();
      expect(arcana.symbols.length).toBeGreaterThan(0);
      expect(arcana).toHaveProperty("elements");
      expect(arcana.transformativePrinciple).toBeTruthy();
      expect(arcana.initiatoryQuestion).toBeTruthy();
      expect(arcana.journeyStage).toBeTruthy();
      expect(arcana.imageRef).toMatch(/^\/cards\/major-\d{2}\.svg$/);
    }
  });

  it("assigns a distinct local illustration to every Major Arcana in order", () => {
    expect(ARCANA.map(({ imageRef }) => imageRef)).toEqual(ALL_ARTWORK);
    expect(new Set(ARCANA.map(({ imageRef }) => imageRef)).size).toBe(22);
  });

  it("assigns every Arcana to the specified journey stage", () => {
    expect(ARCANA.slice(0, 6).every(({ journeyStage }) => journeyStage === "constituirse")).toBe(true);
    expect(ARCANA.slice(6, 11).every(({ journeyStage }) => journeyStage === "entrar-en-el-mundo")).toBe(true);
    expect(ARCANA.slice(11, 17).every(({ journeyStage }) => journeyStage === "transformarse")).toBe(true);
    expect(ARCANA.slice(17).every(({ journeyStage }) => journeyStage === "reintegrarse")).toBe(true);
  });

  it("frames La Muerte as a possible transformation rather than a necessary outcome", () => {
    const death = ARCANA.find(({ id }) => id === "major-13");

    expect(death?.symbolicCore).toContain("puede");
    expect(death?.symbolicCore).not.toContain("necesario");
  });
});
