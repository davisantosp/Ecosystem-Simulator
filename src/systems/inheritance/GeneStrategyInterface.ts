import { LivingEntity } from "../../domain/entities/LivingEntity";
import { Gene } from "../../shared/types/Gene";

export interface GeneStrategyInterface {
    applyGene(livingEntity: LivingEntity, gene: Gene): void;
}