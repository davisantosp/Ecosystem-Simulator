import { World } from "../../../core/World";
import { Animal } from "../../../domain/entities/Animal";
import { Position } from "../../../shared/types/Position";
import { ReproductionSystem } from "../../reproduction/ReproductionSystem";
import { VisionSystem } from "../../vision/VisionSystem";
import { MovementStrategyInterface } from "../MovementStrategyInterface";

export class MoveToProcreate implements MovementStrategyInterface {

    entityMove(animal: Animal, world: World): boolean {
        const mate = VisionSystem.searchForMate(animal, world);
        if (!mate) return false;


        const matePosition: Position = { ...mate.position };
        const isAdjacent = (pos: Position) =>
            Math.abs(pos.x - matePosition.x) + Math.abs(pos.y - matePosition.y) === 1;

        if (isAdjacent(animal.position)) {
            ReproductionSystem.procreate(animal, mate, world);
            return true;
        }

        for (let steps = animal.speed; steps > 0; steps--) {
            if (isAdjacent(animal.position)) break;

            let newPosition: Position = { ...animal.position };
            if (matePosition.x > animal.position.x)
                newPosition.x++;
            else if (matePosition.x < animal.position.x)
                newPosition.x--;
            else if (matePosition.y > animal.position.y)
                newPosition.y++;
            else if (matePosition.y < animal.position.y)
                newPosition.y--;

            if (world.isValidPosition(newPosition)) {
                animal.position = newPosition;
            } else {
                break;
            }
        }

        if (isAdjacent(animal.position))
            ReproductionSystem.procreate(animal, mate, world);
        return true;
    }
}