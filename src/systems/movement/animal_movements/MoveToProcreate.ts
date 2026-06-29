import { World } from "../../../core/World";
import { Animal } from "../../../domain/entities/Animal";
import { Position } from "../../../shared/types/Position";
import { ReproductionSystem } from "../../reproduction/ReproductionSystem";
import { VisionSystem } from "../../vision/VisionSystem";
import { MovementStrategyInterface } from "../MovementStrategyInterface";
import { PathfindingSystem } from "../../pathfinding/PathFindingSystem";

export class MoveToProcreate implements MovementStrategyInterface {

    entityMove(animal: Animal, world: World): boolean {
        const mate = VisionSystem.searchForMate(animal, world);
        if (!mate) return false;

        const isAdjacent = (pos: Position) =>
            Math.abs(pos.x - mate.position.x) + Math.abs(pos.y - mate.position.y) === 1;

        if (isAdjacent(animal.position)) {
            ReproductionSystem.procreate(animal, mate, world);
            return true;
        }

        const destination = PathfindingSystem.closestAdjacentValid(
            animal.position, mate.position, world
        );
        if (!destination) return false;

        for (let steps = animal.speed; steps > 0; steps--) {
            if (isAdjacent(animal.position)) break;
            const next = PathfindingSystem.nextStep(animal.position, destination, world);
            if (!next) break;
            animal.position = next;
        }

        if (isAdjacent(animal.position))
            ReproductionSystem.procreate(animal, mate, world);
        return true;
    }
}