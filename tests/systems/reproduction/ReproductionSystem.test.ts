import { World } from "../../../src/core/World";
import { Animal } from "../../../src/domain/entities/Animal";
import { Plant } from "../../../src/domain/entities/Plant";
import { AnimalSpecies, AnimalStates, PlantStates } from "../../../src/domain/enums";
import { ReproductionSystem } from "../../../src/systems/reproduction/ReproductionSystem";
import { AnimalFactory } from "../../factories/AnimalFactory";
import { PlantFactory } from "../../factories/PlantFactory";
import { CoreFactory } from "../../factories/CoreFactory";

describe("ReproductionSystem.procreate", () => {
    let world: World;
    let animal1: Animal;
    let animal2: Animal;

    beforeEach(() => {
        world = CoreFactory.createWorld({ width: 20, height: 20 });
        animal1 = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            procreation: { current: 5, max: 100, min: 1 },
            entityStates: [AnimalStates.PROCREATING_SEASON],
        });
        animal2 = AnimalFactory.createRabbit({
            position: { x: 0, y: 1 },
            procreation: { current: 10, max: 100, min: 1 },
            entityStates: [AnimalStates.PROCREATING_SEASON],
        });
    });

    it("should create an offspring and add it to the world", () => {
        const initialCount = world.livingEntities!.length;

        ReproductionSystem.procreate(animal1, animal2, world);

        expect(world.livingEntities!.length).toBe(initialCount + 1);
    });

    it("should reset both parents procreation to max", () => {
        ReproductionSystem.procreate(animal1, animal2, world);

        expect(animal1.procreation.current).toBe(100);
        expect(animal2.procreation.current).toBe(100);
    });

    it("should remove PROCREATING_SEASON state from both parents", () => {
        ReproductionSystem.procreate(animal1, animal2, world);

        expect(animal1.entityStates).not.toContain(AnimalStates.PROCREATING_SEASON);
        expect(animal2.entityStates).not.toContain(AnimalStates.PROCREATING_SEASON);
    });

    it("should set offspring diet to match the first parent", () => {
        ReproductionSystem.procreate(animal1, animal2, world);

        const offspring = world.livingEntities![world.livingEntities!.length - 1] as Animal;
        expect(offspring.diet.type).toBe(animal1.diet.type);
    });

    it("should inherit characteristics from both parents (averaged stats)", () => {
        jest.spyOn(Math, "random").mockReturnValue(0.99);
        const a1 = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            procreation: { current: 5, max: 100, min: 1 },
            entityStates: [AnimalStates.PROCREATING_SEASON],
            lifespan: { current: 100, max: 100 },
            hunger: { current: 50, max: 50 },
            thirst: { current: 50, max: 50 },
            speed: 2,
            visionRadius: 4,
        });
        const a2 = AnimalFactory.createWolf({
            position: { x: 0, y: 1 },
            procreation: { current: 10, max: 100, min: 1 },
            entityStates: [AnimalStates.PROCREATING_SEASON],
            lifespan: { current: 200, max: 200 },
            hunger: { current: 100, max: 100 },
            thirst: { current: 100, max: 100 },
            speed: 10,
            visionRadius: 15,
        });
        world.livingEntities = [a1, a2];

        ReproductionSystem.procreate(a1, a2, world);
        jest.restoreAllMocks();

        const offspring = world.livingEntities![world.livingEntities!.length - 1] as Animal;
        expect(offspring.lifespan.max).toBe(150);
        expect(offspring.hunger.max).toBe(75);
        expect(offspring.thirst.max).toBe(75);
        expect(offspring.speed).toBe(6);
        expect(offspring.visionRadius).toBe(10);
    });

    it("should set offspring genes array by inheriting from parents", () => {
        const a1 = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            procreation: { current: 5, max: 100, min: 1 },
            entityStates: [AnimalStates.PROCREATING_SEASON],
            genes: [{ geneType: 1, value: 5 }],
        });
        const a2 = AnimalFactory.createRabbit({
            position: { x: 0, y: 1 },
            procreation: { current: 10, max: 100, min: 1 },
            entityStates: [AnimalStates.PROCREATING_SEASON],
            genes: [{ geneType: 2, value: 8 }],
        });
        world.livingEntities = [a1, a2];
        jest.spyOn(Math, "random").mockReturnValue(0);
        ReproductionSystem.procreate(a1, a2, world);
        jest.restoreAllMocks();

        const offspring = world.livingEntities![world.livingEntities!.length - 1] as Animal;
        expect(offspring.genes.length).toBeGreaterThan(0);
    });

    it("should throw when first animal is null", () => {
        expect(() => {
            ReproductionSystem.procreate(null as any, animal2, world);
        }).toThrow("Not enough animals to reproduce");
    });

    it("should throw when second animal is null", () => {
        expect(() => {
            ReproductionSystem.procreate(animal1, null as any, world);
        }).toThrow("Not enough animals to reproduce");
    });

    it("should place offspring at a valid position adjacent to parents", () => {
        animal1.position = { x: 5, y: 5 };
        animal2.position = { x: 5, y: 6 };
        world = CoreFactory.createWorld({ width: 10, height: 10, livingEntities: [animal1, animal2] });

        ReproductionSystem.procreate(animal1, animal2, world);

        const offspring = world.livingEntities![world.livingEntities!.length - 1] as Animal;
        const isAdjacent =
            (Math.abs(offspring.position.x - 5) === 1 && offspring.position.y === 5) ||
            (Math.abs(offspring.position.y - 5) === 1 && offspring.position.x === 5) ||
            (Math.abs(offspring.position.x - 6) === 1 && offspring.position.y === 6) ||
            (Math.abs(offspring.position.y - 6) === 1 && offspring.position.x === 6);
        expect(isAdjacent).toBe(true);
    });

    it("should fall back to parent position when no adjacent position is valid", () => {
        world = CoreFactory.createWorld({ width: 1, height: 1 });
        world.livingEntities = [];
        const a1 = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            procreation: { current: 5, max: 100, min: 1 },
            entityStates: [AnimalStates.PROCREATING_SEASON],
        });
        const a2 = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            procreation: { current: 10, max: 100, min: 1 },
            entityStates: [AnimalStates.PROCREATING_SEASON],
        });
        world.livingEntities!.push(a1, a2);

        ReproductionSystem.procreate(a1, a2, world);

        const offspring = world.livingEntities![world.livingEntities!.length - 1] as Animal;
        expect(offspring.position).toEqual({ x: 0, y: 0 });
    });

    it("should throw when world has no livingEntities list", () => {
        (world as any).livingEntities = null;

        expect(() => {
            ReproductionSystem.procreate(animal1, animal2, world);
        }).toThrow("World has no entity list to register entity");
    });
});

describe("ReproductionSystem.canSpread", () => {
    let plant: Plant;

    beforeEach(() => {
        plant = PlantFactory.createCommonPlant({
            position: { x: 5, y: 5 },
            entityStates: [PlantStates.SEED],
        });
    });

    it("should return true when plant is MATURE and random is below SPREAD_CHANCE", () => {
        jest.spyOn(Math, "random").mockReturnValue(0.01);
        plant.updateState([PlantStates.MATURE]);
        expect(ReproductionSystem.canSpread(plant)).toBe(true);
        jest.restoreAllMocks();
    });

    it("should return false when random is above SPREAD_CHANCE", () => {
        jest.spyOn(Math, "random").mockReturnValue(0.99);
        plant.updateState([PlantStates.MATURE]);
        expect(ReproductionSystem.canSpread(plant)).toBe(false);
        jest.restoreAllMocks();
    });

    it("should return false when plant is not MATURE", () => {
        expect(ReproductionSystem.canSpread(plant)).toBe(false);
    });

    it("should return false when plant is WITHERED", () => {
        plant.updateState([PlantStates.WITHERED]);
        expect(ReproductionSystem.canSpread(plant)).toBe(false);
    });
});

describe("ReproductionSystem.propagatePlant", () => {
    let world: World;
    let plant: Plant;

    beforeEach(() => {
        world = CoreFactory.createWorld({ width: 10, height: 10 });
        plant = PlantFactory.createCommonPlant({
            position: { x: 5, y: 5 },
            entityStates: [PlantStates.MATURE],
        });
        world.livingEntities = [plant];
    });

    it("should create a seed at an adjacent position when spreading", () => {
        jest.spyOn(Math, "random")
            .mockReturnValueOnce(0.01)  // canSpread passes
            .mockReturnValue(0.99);     // rest: no mutations
        const initialCount = world.livingEntities!.length;

        ReproductionSystem.propagatePlant(plant, world);

        expect(world.livingEntities!.length).toBe(initialCount + 1);
        const seed = world.livingEntities![world.livingEntities!.length - 1] as Plant;
        const isAdjacent =
            (Math.abs(seed.position.x - 5) === 1 && seed.position.y === 5) ||
            (Math.abs(seed.position.y - 5) === 1 && seed.position.x === 5);
        expect(isAdjacent).toBe(true);
        jest.restoreAllMocks();
    });

    it("should not spawn when canSpread returns false", () => {
        jest.spyOn(Math, "random").mockReturnValue(0.99);
        const initialCount = world.livingEntities!.length;

        ReproductionSystem.propagatePlant(plant, world);

        expect(world.livingEntities!.length).toBe(initialCount);
        jest.restoreAllMocks();
    });

    it("should inherit characteristics from the parent plant", () => {
        jest.spyOn(Math, "random")
            .mockReturnValueOnce(0.01)  // canSpread passes
            .mockReturnValue(0.99);     // rest: no mutations
        plant.growthRate = { current: 80, max: 80 };
        plant.nutritionalValue = { current: 150, max: 150 };

        ReproductionSystem.propagatePlant(plant, world);

        const seed = world.livingEntities![world.livingEntities!.length - 1] as Plant;
        expect(seed.growthRate.max).toBe(80);
        expect(seed.nutritionalValue.max).toBe(150);
        jest.restoreAllMocks();
    });

    it("should not propagate when no adjacent cell is free", () => {
        world = CoreFactory.createWorld({ width: 1, height: 1 });
        plant = PlantFactory.createCommonPlant({
            position: { x: 0, y: 0 },
            entityStates: [PlantStates.MATURE],
        });
        world.livingEntities = [plant];

        jest.spyOn(Math, "random")
            .mockReturnValueOnce(0.01)  // canSpread passes
            .mockReturnValue(0.99);     // rest: no mutations
        ReproductionSystem.propagatePlant(plant, world);

        expect(world.livingEntities!.length).toBe(1);
        jest.restoreAllMocks();
    });
});
