import { World } from "../../../src/core/World";
import { Animal } from "../../../src/domain/entities/Animal";
import { LivingEntitiesTypes } from "../../../src/domain/enums/entities_enums/LivingEntitiesTypes";
import { AnimalStates } from "../../../src/domain/enums/states_enums/AnimalStates";
import { PlantStates } from "../../../src/domain/enums/states_enums/PlantStates";
import { VisionSystem } from "../../../src/systems/vision/VisionSystem";
import { AnimalFactory } from "../../factories/AnimalFactory";
import { PlantFactory } from "../../factories/PlantFactory";
import { CoreFactory } from "../../factories/CoreFactory";

describe("VisionSystem.searchForTarget", () => {
    let world: World;

    beforeEach(() => {
        world = CoreFactory.createWorld({ width: 50, height: 50 }, true);
    });

    it("should find the closest entity of the target type within vision range", () => {
        const animal = AnimalFactory.createWolf({
            position: { x: 0, y: 0 },
            visionRadius: 20,
        });

        const target = VisionSystem.searchForTarget(animal, world, LivingEntitiesTypes.ANIMAL);

        expect(target).not.toBeNull();
        expect(target!.id).not.toEqual(animal.id);
    });

    it("should return null when no entities match the target type", () => {
        const animal = AnimalFactory.createWolf({
            position: { x: 25, y: 25 },
            visionRadius: 50,
        });

        const target = VisionSystem.searchForTarget(animal, world, 999 as LivingEntitiesTypes);

        expect(target).toBeNull();
    });

    it("should return null when world has no living entities", () => {
        const emptyWorld = CoreFactory.createWorld({ width: 10, height: 10, livingEntities: [] });
        const animal = AnimalFactory.createWolf({ position: { x: 5, y: 5 }, visionRadius: 10 });

        const target = VisionSystem.searchForTarget(animal, emptyWorld, LivingEntitiesTypes.PLANT);

        expect(target).toBeNull();
    });

    it("should return the closest entity when multiple targets are within range", () => {
        world.livingEntities = [
            AnimalFactory.createRabbit({ position: { x: 3, y: 0 } }),
            AnimalFactory.createRabbit({ position: { x: 7, y: 0 } }),
            AnimalFactory.createRabbit({ position: { x: 1, y: 0 } }),
        ];
        const animal = AnimalFactory.createWolf({
            position: { x: 0, y: 0 },
            visionRadius: 10,
        });

        const target = VisionSystem.searchForTarget(animal, world, LivingEntitiesTypes.ANIMAL);

        expect(target).not.toBeNull();
        expect(target!.position.x).toBe(1);
        expect(target!.position.y).toBe(0);
    });

    it("should return null when all entities are out of vision range", () => {
        world.livingEntities = [
            AnimalFactory.createRabbit({ position: { x: 100, y: 100 } }),
            PlantFactory.createCommonPlant({ position: { x: 200, y: 200 } }),
        ];
        const animal = AnimalFactory.createWolf({
            position: { x: 0, y: 0 },
            visionRadius: 5,
        });

        const target = VisionSystem.searchForTarget(animal, world, LivingEntitiesTypes.ANIMAL);

        expect(target).toBeNull();
    });

    it("should accept an array of target types", () => {
        world.livingEntities = [
            PlantFactory.createCommonPlant({ position: { x: 3, y: 0 } }),
        ];
        const animal = AnimalFactory.createWolf({
            position: { x: 0, y: 0 },
            visionRadius: 10,
        });

        const target = VisionSystem.searchForTarget(
            animal,
            world,
            [LivingEntitiesTypes.ANIMAL, LivingEntitiesTypes.PLANT]
        );

        expect(target).not.toBeNull();
    });

    it("should not return the searching animal itself", () => {
        world.livingEntities = [
            AnimalFactory.createRabbit({ position: { x: 2, y: 0 } }),
        ];
        const animal = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            visionRadius: 10,
        });

        const target = VisionSystem.searchForTarget(animal, world, LivingEntitiesTypes.ANIMAL);

        expect(target).not.toBeNull();
        expect(target!.id).not.toEqual(animal.id);
    });

    it("should return null when livingEntities is undefined", () => {
        const worldWithoutEntities = CoreFactory.createWorld({ width: 10, height: 10 });
        (worldWithoutEntities as any).livingEntities = undefined;
        const animal = AnimalFactory.createWolf({ position: { x: 0, y: 0 }, visionRadius: 10 });

        const target = VisionSystem.searchForTarget(animal, worldWithoutEntities, LivingEntitiesTypes.ANIMAL);

        expect(target).toBeNull();
    });

    it("should ignore dead animals when searching", () => {
        world.livingEntities = [
            AnimalFactory.createRabbit({ position: { x: 3, y: 0 }, entityStates: [AnimalStates.DEAD] }),
            AnimalFactory.createRabbit({ position: { x: 6, y: 0 } }),
        ];
        const animal = AnimalFactory.createWolf({
            position: { x: 0, y: 0 },
            visionRadius: 10,
        });

        const target = VisionSystem.searchForTarget(animal, world, LivingEntitiesTypes.ANIMAL);

        expect(target).not.toBeNull();
        expect(target!.position.x).toBe(6);
    });

    it("should ignore withered plants when searching", () => {
        world.livingEntities = [
            PlantFactory.createCommonPlant({ position: { x: 2, y: 0 }, entityStates: [PlantStates.WITHERED] }),
            PlantFactory.createCommonPlant({ position: { x: 5, y: 0 } }),
        ];
        const animal = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            visionRadius: 10,
        });

        const target = VisionSystem.searchForTarget(animal, world, LivingEntitiesTypes.PLANT);

        expect(target).not.toBeNull();
        expect(target!.position.x).toBe(5);
    });
});

describe("VisionSystem.searchForWater", () => {
    let world: World;

    beforeEach(() => {
        world = CoreFactory.createWorld({ width: 50, height: 50 });
    });

    it("should return null when no water sources exist", () => {
        const animal = AnimalFactory.createRabbit({ position: { x: 0, y: 0 }, visionRadius: 10 });

        const result = VisionSystem.searchForWater(animal, world);

        expect(result).toBeNull();
    });

    it("should return the closest water source within vision range", () => {
        const animal = AnimalFactory.createRabbit({ position: { x: 0, y: 0 }, visionRadius: 20 });
        world.waterSources = [{ x: 10, y: 0 }, { x: 3, y: 0 }];

        const result = VisionSystem.searchForWater(animal, world);

        expect(result).toEqual({ x: 3, y: 0 });
    });

    it("should return null when all water sources are out of vision range", () => {
        const animal = AnimalFactory.createRabbit({ position: { x: 0, y: 0 }, visionRadius: 5 });
        world.waterSources = [{ x: 100, y: 100 }];

        const result = VisionSystem.searchForWater(animal, world);

        expect(result).toBeNull();
    });

    it("should return a water source even if it's the only one", () => {
        const animal = AnimalFactory.createRabbit({ position: { x: 0, y: 0 }, visionRadius: 10 });
        world.waterSources = [{ x: 5, y: 5 }];

        const result = VisionSystem.searchForWater(animal, world);

        expect(result).toEqual({ x: 5, y: 5 });
    });
});
