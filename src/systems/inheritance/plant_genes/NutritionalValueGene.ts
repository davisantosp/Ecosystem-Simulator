import { Plant } from "../../../domain/entities/Plant";
import { LivingEntity } from "../../../domain/entities/LivingEntity";
import { Gene } from "../../../shared/types/Gene";
import { GeneStrategyInterface } from "../GeneStrategyInterface";

export class NutritionalValueGene implements GeneStrategyInterface {
    applyGene(entity: LivingEntity, gene: Gene): void {
        if (!gene.value) return;
        const plant = entity as Plant;
        plant.nutritionalValue.max = gene.value;
        plant.nutritionalValue.current = Math.min(plant.nutritionalValue.current, gene.value);
    }
}