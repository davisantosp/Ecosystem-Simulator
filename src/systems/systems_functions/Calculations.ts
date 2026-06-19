import { Animal } from "../../domain/entities/Animal";
import { Position } from "../../shared/types/Position";
import { MovementStrategyInterface } from "../movement/MovementStrategyInterface";

export class Calculations {
    static distanceBetween(position1: Position, position2: Position): number {
        const x1 = position1.x;
        const y1 = position1.y;
        const x2 = position2.x;
        const y2 = position2.y;

        // Ceil is done considering that movement is done in integers
        return Math.ceil(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    }

    static utilityScore(animal: Animal, strategy: MovementStrategyInterface): number {
        return 0;
    }
}