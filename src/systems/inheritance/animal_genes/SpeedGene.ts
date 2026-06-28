import { Animal } from "../../../domain/entities/Animal";
import { LivingEntity } from "../../../domain/entities/LivingEntity";
import { Gene } from "../../../shared/types/Gene";
import { GeneStrategyInterface } from "../GeneStrategyInterface";

export class SpeedGene implements GeneStrategyInterface {
    applyGene(entity: LivingEntity, gene: Gene): void {
        if (!gene.value) return;
        (entity as Animal).speed = gene.value;
    }
}