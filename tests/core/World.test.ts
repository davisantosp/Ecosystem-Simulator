import { World } from "../../src/core/World";
import { AnimalStates } from "../../src/domain/enums/states_enums/AnimalStates";
import { PlantStates } from "../../src/domain/enums/states_enums/PlantStates";
import { AnimalFactory } from "../factories/AnimalFactory";
import { PlantFactory } from "../factories/PlantFactory";

describe("World.isValidPosition", () => {
    it("should accept positions within bounds", () => {
        const world = new World(10, 10);

        expect(world.isValidPosition({ x: 0, y: 0 })).toBe(true);
        expect(world.isValidPosition({ x: 9, y: 9 })).toBe(true);
        expect(world.isValidPosition({ x: 5, y: 5 })).toBe(true);
    });

    it("should reject positions outside bounds", () => {
        const world = new World(10, 10);

        expect(world.isValidPosition({ x: -1, y: 0 })).toBe(false);
        expect(world.isValidPosition({ x: 10, y: 0 })).toBe(false);
        expect(world.isValidPosition({ x: 0, y: -1 })).toBe(false);
        expect(world.isValidPosition({ x: 0, y: 10 })).toBe(false);
    });

    it("should reject positions that are water sources", () => {
        const world = new World(10, 10, [], [{ x: 3, y: 3 }]);

        expect(world.isValidPosition({ x: 3, y: 3 })).toBe(false);
    });

    it("should accept non-water positions even with waterSources defined", () => {
        const world = new World(10, 10, [], [{ x: 3, y: 3 }]);

        expect(world.isValidPosition({ x: 5, y: 5 })).toBe(true);
    });

    it("should work when waterSources is undefined", () => {
        const world = new World(10, 10);

        expect(world.isValidPosition({ x: 5, y: 5 })).toBe(true);
    });
});

describe("World.deleteDeadEntities", () => {
    it("should remove dead animals from livingEntities", () => {
        const alive = AnimalFactory.createRabbit({ entityStates: [AnimalStates.NORMAL] });
        const dead = AnimalFactory.createWolf({ entityStates: [AnimalStates.DEAD] });
        const world = new World(10, 10, [alive, dead]);

        world.deleteDeadEntities();

        expect(world.livingEntities).toContain(alive);
        expect(world.livingEntities).not.toContain(dead);
    });

    it("should remove withered plants from livingEntities", () => {
        const alive = PlantFactory.createCommonPlant({ entityStates: [PlantStates.MATURE] });
        const withered = PlantFactory.createRarePlant({ entityStates: [PlantStates.WITHERED] });
        const world = new World(10, 10, [alive, withered]);

        world.deleteDeadEntities();

        expect(world.livingEntities).toContain(alive);
        expect(world.livingEntities).not.toContain(withered);
    });

    it("should keep non-dead entities of both types", () => {
        const animal = AnimalFactory.createRabbit({ entityStates: [AnimalStates.NORMAL] });
        const plant = PlantFactory.createCommonPlant({ entityStates: [PlantStates.MATURE] });
        const world = new World(10, 10, [animal, plant]);

        world.deleteDeadEntities();

        expect(world.livingEntities?.length).toBe(2);
    });

    it("should do nothing when livingEntities is empty", () => {
        const world = new World(10, 10, []);

        expect(() => world.deleteDeadEntities()).not.toThrow();
    });

    it("should do nothing when livingEntities is undefined", () => {
        const world = new World(10, 10);

        expect(() => world.deleteDeadEntities()).not.toThrow();
    });
});
