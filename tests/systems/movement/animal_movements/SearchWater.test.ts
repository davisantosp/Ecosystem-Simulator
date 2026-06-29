import { World } from "../../../../src/core/World";
import { SearchWater } from "../../../../src/systems/movement/animal_movements/SearchWater";
import { AnimalFactory } from "../../../factories/AnimalFactory";
import { CoreFactory } from "../../../factories/CoreFactory";

describe("SearchWater.entityMove", () => {
    let world: World;
    let strategy: SearchWater;

    beforeEach(() => {
        world = CoreFactory.createWorld({ width: 20, height: 20 });
        strategy = new SearchWater();
    });

    it("should return false when no water source exists", () => {
        const animal = AnimalFactory.createRabbit({ position: { x: 0, y: 0 } });

        const result = strategy.entityMove(animal, world);

        expect(result).toBe(false);
    });

    it("should move the animal toward the water source", () => {
        const animal = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            speed: 1,
            visionRadius: 10,
        });
        world.waterSources = [{ x: 3, y: 0 }];

        const result = strategy.entityMove(animal, world);

        expect(result).toBe(true);
        expect(animal.position.x).toBe(1);
    });

    it("should drink when adjacent to water", () => {
        const animal = AnimalFactory.createRabbit({
            position: { x: 2, y: 0 },
            speed: 3,
            visionRadius: 10,
            thirst: { current: 10, max: 100 },
        });
        world.waterSources = [{ x: 3, y: 0 }];

        strategy.entityMove(animal, world);

        expect(animal.thirst.current).toBeGreaterThan(10);
    });

    it("should move in multiple steps based on speed toward water", () => {
        const animal = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            speed: 3,
            visionRadius: 10,
        });
        world.waterSources = [{ x: 5, y: 0 }];

        strategy.entityMove(animal, world);

        expect(animal.position.x).toBe(3);
    });

    it("should stop at world boundary when moving toward water", () => {
        const animal = AnimalFactory.createRabbit({
            position: { x: 1, y: 0 },
            speed: 5,
            visionRadius: 10,
        });
        world = CoreFactory.createWorld({ width: 3, height: 3 });
        world.waterSources = [{ x: 0, y: 0 }];

        const result = strategy.entityMove(animal, world);

        expect(result).toBe(true);
        expect(world.isValidPosition(animal.position)).toBe(true);
    });
});
