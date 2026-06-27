import { World } from "../../../core/World";
import { Animal } from "../../../domain/entities/Animal";
import { Position } from "../../../shared/types/Position";
import { VisionSystem } from "../../vision/VisionSystem";
import { MovementStrategyInterface } from "../MovementStrategyInterface";
import { PathfindingSystem } from "../../pathfinding/PathFindingSystem";

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

        const destination = PathfindingSystem.closestAdjacentValid(animal.position, target, world);
        if (!destination) return false;

        for (let steps = animal.speed; steps > 0; steps--) {
            if (isAdjacent(animal.position)) break;
            const next = PathfindingSystem.nextStep(animal.position, destination, world);
            if (!next) break;
            animal.position = next;
        }

        if (isAdjacent(animal.position)) animal.drink();
        return true;
    }
}