import { Animal } from "../../../src/domain/entities/Animal";
import { Position } from "../../../src/shared/types/Position";
import { Calculations } from "../../../src/systems/systems_functions/Calculations";
import { AnimalFactory } from "../../factories/AnimalFactory";
import { RandomlyMove } from "../../../src/systems/movement/animal_movements/RandomlyMove";
import { SearchFood } from "../../../src/systems/movement/animal_movements/SearchFood";
import { SearchWater } from "../../../src/systems/movement/animal_movements/SearchWater";

describe("Calculations.distanceBetween", () => {
    it("should return 0 when both positions are the same", () => {
        const pos: Position = { x: 5, y: 5 };
        expect(Calculations.distanceBetween(pos, pos)).toBe(0);
    });

    it("should calculate horizontal distance correctly", () => {
        const pos1: Position = { x: 0, y: 0 };
        const pos2: Position = { x: 3, y: 0 };
        expect(Calculations.distanceBetween(pos1, pos2)).toBe(3);
    });

    it("should calculate vertical distance correctly", () => {
        const pos1: Position = { x: 0, y: 0 };
        const pos2: Position = { x: 0, y: 4 };
        expect(Calculations.distanceBetween(pos1, pos2)).toBe(4);
    });

    it("should calculate diagonal distance using ceil of euclidean distance", () => {
        const pos1: Position = { x: 0, y: 0 };
        const pos2: Position = { x: 3, y: 4 };
        expect(Calculations.distanceBetween(pos1, pos2)).toBe(5);
    });

    it("should round up (ceil) the distance", () => {
        const pos1: Position = { x: 0, y: 0 };
        const pos2: Position = { x: 1, y: 1 };
        const sqrt2 = Math.ceil(Math.SQRT2);
        expect(Calculations.distanceBetween(pos1, pos2)).toBe(sqrt2);
    });
});

describe("Calculations.utilityScore", () => {
    it("should return 0 for a strategy not in the stat map", () => {
        const animal = AnimalFactory.createGeneric();
        const unknownStrategy = new RandomlyMove();

        const score = Calculations.utilityScore(animal, unknownStrategy);

        expect(score).toBe(0);
    });

    it("should compute utility score using numeric ST value", () => {
        const animal = AnimalFactory.createGeneric({
            hunger: 10,
        } as any);
        const strategy = new SearchFood();

        const score = Calculations.utilityScore(animal, strategy);

        expect(score).toBeGreaterThan(0);
    });

    it("should compute higher score for more urgent numeric ST", () => {
        const animalUrgent = AnimalFactory.createGeneric({ hunger: 5 } as any);
        const animalNotUrgent = AnimalFactory.createGeneric({ hunger: 50 } as any);
        const strategy = new SearchFood();

        const urgentScore = Calculations.utilityScore(animalUrgent, strategy);
        const notUrgentScore = Calculations.utilityScore(animalNotUrgent, strategy);

        expect(urgentScore).toBeGreaterThan(notUrgentScore);
    });

    it("should compute utility score using object ST { current, max }", () => {
        const animal = AnimalFactory.createGeneric({
            thirst: { current: 10, max: 50 },
        } as any);
        const strategy = new SearchWater();

        const score = Calculations.utilityScore(animal, strategy);

        expect(score).toBeGreaterThan(0);
    });

    it("should compute higher score for more depleted object ST", () => {
        const animalThirsty = AnimalFactory.createGeneric({
            thirst: { current: 10, max: 50 },
        } as any);
        const animalHydrated = AnimalFactory.createGeneric({
            thirst: { current: 45, max: 50 },
        } as any);
        const strategy = new SearchWater();

        const thirstyScore = Calculations.utilityScore(animalThirsty, strategy);
        const hydratedScore = Calculations.utilityScore(animalHydrated, strategy);

        expect(thirstyScore).toBeGreaterThan(hydratedScore);
    });

    it("should return 0 when st.max is 0 for object ST", () => {
        const animal = AnimalFactory.createGeneric({
            hunger: { current: 0, max: 0 },
        } as any);
        const strategy = new SearchFood();

        const score = Calculations.utilityScore(animal, strategy);

        expect(score).toBe(0);
    });
});
