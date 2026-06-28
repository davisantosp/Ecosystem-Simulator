import { LivingEntity } from "../../../domain/entities/LivingEntity";
import { Gene } from "../../../shared/types/Gene";
import { GeneStrategyInterface } from "../GeneStrategyInterface";

export class LifespanGene implements GeneStrategyInterface {
    applyGene(entity: LivingEntity, gene: Gene): void {
        if (!gene.value) return;
        entity.lifespan.max = gene.value;
        entity.lifespan.current = Math.min(entity.lifespan.current, gene.value);
    }
}