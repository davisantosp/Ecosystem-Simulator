import { World } from "../../../core/World";
import { LivingEntity } from "../../../domain/entities/LivingEntity";
import { LivingEntitiesTypes } from "../../../domain/enums/entities_enums/LivingEntitiesTypes";
import { MovementStrategyInterface } from "../MovementStrategyInterface";

export class RandomlyMove implements MovementStrategyInterface {

    entityMove(livingEntity: LivingEntity, world: World): boolean {
        if (livingEntity.entityType != LivingEntitiesTypes.ANIMAL)




            return false;
    }
}