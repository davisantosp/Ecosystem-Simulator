import { World } from "../../core/World";
import { Animal } from "../../domain/entities/Animal";

export interface MovementStrategyInterface {
    entityMove(animal: Animal, world: World): boolean;
}