import { LivingEntity } from "../../../src/domain/entities/LivingEntity";
import { LivingEntitiesTypes, AnimalStates } from "../../../src/domain/enums";
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

describe("LivingEntity.removeState", () => {
    it("should remove specified states", () => {
        const animal = AnimalFactory.createGeneric({
            entityStates: [AnimalStates.NORMAL, AnimalStates.HUNGRY],
        });

        animal.removeState([AnimalStates.NORMAL]);

        expect(animal.entityStates).not.toContain(AnimalStates.NORMAL);
        expect(animal.entityStates).toContain(AnimalStates.HUNGRY);
    });

    it("should throw when states is null", () => {
        const animal = AnimalFactory.createGeneric();

        expect(() => {
            animal.removeState(null as any);
        }).toThrow("States array is required but was null or undefined");
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
