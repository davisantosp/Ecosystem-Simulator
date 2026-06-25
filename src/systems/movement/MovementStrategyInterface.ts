import { World } from "../../core/World";
import { LivingEntity } from "../../domain/entities/LivingEntity";

export interface MovementStrategyInterface {
    entityMove(livingEntity: LivingEntity, world: World): boolean;
}