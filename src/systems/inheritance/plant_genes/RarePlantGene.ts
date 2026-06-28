import { Plant } from "../../../domain/entities/Plant";
import { LivingEntity } from "../../../domain/entities/LivingEntity";
import { Gene } from "../../../shared/types/Gene";
import { GeneStrategyInterface } from "../GeneStrategyInterface";
import { PlantSpecies } from "../../../domain/enums";

export class RarePlantGene implements GeneStrategyInterface {
    applyGene(entity: LivingEntity, gene: Gene): void {
        const plant = entity as Plant;
        plant.plantSpecies = PlantSpecies.RARE;
        plant.nutritionalValue.max = (plant.nutritionalValue.max ?? 100) * 3;
        plant.growthRate.current = Math.floor(plant.growthRate.current * 0.5); // cresce mais lentamente
    }
}