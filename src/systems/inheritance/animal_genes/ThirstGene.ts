import { Animal } from "../../../domain/entities/Animal";
import { LivingEntity } from "../../../domain/entities/LivingEntity";
import { Gene } from "../../../shared/types/Gene";
import { GeneStrategyInterface } from "../GeneStrategyInterface";

export class ThirstGene implements GeneStrategyInterface {
    applyGene(entity: LivingEntity, gene: Gene): void {
        if (!gene.value) return;
        const animal = entity as Animal;
        animal.thirst.max = gene.value;
        animal.thirst.current = Math.min(animal.thirst.current, gene.value);
    }
}