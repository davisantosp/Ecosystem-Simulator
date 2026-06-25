import { LivingEntity } from "../../../src/domain/entities/LivingEntity";
import { Animal } from "../../../src/domain/entities/Animal";
import { Plant } from "../../../src/domain/entities/Plant";
import { LivingEntitiesTypes } from "../../../src/domain/enums/entities_enums/LivingEntitiesTypes";
import { AnimalStates } from "../../../src/domain/enums/states_enums/AnimalStates";
import { PlantStates } from "../../../src/domain/enums/states_enums/PlantStates";
import { AnimalFactory } from "../../factories/AnimalFactory";
import { PlantFactory } from "../../factories/PlantFactory";

describe("LivingEntity.updateState", () => {
    it("should add new states to the entity", () => {
        const animal = AnimalFactory.createGeneric({ entityStates: [] });

        animal.updateState([AnimalStates.HUNGRY, AnimalStates.THIRSTY]);

        expect(animal.entityStates).toContain(AnimalStates.HUNGRY);
        expect(animal.entityStates).toContain(AnimalStates.THIRSTY);
    });

    it("should not duplicate existing states", () => {
        const animal = AnimalFactory.createGeneric({ entityStates: [AnimalStates.NORMAL] });

        animal.updateState([AnimalStates.NORMAL, AnimalStates.HUNGRY]);

        expect(animal.entityStates.filter(s => s === AnimalStates.NORMAL).length).toBe(1);
        expect(animal.entityStates).toContain(AnimalStates.HUNGRY);
    });

    it("should throw when states is null", () => {
        const animal = AnimalFactory.createGeneric();

        expect(() => {
            animal.updateState(null as any);
        }).toThrow("States array is required but was null or undefined");
    });
});

describe("LivingEntity.updateGenes", () => {
    it("should replace genes when provided", () => {
        const animal = AnimalFactory.createGeneric({ genes: [] });
        const newGenes = [{ id: "g1", geneType: {} as any, geneModification: () => { } }];

        animal.updateGenes(newGenes);

        expect(animal.genes).toEqual(newGenes);
    });

    it("should not change genes when undefined", () => {
        const originalGenes = [{ id: "g1", geneType: {} as any, geneModification: () => { } }];
        const animal = AnimalFactory.createGeneric({ genes: originalGenes });

        animal.updateGenes();

        expect(animal.genes).toEqual(originalGenes);
    });
});

describe("LivingEntity.die", () => {
    it("should set animal state to DEAD", () => {
        const animal = AnimalFactory.createGeneric({ entityStates: [AnimalStates.NORMAL] });

        animal.die();

        expect(animal.entityStates).toContain(AnimalStates.DEAD);
    });

    it("should set plant state to WITHERED", () => {
        const plant = PlantFactory.createGeneric({ entityStates: [PlantStates.MATURE] });

        plant.die();

        expect(plant.entityStates).toContain(PlantStates.WITHERED);
    });
});

describe("LivingEntity.isOfType", () => {
    it("should return true when entity type matches", () => {
        const animal = AnimalFactory.createGeneric();

        const result = LivingEntity.isOfType(animal, LivingEntitiesTypes.ANIMAL);

        expect(result).toBe(true);
    });

    it("should return false when entity type does not match", () => {
        const plant = PlantFactory.createGeneric();

        const result = LivingEntity.isOfType(plant, LivingEntitiesTypes.ANIMAL);

        expect(result).toBe(false);
    });
});

describe("LivingEntity.removeState", () => {
    it("should remove an existing state", () => {
        const animal = AnimalFactory.createGeneric({
            entityStates: [AnimalStates.NORMAL, AnimalStates.HUNGRY]
        });

        animal.removeState([AnimalStates.HUNGRY]);

        expect(animal.entityStates).not.toContain(AnimalStates.HUNGRY);
        expect(animal.entityStates).toContain(AnimalStates.NORMAL);
    });

    it("should do nothing when state is not present", () => {
        const animal = AnimalFactory.createGeneric({
            entityStates: [AnimalStates.NORMAL]
        });

        expect(() => animal.removeState([AnimalStates.HUNGRY])).not.toThrow();
        expect(animal.entityStates).toEqual([AnimalStates.NORMAL]);
    });

    it("should throw when states is null", () => {
        const animal = AnimalFactory.createGeneric();

        expect(() => animal.removeState(null as any))
            .toThrow("States array is required but was null or undefined");
    });
});