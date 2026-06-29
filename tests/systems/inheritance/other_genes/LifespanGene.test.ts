import { GeneTypes } from "../../../../src/domain/enums";
import { LifespanGene } from "../../../../src/systems/inheritance/other_genes/LifespanGene";
import { Gene } from "../../../../src/shared/types/Gene";
import { AnimalFactory } from "../../../factories/AnimalFactory";

describe("LifespanGene", () => {
    it("should set lifespan max to the gene value", () => {
        const entity = AnimalFactory.createGeneric({ lifespan: { current: 50, max: 100 } });
        const gene: Gene = { geneType: GeneTypes.LIFESPAN_GENE, value: 200 };

        new LifespanGene().applyGene(entity, gene);

        expect(entity.lifespan.max).toBe(200);
    });

    it("should cap lifespan current to new max", () => {
        const entity = AnimalFactory.createGeneric({ lifespan: { current: 80, max: 100 } });
        const gene: Gene = { geneType: GeneTypes.LIFESPAN_GENE, value: 50 };

        new LifespanGene().applyGene(entity, gene);

        expect(entity.lifespan.max).toBe(50);
        expect(entity.lifespan.current).toBe(50);
    });

    it("should not change lifespan when gene has no value", () => {
        const entity = AnimalFactory.createGeneric({ lifespan: { current: 50, max: 100 } });
        const gene: Gene = { geneType: GeneTypes.LIFESPAN_GENE };

        new LifespanGene().applyGene(entity, gene);

        expect(entity.lifespan.max).toBe(100);
    });
});
