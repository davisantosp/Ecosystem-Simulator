import { World } from "../../../core/World";
import { Animal } from "../../../domain/entities/Animal";
import { LivingEntitiesTypes } from "../../../domain/enums";
import { DIET_FOOD_PREFERENCE_MAP } from "../../../shared/config/ecosystemConfig";
import { Position } from "../../../shared/types/Position";
import { VisionSystem } from "../../vision/VisionSystem";
import { MovementStrategyInterface } from "../MovementStrategyInterface";

export class SearchFood implements MovementStrategyInterface {

    entityMove(animal: Animal, world: World): boolean {
        const foodPreference = this.getFoodPreference(animal);
        const target = VisionSystem.searchForTarget(animal, world, foodPreference);

        if (!target) return false;

        const targetPosition = target.position;

        for (let steps = animal.speed; steps > 0; steps--) {
            if (animal.position.x === targetPosition.x && animal.position.y === targetPosition.y) {
                break;
            }

            let newPosition: Position = { ...animal.position };
            if (targetPosition.x > animal.position.x) {
                newPosition.x++;
            } else if (targetPosition.x < animal.position.x) {
                newPosition.x--;
            } else if (targetPosition.y > animal.position.y) {
                newPosition.y++;
            } else if (targetPosition.y < animal.position.y) {
                newPosition.y--;
            }
            if (world.isValidPosition(newPosition)) {
                animal.position = newPosition;
            } else {
                break;
            }
        }

        if (animal.position.x === targetPosition.x && animal.position.y === targetPosition.y)
            animal.eat(target);
        return true;
    }

    private getFoodPreference(animal: Animal): LivingEntitiesTypes | LivingEntitiesTypes[] {
        const preference = DIET_FOOD_PREFERENCE_MAP[animal.diet.type];

        if (preference === undefined) {
            throw new Error(`Food preference mapping not found for diet type: ${animal.diet.type}`);
        }

        return preference;
    }
}