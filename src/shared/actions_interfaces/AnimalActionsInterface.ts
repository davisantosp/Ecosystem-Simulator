import { LivingEntity } from "../../domain/entities/LivingEntity";

export interface AnimalActionsInterface {
    eat(food: LivingEntity): void;
    drink(): void;
}