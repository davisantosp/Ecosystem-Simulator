import { LivingEntity } from "../../../domain/entities/LivingEntity";
import { Plant } from "../../../domain/entities/Plant";
import { PlantSpecies } from "../../../domain/enums";
import { Gene } from "../../../shared/types/Gene";
import { GeneStrategyInterface } from "../GeneStrategyInterface";

export class VenomousPlantGene implements GeneStrategyInterface {
    applyGene(entity: LivingEntity, gene: Gene): void {
        (entity as Plant).plantSpecies = PlantSpecies.VENOMOUS;
    }

}