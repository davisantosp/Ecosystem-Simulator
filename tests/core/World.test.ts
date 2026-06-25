import { World } from "../../src/core/World";
import { Animal } from "../../src/domain/entities/Animal";
import { Plant } from "../../src/domain/entities/Plant";
import { AnimalStates } from "../../src/domain/enums/states_enums/AnimalStates";
import { PlantStates } from "../../src/domain/enums/states_enums/PlantStates";
import { AnimalFactory } from "../factories/AnimalFactory";
import { PlantFactory } from "../factories/PlantFactory";

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
