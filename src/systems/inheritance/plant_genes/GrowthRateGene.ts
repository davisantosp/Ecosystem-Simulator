import { Plant } from "../../../domain/entities/Plant";
import { LivingEntity } from "../../../domain/entities/LivingEntity";
import { Gene } from "../../../shared/types/Gene";
import { GeneStrategyInterface } from "../GeneStrategyInterface";

export class GrowthRateGene implements GeneStrategyInterface {
    applyGene(entity: LivingEntity, gene: Gene): void {
        if (!gene.value) return;
        const plant = entity as Plant;
        plant.growthRate.max = gene.value;
        plant.growthRate.current = gene.value;
    }
}