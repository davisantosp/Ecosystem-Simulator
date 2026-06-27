import { World } from "../../../core/World";
import { Animal } from "../../../domain/entities/Animal";
import { LivingEntitiesTypes } from "../../../domain/enums/entities/LivingEntitiesTypes";
import { DIET_FOOD_PREFERENCE_MAP } from "../../../shared/config/ecosystemConfig";
import { VisionSystem } from "../../vision/VisionSystem";
import { MovementStrategyInterface } from "../MovementStrategyInterface";
import { PathfindingSystem } from "../../pathfinding/PathFindingSystem";

export class SearchFood implements MovementStrategyInterface {

    entityMove(animal: Animal, world: World): boolean {
        const foodPreference = this.getFoodPreference(animal);
        const target = VisionSystem.searchForTarget(animal, world, foodPreference);
        if (!target) return false;

        for (let steps = animal.speed; steps > 0; steps--) {
            if (animal.position.x === target.position.x &&
                animal.position.y === target.position.y) {
                break;
            }
            const next = PathfindingSystem.nextStep(animal.position, target.position, world);
            if (!next) break;
            animal.position = next;
        }

        if (animal.position.x === target.position.x &&
            animal.position.y === target.position.y)
            animal.eat(target);

        return true;
    }

    private getFoodPreference(animal: Animal): LivingEntitiesTypes | LivingEntitiesTypes[] {
        const preference = DIET_FOOD_PREFERENCE_MAP[animal.diet.type];
        if (preference === undefined)
            throw new Error(`Food preference mapping not found for diet type: ${animal.diet.type}`);
        return preference;
    }
}