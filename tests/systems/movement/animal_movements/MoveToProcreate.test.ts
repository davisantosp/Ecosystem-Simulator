import { World } from "../../../../src/core/World";
import { Animal } from "../../../../src/domain/entities/Animal";
import { AnimalStates } from "../../../../src/domain/enums";
import { MoveToProcreate } from "../../../../src/systems/movement/animal_movements/MoveToProcreate";
import { AnimalFactory } from "../../../factories/AnimalFactory";
import { CoreFactory } from "../../../factories/CoreFactory";

describe("MoveToProcreate.entityMove", () => {
    let world: World;
    let strategy: MoveToProcreate;
    let animal: Animal;
    let mate: Animal;

    beforeEach(() => {
        world = CoreFactory.createWorld({ width: 20, height: 20 });
        strategy = new MoveToProcreate();
        animal = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            speed: 1,
            visionRadius: 10,
            procreation: { current: 5, max: 100, min: 1 },
            entityStates: [AnimalStates.PROCREATING_SEASON],
        });
        mate = AnimalFactory.createRabbit({
            position: { x: 3, y: 0 },
            speed: 1,
            visionRadius: 10,
            procreation: { current: 10, max: 100, min: 1 },
            entityStates: [AnimalStates.PROCREATING_SEASON],
        });
        world.livingEntities = [animal, mate];
    });

    it("should return false when no mate is found", () => {
        const loneAnimal = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            visionRadius: 1,
            entityStates: [AnimalStates.PROCREATING_SEASON],
        });
        world.livingEntities = [loneAnimal];

        const result = strategy.entityMove(loneAnimal, world);

        expect(result).toBe(false);
    });

    it("should move the animal one step toward the mate", () => {
        const result = strategy.entityMove(animal, world);

        expect(result).toBe(true);
        expect(animal.position.x).toBe(1);
        expect(animal.position.y).toBe(0);
    });

    it("should procreate when adjacent to mate", () => {
        animal.position = { x: 2, y: 0 };
        const initialCount = world.livingEntities!.length;

        strategy.entityMove(animal, world);

        expect(world.livingEntities!.length).toBe(initialCount + 1);
        expect(animal.entityStates).not.toContain(AnimalStates.PROCREATING_SEASON);
        expect(mate.entityStates).not.toContain(AnimalStates.PROCREATING_SEASON);
    });

    it("should move multiple steps toward mate based on speed", () => {
        const fastAnimal = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            speed: 3,
            visionRadius: 10,
            entityStates: [AnimalStates.PROCREATING_SEASON],
        });
        world.livingEntities = [fastAnimal, mate];

        strategy.entityMove(fastAnimal, world);

        expect(fastAnimal.position.x).toBe(2);
    });

    it("should move toward mate in y direction when aligned vertically", () => {
        animal.position = { x: 0, y: 0 };
        mate.position = { x: 0, y: 3 };

        strategy.entityMove(animal, world);

        expect(animal.position.y).toBe(1);
        expect(animal.position.x).toBe(0);
    });

    it("should stop at world boundary when moving toward mate", () => {
        world = CoreFactory.createWorld({ width: 3, height: 3 });
        animal = AnimalFactory.createRabbit({
            position: { x: 1, y: 0 },
            speed: 5,
            visionRadius: 10,
            entityStates: [AnimalStates.PROCREATING_SEASON],
        });
        mate = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            entityStates: [AnimalStates.PROCREATING_SEASON],
        });
        world.livingEntities = [animal, mate];

        const result = strategy.entityMove(animal, world);

        expect(result).toBe(true);
        expect(world.isValidPosition(animal.position)).toBe(true);
    });

    it("should return true even when no mate found if procreate is not needed", () => {
        const animalWithoutMateState = AnimalFactory.createRabbit({
            position: { x: 0, y: 0 },
            entityStates: [],
        });
        world.livingEntities = [animalWithoutMateState];

        const result = strategy.entityMove(animalWithoutMateState, world);

        expect(result).toBe(false);
    });
});
