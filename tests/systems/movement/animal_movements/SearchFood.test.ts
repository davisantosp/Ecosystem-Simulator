import { World } from "../../../../src/core/World";
import { Animal } from "../../../../src/domain/entities/Animal";
import { Plant } from "../../../../src/domain/entities/Plant";
import { PlantStates, DietTypes } from "../../../../src/domain/enums";
import { SearchFood } from "../../../../src/systems/movement/animal_movements/SearchFood";
import { AnimalFactory } from "../../../factories/AnimalFactory";
import { PlantFactory } from "../../../factories/PlantFactory";
import { CoreFactory } from "../../../factories/CoreFactory";

describe("SearchFood.entityMove", () => {
    let world: World;
    let strategy: SearchFood;

    beforeEach(() => {
        world = CoreFactory.createWorld({ width: 20, height: 20 });
        strategy = new SearchFood();
    });

    it("should move the animal one step toward the plant", () => {
        const animal = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            speed: 1,
        });
        const plant = PlantFactory.createCommonPlant({ position: { x: 3, y: 0 } });
        world.livingEntities = [plant];

        const result = strategy.entityMove(animal, world);

        expect(result).toBe(true);
        expect(animal.position.x).toBe(1);
        expect(animal.position.y).toBe(0);
    });

    it("should eat the plant when reaching it", () => {
        const animal = AnimalFactory.createRabbit({
            position: { x: 2, y: 0 },
            speed: 1,
            hunger: { current: 10, max: 100 },
        });
        const plant = PlantFactory.createCommonPlant({
            position: { x: 3, y: 0 },
            entityStates: [],
            nutritionalValue: { current: 30, max: 100 },
        });
        world.livingEntities = [plant];

        strategy.entityMove(animal, world);

        expect(animal.hunger.current).toBeGreaterThan(10);
        expect(plant.entityStates).toContain(PlantStates.WITHERED);
    });

    it("should return false when no food target is found", () => {
        const animal = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            speed: 1,
        });
        world.livingEntities = [];

        const result = strategy.entityMove(animal, world);

        expect(result).toBe(false);
    });

    it("should move multiple steps toward the target based on speed", () => {
        const animal = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            speed: 3,
            visionRadius: 10,
        });
        const plant = PlantFactory.createCommonPlant({ position: { x: 5, y: 0 } });
        world.livingEntities = [plant];

        strategy.entityMove(animal, world);

        expect(animal.position.x).toBe(3);
    });

    it("should route around water to reach food", () => {
        const animal = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            speed: 4,
            visionRadius: 10,
        });
        const plant = PlantFactory.createCommonPlant({ position: { x: 2, y: 0 } });
        world = CoreFactory.createWorld({ width: 5, height: 5 });
        world.livingEntities = [plant];
        world.waterSources = [{ x: 1, y: 0 }];

        const result = strategy.entityMove(animal, world);

        expect(result).toBe(true);
        expect(animal.position.x).toBe(2);
        expect(animal.position.y).toBe(0);
        expect(plant.entityStates).toContain(PlantStates.WITHERED);
    });

    it("should stop at world boundary", () => {
        const animal = AnimalFactory.createRabbit({
            position: { x: 1, y: 0 },
            speed: 5,
            visionRadius: 10,
        });
        const plant = PlantFactory.createCommonPlant({ position: { x: 0, y: 0 } });
        world = CoreFactory.createWorld({ width: 5, height: 5 });
        world.livingEntities = [plant];

        const result = strategy.entityMove(animal, world);

        expect(result).toBe(true);
        expect(world.isValidPosition(animal.position)).toBe(true);
    });
});
