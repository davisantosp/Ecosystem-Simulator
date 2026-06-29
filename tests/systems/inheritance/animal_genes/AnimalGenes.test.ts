import { Animal } from "../../../../src/domain/entities/Animal";
import { GeneTypes } from "../../../../src/domain/enums";
import { DietShiftGene } from "../../../../src/systems/inheritance/animal_genes/DietShiftGene";
import { HungerGene } from "../../../../src/systems/inheritance/animal_genes/HungerGene";
import { SpeedGene } from "../../../../src/systems/inheritance/animal_genes/SpeedGene";
import { ThirstGene } from "../../../../src/systems/inheritance/animal_genes/ThirstGene";
import { VisionGene } from "../../../../src/systems/inheritance/animal_genes/VisionGene";
import { Gene } from "../../../../src/shared/types/Gene";
import { AnimalFactory } from "../../../factories/AnimalFactory";

describe("SpeedGene", () => {
    it("should set animal speed to the gene value", () => {
        const animal = AnimalFactory.createGeneric({ speed: 1 });
        const gene: Gene = { geneType: GeneTypes.SPEED_GENE, value: 7 };

        new SpeedGene().applyGene(animal, gene);

        expect(animal.speed).toBe(7);
    });

    it("should not change speed when gene has no value", () => {
        const animal = AnimalFactory.createGeneric({ speed: 3 });
        const gene: Gene = { geneType: GeneTypes.SPEED_GENE };

        new SpeedGene().applyGene(animal, gene);

        expect(animal.speed).toBe(3);
    });
});

describe("VisionGene", () => {
    it("should set animal vision radius to the gene value", () => {
        const animal = AnimalFactory.createGeneric({ visionRadius: 1 });
        const gene: Gene = { geneType: GeneTypes.VISION_GENE, value: 12 };

        new VisionGene().applyGene(animal, gene);

        expect(animal.visionRadius).toBe(12);
    });

    it("should not change vision when gene has no value", () => {
        const animal = AnimalFactory.createGeneric({ visionRadius: 5 });
        const gene: Gene = { geneType: GeneTypes.VISION_GENE };

        new VisionGene().applyGene(animal, gene);

        expect(animal.visionRadius).toBe(5);
    });
});

describe("HungerGene", () => {
    it("should set hunger max to the gene value", () => {
        const animal = AnimalFactory.createGeneric({ hunger: { current: 30, max: 50 } });
        const gene: Gene = { geneType: GeneTypes.HUNGER_MAX_GENE, value: 80 };

        new HungerGene().applyGene(animal, gene);

        expect(animal.hunger.max).toBe(80);
    });

    it("should cap hunger current to max", () => {
        const animal = AnimalFactory.createGeneric({ hunger: { current: 60, max: 50 } });
        const gene: Gene = { geneType: GeneTypes.HUNGER_MAX_GENE, value: 40 };

        new HungerGene().applyGene(animal, gene);

        expect(animal.hunger.max).toBe(40);
        expect(animal.hunger.current).toBe(40);
    });

    it("should not change hunger when gene has no value", () => {
        const animal = AnimalFactory.createGeneric({ hunger: { current: 30, max: 50 } });
        const gene: Gene = { geneType: GeneTypes.HUNGER_MAX_GENE };

        new HungerGene().applyGene(animal, gene);

        expect(animal.hunger.max).toBe(50);
    });
});

describe("ThirstGene", () => {
    it("should set thirst max to the gene value", () => {
        const animal = AnimalFactory.createGeneric({ thirst: { current: 30, max: 50 } });
        const gene: Gene = { geneType: GeneTypes.THIRST_MAX_GENE, value: 90 };

        new ThirstGene().applyGene(animal, gene);

        expect(animal.thirst.max).toBe(90);
    });

    it("should cap thirst current to max", () => {
        const animal = AnimalFactory.createGeneric({ thirst: { current: 60, max: 50 } });
        const gene: Gene = { geneType: GeneTypes.THIRST_MAX_GENE, value: 30 };

        new ThirstGene().applyGene(animal, gene);

        expect(animal.thirst.max).toBe(30);
        expect(animal.thirst.current).toBe(30);
    });
});

describe("DietShiftGene", () => {
    it("should change animal diet type to OMNIVORE", () => {
        const animal = AnimalFactory.createRabbit();
        const gene: Gene = { geneType: GeneTypes.DIET_SHIFT_GENE };

        new DietShiftGene().applyGene(animal, gene);

        expect(animal.diet.type).toBe(2);
    });
});
