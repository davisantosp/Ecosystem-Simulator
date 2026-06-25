import { World } from "../../../src/core/World";
import { Animal } from "../../../src/domain/entities/Animal";
import { AnimalStates } from "../../../src/domain/enums/states_enums/AnimalStates";
import { Position } from "../../../src/shared/types/Position";
import { MovementSystem } from "../../../src/systems/movement/MovementSystem";
import { AnimalFactory } from "../../factories/AnimalFactory";
import { CoreFactory } from "../../factories/CoreFactory";
import { PlantFactory } from "../../factories/PlantFactory";

describe("Move entity via MovementSystem", () => {
    let animal: Animal;
    let world: World;

    beforeEach(() => {
        world = CoreFactory.createWorld({ width: 10, height: 10 });
    })

    it("should move entity to a random location", () => {
        animal = AnimalFactory.createGeneric();

        const prevPosition = { ...animal.position }

        MovementSystem.moveEntity(animal, world);
        expect(animal.position).not.toEqual(prevPosition);
    })

    it("should move entity to a random location even without states in animal", () => {
        animal = AnimalFactory.createGeneric({ entityStates: [] });

        const prevPosition = { ...animal.position }

        MovementSystem.moveEntity(animal, world);
        expect(animal.position).not.toEqual(prevPosition);
    })

    it("should throw error 'Entity doesn't exist'", () => {
        expect(() => {
            MovementSystem.moveEntity(null as any, world);
        }).toThrow("Entity doesn't exist");
    })

    it("should move animal closer to the plant", () => {
        const animalPosition: Position = { x: 1, y: 1 };
        const plantPosition: Position = { x: 3, y: 1 };

        animal = AnimalFactory.createRabbit(
            {
                position: { ...animalPosition },
                hunger: { current: 10, max: 50 },
                procreation: { current: 50, max: 50 },
                entityStates: [AnimalStates.HUNGRY, AnimalStates.PROCREATING_SEASON],
            }
        );
        const plant = PlantFactory.createCommonPlant({ position: { ...plantPosition } });
        if (world.livingEntities) {
            world.livingEntities.push(plant);
        }

        MovementSystem.moveEntity(animal, world);
        expect(animal.position.x).toBeGreaterThan(animalPosition.x);
        expect(animal.position.y).toEqual(animalPosition.y);
    })
});
