import { World } from "../../../core/World";
import { LivingEntity } from "../../../domain/entities/LivingEntity";
import { MovementStrategyInterface } from "../MovementStrategyInterface";

export class MoveToProcreate implements MovementStrategyInterface {

    entityMove(livingEntity: LivingEntity, world: World): boolean {
        throw new Error("Method not implemented.");
    }
}