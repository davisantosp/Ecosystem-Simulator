import { RandomlyMove } from "../../../../src/systems/movement/animal_movements/RandomlyMove";
import { AnimalFactory } from "../../../factories/AnimalFactory";
import { CoreFactory } from "../../../factories/CoreFactory";

describe("RandomlyMove strategy", () => {
    let movementStrategy: RandomlyMove;

    beforeEach(() => {
        movementStrategy = new RandomlyMove();
    });

    it("should change the current position to a valid one", () => {
        const world = CoreFactory.createWorld({ width: 10, height: 10 });

        const animal = AnimalFactory.createGeneric({
            position: { x: 5, y: 5 },
            speed: 1
        });

        const posicaoOriginal = { ...animal.position };

        const resultado = movementStrategy.entityMove(animal, world);

        expect(resultado).toBe(true);
        expect(animal.position).not.toEqual(posicaoOriginal); // A posição TEM de ter mudado
        expect(world.isValidPosition(animal.position)).toBe(true);
    });

    it("should return an error if the entity passed is null", () => {
        const world = CoreFactory.createWorld({ width: 10, height: 10 });

        expect(() => {
            movementStrategy.entityMove(null as any, world);
        }).toThrow("Entity not found to be moved.");
    });
});