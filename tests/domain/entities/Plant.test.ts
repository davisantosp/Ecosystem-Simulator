import { Plant } from "../../../src/domain/entities/Plant";
import { PlantStates } from "../../../src/domain/enums";
import { PlantFactory } from "../../factories/PlantFactory";

describe("Plant.getNutritionalValue", () => {
    it("should return the current nutritional value", () => {
        const plant = PlantFactory.createGeneric({ nutritionalValue: { current: 50, max: 100 } });

        const value = plant.getNutritionalValue();

        expect(value).toBe(50);
    });
});

describe("Plant.die", () => {
    it("should add WITHERED state", () => {
        const plant = PlantFactory.createGeneric({ entityStates: [PlantStates.MATURE] });

        plant.die();

        expect(plant.entityStates).toContain(PlantStates.WITHERED);
    });
});

describe("Plant.photosynthesize", () => {
    it("should increase nutritional value", () => {
        const plant = PlantFactory.createGeneric({
            growthRate: { current: 50 },
            nutritionalValue: { current: 10, max: 100 },
        });

        plant.photosynthesize();

        expect(plant.nutritionalValue.current).toBeGreaterThan(10);
    });

    it("should not exceed max nutritional value", () => {
        const plant = PlantFactory.createGeneric({
            growthRate: { current: 200 },
            nutritionalValue: { current: 95, max: 100 },
        });

        plant.photosynthesize();

        expect(plant.nutritionalValue.current).toBeLessThanOrEqual(100);
    });

    it("should work when max is undefined", () => {
        const plant = PlantFactory.createGeneric({
            growthRate: { current: 50 },
            nutritionalValue: { current: 10 } as any,
        });

        plant.photosynthesize();

        expect(plant.nutritionalValue.current).toBe(15);
    });
});

describe("Plant.grow", () => {
    it("should transition to SPROUT when nutritional value reaches threshold", () => {
        const plant = PlantFactory.createGeneric({
            entityStates: [PlantStates.SEED],
            nutritionalValue: { current: 40, max: 100 },
        });

        plant.grow();

        expect(plant.entityStates).toContain(PlantStates.SPROUT);
    });

    it("should transition to MATURE when nutritional value reaches high threshold", () => {
        const plant = PlantFactory.createGeneric({
            entityStates: [PlantStates.SPROUT],
            nutritionalValue: { current: 80, max: 100 },
        });

        plant.grow();

        expect(plant.entityStates).toContain(PlantStates.MATURE);
    });

    it("should transition to SEED when nutritional value is below sprout threshold", () => {
        const plant = PlantFactory.createGeneric({
            entityStates: [PlantStates.SPROUT],
            nutritionalValue: { current: -1, max: 100 },
        });

        plant.grow();

        expect(plant.entityStates).toContain(PlantStates.SEED);
        expect(plant.entityStates).not.toContain(PlantStates.SPROUT);
    });

    it("should remove previous state when transitioning", () => {
        const plant = PlantFactory.createGeneric({
            entityStates: [PlantStates.SEED],
            nutritionalValue: { current: 40, max: 100 },
        });

        plant.grow();

        expect(plant.entityStates).toContain(PlantStates.SPROUT);
        expect(plant.entityStates).not.toContain(PlantStates.SEED);
    });
});

describe("Plant.update", () => {
    it("should decrement lifespan each tick", () => {
        const plant = PlantFactory.createGeneric({ lifespan: { current: 10, max: 10 } });

        plant.update();

        expect(plant.lifespan.current).toBe(9);
    });

    it("should die when lifespan reaches zero", () => {
        const plant = PlantFactory.createGeneric({
            lifespan: { current: 1, max: 10 },
            entityStates: [PlantStates.MATURE],
        });

        plant.update();

        expect(plant.entityStates).toContain(PlantStates.WITHERED);
    });

    it("should not photosynthesize or grow when dead", () => {
        const plant = PlantFactory.createGeneric({
            lifespan: { current: 1, max: 10 },
            entityStates: [PlantStates.MATURE],
            nutritionalValue: { current: 50, max: 100 },
        });

        plant.update();
        const nvAfterDeath = plant.nutritionalValue.current;

        plant.update();
        expect(plant.nutritionalValue.current).toBe(nvAfterDeath);
    });
});
