import { Animal } from "../../../domain/entities/Animal";
import { LivingEntity } from "../../../domain/entities/LivingEntity";
import { Gene } from "../../../shared/types/Gene";
import { GeneStrategyInterface } from "../GeneStrategyInterface";

export class HungerGene implements GeneStrategyInterface {
    applyGene(entity: LivingEntity, gene: Gene): void {
        if (!gene.value) return;
        const animal = entity as Animal;
        animal.hunger.max = gene.value;
        animal.hunger.current = Math.min(animal.hunger.current, gene.value);
    }
}