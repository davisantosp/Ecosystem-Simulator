import { Animal } from "../../../domain/entities/Animal";
import { LivingEntity } from "../../../domain/entities/LivingEntity";
import { DietTypes } from "../../../domain/enums";
import { Gene } from "../../../shared/types/Gene";
import { GeneStrategyInterface } from "../GeneStrategyInterface";

export class DietShiftGene implements GeneStrategyInterface {
    applyGene(entity: LivingEntity, gene: Gene): void {
        (entity as Animal).diet = { type: DietTypes.OMNIVORE };
    }
}