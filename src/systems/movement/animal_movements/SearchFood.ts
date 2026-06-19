import { World } from "../../../core/World";
import { Animal } from "../../../domain/entities/Animal";
import { LivingEntitiesTypes } from "../../../domain/enums/entities_enums/LivingEntitiesTypes";
import { DietTypes } from "../../../domain/enums/other_enums/DietTypes";
import { VisionSystem } from "../../vision/VisionSystem";
import { MovementStrategyInterface } from "../MovementStrategyInterface";

export class SearchFood implements MovementStrategyInterface {

    entityMove(animal: Animal, world: World): boolean {
        const foodPreference = this.getFoodPreference(animal);
        const target = VisionSystem.searchForTarget(animal, world, foodPreference);

        return false;
    }

    // Subject to change
    private getFoodPreference(animal: Animal): LivingEntitiesTypes | LivingEntitiesTypes[] {
        const dietPreference = animal.diet.type;

        if (dietPreference === DietTypes.CARNIVORE) {
            return LivingEntitiesTypes.ANIMAL;
        }
        if (dietPreference === DietTypes.HERBIVORE) {
            return LivingEntitiesTypes.PLANT;
        }
        if (dietPreference === DietTypes.OMNIVORE) {
            return [LivingEntitiesTypes.ANIMAL, LivingEntitiesTypes.PLANT];
        }

        throw new Error("Error in getting food preferences");
    }
}