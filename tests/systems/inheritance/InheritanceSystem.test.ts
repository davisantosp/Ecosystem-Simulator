import { Animal } from "../../../src/domain/entities/Animal";
import { Plant } from "../../../src/domain/entities/Plant";
import { GeneTypes } from "../../../src/domain/enums";
import { InheritanceSystem } from "../../../src/systems/inheritance/InheritanceSystem";
import { Gene } from "../../../src/shared/types/Gene";
import { AnimalFactory } from "../../factories/AnimalFactory";
import { PlantFactory } from "../../factories/PlantFactory";

describe("InheritanceSystem.inheritCharacteristics", () => {
    it("should set offspring lifespan to average of parents for animals", () => {
        const parent1 = AnimalFactory.createRabbit({ lifespan: { current: 100, max: 100 } });
        const parent2 = AnimalFactory.createWolf({ lifespan: { current: 200, max: 200 } });
        const child = AnimalFactory.createGeneric({ lifespan: { current: 0, max: 0 } });

        InheritanceSystem.inheritCharacteristics(parent1, parent2, child);

        expect(child.lifespan.max).toBe(150);
        expect(child.lifespan.current).toBe(150);
    });

    it("should set lifespan to average of parents for plants", () => {
        const parent1 = PlantFactory.createCommonPlant({ lifespan: { current: 50, max: 50 } });
        const parent2 = PlantFactory.createRarePlant({ lifespan: { current: 150, max: 150 } });
        const child = PlantFactory.createGeneric({ lifespan: { current: 0, max: 0 } });

        InheritanceSystem.inheritCharacteristics(parent1, parent2, child);

        expect(child.lifespan.max).toBe(100);
        expect(child.lifespan.current).toBe(100);
    });

    it("should set animal-specific stats to average of parents", () => {
        const parent1 = AnimalFactory.createRabbit({
            hunger: { current: 50, max: 50 },
            thirst: { current: 50, max: 50 },
            speed: 2,
            visionRadius: 5,
        });
        const parent2 = AnimalFactory.createWolf({
            hunger: { current: 100, max: 100 },
            thirst: { current: 100, max: 100 },
            speed: 10,
            visionRadius: 15,
        });
        const child = AnimalFactory.createGeneric({
            hunger: { current: 0, max: 0 },
            thirst: { current: 0, max: 0 },
            speed: 0,
            visionRadius: 0,
        });

        InheritanceSystem.inheritCharacteristics(parent1, parent2, child);

        const childAnimal = child as Animal;
        expect(childAnimal.hunger.max).toBe(75);
        expect(childAnimal.hunger.current).toBe(75);
        expect(childAnimal.thirst.max).toBe(75);
        expect(childAnimal.thirst.current).toBe(75);
        expect(childAnimal.speed).toBe(6);
        expect(childAnimal.visionRadius).toBe(10);
    });

    it("should set plant-specific stats to average of parents", () => {
        const parent1 = PlantFactory.createCommonPlant({
            growthRate: { current: 20, max: 20 },
            nutritionalValue: { current: 50, max: 50 },
        });
        const parent2 = PlantFactory.createRarePlant({
            growthRate: { current: 100, max: 100 },
            nutritionalValue: { current: 200, max: 200 },
        });
        const child = PlantFactory.createGeneric({
            growthRate: { current: 0, max: 0 },
            nutritionalValue: { current: 0, max: 0 },
        });

        InheritanceSystem.inheritCharacteristics(parent1, parent2, child);

        expect(child.growthRate.max).toBe(60);
        expect(child.growthRate.current).toBe(60);
        expect(child.nutritionalValue.max).toBe(125);
        expect(child.nutritionalValue.current).toBe(0);
    });

    it("should handle missing max values gracefully", () => {
        const parent1 = AnimalFactory.createGeneric({ lifespan: { current: 100 } as any });
        const parent2 = AnimalFactory.createGeneric({ lifespan: { current: 200 } as any });
        const child = AnimalFactory.createGeneric({ lifespan: { current: 0, max: 0 } });

        InheritanceSystem.inheritCharacteristics(parent1, parent2, child);

        expect(child.lifespan.max).toBe(150);
    });
});

describe("InheritanceSystem.inheritGenes", () => {
    beforeEach(() => {
        jest.spyOn(Math, "random").mockReturnValue(0);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should collect genes from both parents into the offspring (no duplicates)", () => {
        const parent1 = AnimalFactory.createGeneric({ genes: [{ geneType: GeneTypes.SPEED_GENE, value: 5 }] });
        const parent2 = AnimalFactory.createGeneric({ genes: [{ geneType: GeneTypes.VISION_GENE, value: 8 }] });
        const child = AnimalFactory.createGeneric({ genes: [] });

        InheritanceSystem.inheritGenes(parent1, parent2, child);

        expect(child.genes.length).toBeGreaterThanOrEqual(2);
        expect(child.genes.some(g => g.geneType === GeneTypes.SPEED_GENE)).toBe(true);
        expect(child.genes.some(g => g.geneType === GeneTypes.VISION_GENE)).toBe(true);
    });

    it("should not add duplicate gene types", () => {
        const parent1 = AnimalFactory.createGeneric({ genes: [{ geneType: GeneTypes.SPEED_GENE, value: 5 }] });
        const parent2 = AnimalFactory.createGeneric({ genes: [{ geneType: GeneTypes.SPEED_GENE, value: 8 }] });
        const child = AnimalFactory.createGeneric({ genes: [] });

        InheritanceSystem.inheritGenes(parent1, parent2, child);

        const speedGenes = child.genes.filter(g => g.geneType === GeneTypes.SPEED_GENE);
        expect(speedGenes.length).toBe(1);
    });

    it("should apply inherited genes to the offspring stats", () => {
        const parent1 = AnimalFactory.createGeneric({ genes: [{ geneType: GeneTypes.SPEED_GENE, value: 8 }] });
        const parent2 = AnimalFactory.createGeneric({ genes: [] });
        const child = AnimalFactory.createGeneric({ genes: [], speed: 1 });

        InheritanceSystem.inheritGenes(parent1, parent2, child);

        const childAnimal = child as Animal;
        expect(childAnimal.speed).toBe(8);
    });

    it("should return true after successful inheritance", () => {
        const parent1 = AnimalFactory.createGeneric({ genes: [{ geneType: GeneTypes.SPEED_GENE, value: 5 }] });
        const parent2 = AnimalFactory.createGeneric({ genes: [] });
        const child = AnimalFactory.createGeneric({ genes: [] });

        const result = InheritanceSystem.inheritGenes(parent1, parent2, child);

        expect(result).toBe(true);
    });

    it("should return true after successful characteristic inheritance", () => {
        const parent1 = AnimalFactory.createGeneric();
        const parent2 = AnimalFactory.createGeneric();
        const child = AnimalFactory.createGeneric();

        const result = InheritanceSystem.inheritCharacteristics(parent1, parent2, child);

        expect(result).toBe(true);
    });
});
