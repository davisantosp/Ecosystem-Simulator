import { World } from "../../../core/World";
import { Animal } from "../../../domain/entities/Animal";
import { Position } from "../../../shared/types/Position";
import { VisionSystem } from "../../vision/VisionSystem";
import { MovementStrategyInterface } from "../MovementStrategyInterface";

export class SearchWater implements MovementStrategyInterface {

    entityMove(animal: Animal, world: World): boolean {
        const target = VisionSystem.searchForWater(animal, world);
        if (!target) return false;

        const isAdjacent = (pos: Position) =>
            Math.abs(pos.x - target.x) + Math.abs(pos.y - target.y) === 1;

        if (isAdjacent(animal.position)) {
            animal.drink();
            return true;
        }

        for (let steps = animal.speed; steps > 0; steps--) {
            if (isAdjacent(animal.position)) break;

            let newPosition: Position = { ...animal.position };
            if (target.x > animal.position.x)
                newPosition.x++;
            else if (target.x < animal.position.x)
                newPosition.x--;
            else if (target.y > animal.position.y)
                newPosition.y++;
            else if (target.y < animal.position.y)
                newPosition.y--;

            if (world.isValidPosition(newPosition)) {
                animal.position = newPosition;
            } else {
                break;
            }
        }

        if (isAdjacent(animal.position))
            animal.drink();
        return true;
    }
}