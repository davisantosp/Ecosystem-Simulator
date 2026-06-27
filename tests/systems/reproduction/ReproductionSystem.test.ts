import { World } from "../../../src/core/World";
import { Animal } from "../../../src/domain/entities/Animal";
import { AnimalSpecies, AnimalStates } from "../../../src/domain/enums";
import { ReproductionSystem } from "../../../src/systems/reproduction/ReproductionSystem";
import { AnimalFactory } from "../../factories/AnimalFactory";
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
        }).toThrow("World has no entity list to register offspring");
    });
});
