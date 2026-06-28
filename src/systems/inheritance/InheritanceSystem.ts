import { Animal } from "../../domain/entities/Animal";
import { LivingEntity } from "../../domain/entities/LivingEntity";
import { LivingEntitiesTypes, GeneTypes } from "../../domain/enums";
import { Plant } from "../../domain/entities/Plant";
import { Gene } from "../../shared/types/Gene";
import { GENE_VALUE_INTERVAL_MAP } from "../../shared/config/ecosystemConfig";
import { GeneChanceRegistry, MUTATION_CHANCE } from "./registry/GeneChanceRegistry";
import { GeneStrategyRegistry } from "./registry/GeneStrategyRegistry";

const ANIMAL_ONLY_GENES = [
    GeneTypes.SPEED_GENE,
    GeneTypes.VISION_GENE,
    GeneTypes.HUNGER_MAX_GENE,
    GeneTypes.THIRST_MAX_GENE,
    GeneTypes.DIET_SHIFT_GENE,
];

const PLANT_ONLY_GENES = [
    GeneTypes.GROWTH_RATE_GENE,
    GeneTypes.NUTRITIONAL_VALUE_MAX_GENE,
    GeneTypes.RARE_PLANT_GENE,
    GeneTypes.VENOMOUS_PLANT_GENE,
];

export class InheritanceSystem {

    static inheritCharacteristics(parent1: LivingEntity, parent2: LivingEntity, progeny: LivingEntity): boolean {
        const avg = (a: number, b: number) => Math.round((a + b) / 2);

        progeny.lifespan.max = avg(parent1.lifespan.max ?? 150, parent2.lifespan.max ?? 150);
        progeny.lifespan.current = progeny.lifespan.max;

        if (progeny.entityType === LivingEntitiesTypes.ANIMAL) {
            const p1 = parent1 as Animal;
            const p2 = parent2 as Animal;
            const child = progeny as Animal;

            child.hunger.max = avg(p1.hunger.max ?? 50, p2.hunger.max ?? 50);
            child.hunger.current = child.hunger.max;

            child.thirst.max = avg(p1.thirst.max ?? 50, p2.thirst.max ?? 50);
            child.thirst.current = child.thirst.max;

            child.speed = avg(p1.speed, p2.speed);
            child.visionRadius = avg(p1.visionRadius, p2.visionRadius);
        }

        if (progeny.entityType === LivingEntitiesTypes.PLANT) {
            const p1 = parent1 as Plant;
            const p2 = parent2 as Plant;
            const child = progeny as Plant;

            child.growthRate.max = avg(p1.growthRate.max ?? 10, p2.growthRate.max ?? 10);
            child.growthRate.current = child.growthRate.max;

            child.nutritionalValue.max = avg(p1.nutritionalValue.max ?? 100, p2.nutritionalValue.max ?? 100);
            child.nutritionalValue.current = 0;
        }

        return true;
    }

    static inheritGenes(parent1: LivingEntity, parent2: LivingEntity, progeny: LivingEntity): boolean {
        const progenyGenes: Gene[] = [];
        const allParentGenes = [...parent1.genes, ...parent2.genes];

        for (const gene of allParentGenes) {
            const alreadyHas = progenyGenes.some(g => g.geneType === gene.geneType);
            if (!alreadyHas && this.geneApplyChance(gene)) {
                progenyGenes.push({ ...gene });
            }
        }

        for (const newGene of this.receiveNewGenes(progenyGenes)) {
            progenyGenes.push(newGene);
        }

        progeny.genes = progenyGenes;
        this.applyGenesToProgeny(progeny);
        return true;
    }

    private static geneApplyChance(gene: Gene): boolean {
        const chance = GeneChanceRegistry[gene.geneType] ?? 0.7;
        return Math.random() < chance;
    }

    private static receiveNewGenes(existingGenes: Gene[]): Gene[] {
        const newGenes: Gene[] = [];
        const allTypes = Object.values(GeneTypes).filter(v => typeof v === "number") as GeneTypes[];

        for (const geneType of allTypes) {
            const alreadyHas = existingGenes.some(g => g.geneType === geneType);
            if (!alreadyHas && Math.random() < MUTATION_CHANCE) {
                const interval = GENE_VALUE_INTERVAL_MAP[geneType];
                const value = interval
                    ? Math.round(interval.start + Math.random() * (interval.end - interval.start))
                    : undefined;
                newGenes.push({ geneType, value } as Gene);
            }
        }

        return newGenes;
    }

    private static applyGenesToProgeny(progeny: LivingEntity): void {
        if (!progeny) throw new Error("No progeny to apply genes.");
        for (const gene of progeny.genes) {
            const strategy = GeneStrategyRegistry.get(gene.geneType);
            if (!strategy) throw new Error(`No strategy found for gene type: ${gene.geneType}`);
            if (progeny.entityType === LivingEntitiesTypes.ANIMAL && PLANT_ONLY_GENES.includes(gene.geneType))
                continue;
            if (progeny.entityType === LivingEntitiesTypes.PLANT && ANIMAL_ONLY_GENES.includes(gene.geneType))
                continue;
            strategy.applyGene(progeny, gene);
        }
    }
}