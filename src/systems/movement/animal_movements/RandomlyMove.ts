import { World } from "../../../core/World";
import { Animal } from "../../../domain/entities/Animal";
import { Position } from "../../../shared/types/Position";
import { MovementStrategyInterface } from "../MovementStrategyInterface";

export class RandomlyMove implements MovementStrategyInterface {

    entityMove(animal: Animal, world: World): boolean {
        if (!animal) throw new Error("Entity not found to be moved.");

        const currentPosition = animal.position;

        const DIRECTIONS = [
            { direction: "North", value: 1 },
            { direction: "East", value: 2 },
            { direction: "South", value: 3 },
            { direction: "West", value: 4 },
        ]

        let newPosition: Position;
        while (true) {
            newPosition = { x: currentPosition.x, y: currentPosition.y }

            for (let i = animal.speed; i > 0; i--) {
                const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]?.direction;
                switch (direction) {
                    case "North": newPosition.y++; break;
                    case "East": newPosition.x++; break;
                    case "South": newPosition.y--; break;
                    case "West": newPosition.x--; break;
                }
            }

            if (world.isValidPosition(newPosition)) {
                break;
            }
        }
        // Will be changed to a function later
        animal.position = newPosition
        return true;
    }
}