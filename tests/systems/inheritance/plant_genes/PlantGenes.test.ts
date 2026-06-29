import { Plant } from "../../../../src/domain/entities/Plant";
import { GeneTypes } from "../../../../src/domain/enums";
import { GrowthRateGene } from "../../../../src/systems/inheritance/plant_genes/GrowthRateGene";
import { NutritionalValueGene } from "../../../../src/systems/inheritance/plant_genes/NutritionalValueGene";
import { RarePlantGene } from "../../../../src/systems/inheritance/plant_genes/RarePlantGene";
import { Gene } from "../../../../src/shared/types/Gene";
import { PlantFactory } from "../../../factories/PlantFactory";

describe("GrowthRateGene", () => {
    it("should set growth rate max and current to the gene value", () => {
        const plant = PlantFactory.createGeneric({ growthRate: { current: 10, max: 10 } });
        const gene: Gene = { geneType: GeneTypes.GROWTH_RATE_GENE, value: 50 };

        new GrowthRateGene().applyGene(plant, gene);

        expect(plant.growthRate.max).toBe(50);
        expect(plant.growthRate.current).toBe(50);
    });

    it("should not change growth rate when gene has no value", () => {
        const plant = PlantFactory.createGeneric({ growthRate: { current: 20, max: 20 } });
        const gene: Gene = { geneType: GeneTypes.GROWTH_RATE_GENE };

        new GrowthRateGene().applyGene(plant, gene);

        expect(plant.growthRate.max).toBe(20);
    });
});

describe("NutritionalValueGene", () => {
    it("should set nutritional value max to the gene value", () => {
        const plant = PlantFactory.createGeneric({ nutritionalValue: { current: 10, max: 100 } });
        const gene: Gene = { geneType: GeneTypes.NUTRITIONAL_VALUE_MAX_GENE, value: 300 };

        new NutritionalValueGene().applyGene(plant, gene);

        expect(plant.nutritionalValue.max).toBe(300);
    });

    it("should cap nutritional value current to new max", () => {
        const plant = PlantFactory.createGeneric({ nutritionalValue: { current: 80, max: 100 } });
        const gene: Gene = { geneType: GeneTypes.NUTRITIONAL_VALUE_MAX_GENE, value: 50 };

        new NutritionalValueGene().applyGene(plant, gene);

        expect(plant.nutritionalValue.max).toBe(50);
        expect(plant.nutritionalValue.current).toBe(50);
    });

    it("should not change nutritional value when gene has no value", () => {
        const plant = PlantFactory.createGeneric({ nutritionalValue: { current: 30, max: 100 } });
        const gene: Gene = { geneType: GeneTypes.NUTRITIONAL_VALUE_MAX_GENE };

        new NutritionalValueGene().applyGene(plant, gene);

        expect(plant.nutritionalValue.max).toBe(100);
    });
});

describe("RarePlantGene", () => {
    it("should multiply nutritional value max by 3", () => {
        const plant = PlantFactory.createGeneric({ nutritionalValue: { current: 10, max: 100 } });
        const gene: Gene = { geneType: GeneTypes.RARE_PLANT_GENE };

        new RarePlantGene().applyGene(plant, gene);

        expect(plant.nutritionalValue.max).toBe(300);
    });

    it("should halve the growth rate current", () => {
        const plant = PlantFactory.createGeneric({
            growthRate: { current: 50, max: 50 },
            nutritionalValue: { current: 10, max: 100 },
        });
        const gene: Gene = { geneType: GeneTypes.RARE_PLANT_GENE };

        new RarePlantGene().applyGene(plant, gene);

        expect(plant.growthRate.current).toBe(25);
    });
});
