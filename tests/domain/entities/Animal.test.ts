import { Animal } from "../../../src/domain/entities/Animal";
import { LivingEntity } from "../../../src/domain/entities/LivingEntity";
import { AnimalSpecies } from "../../../src/domain/enums/entities_enums/AnimalSpecies";
import { AnimalStates } from "../../../src/domain/enums/states_enums/AnimalStates";
import { PlantStates } from "../../../src/domain/enums/states_enums/PlantStates";
import { PlantFactory } from "../../factories/PlantFactory";
import { AnimalFactory } from "../../factories/AnimalFactory";

describe("Animal.getNutritionalValue", () => {
    it("should return a numeric value based on species", () => {
        const rabbit = AnimalFactory.createRabbit();

        const value = rabbit.getNutritionalValue();

        expect(value).toBeGreaterThan(0);
    });
});

describe("Animal.eat", () => {
    it("should increase hunger when eating a plant", () => {
        const animal = AnimalFactory.createRabbit({
            hunger: { current: 10, max: 100 },
            entityStates: [AnimalStates.HUNGRY],
        });
        const plant = PlantFactory.createCommonPlant({ nutritionalValue: { current: 30, max: 100 } });

        animal.eat(plant);

        expect(animal.hunger.current).toBeGreaterThan(10);
    });

    it("should not exceed max hunger", () => {
        const animal = AnimalFactory.createRabbit({
            hunger: { current: 90, max: 100 },
            entityStates: [AnimalStates.HUNGRY],
        });
        const plant = PlantFactory.createCommonPlant({ nutritionalValue: { current: 50, max: 100 } });

        animal.eat(plant);

        expect(animal.hunger.current).toBeLessThanOrEqual(100);
    });

    it("should kill the food entity after eating", () => {
        const animal = AnimalFactory.createRabbit({ hunger: { current: 10, max: 100 } });
        const plant = PlantFactory.createCommonPlant({ entityStates: [PlantStates.MATURE] });

        animal.eat(plant);

        expect(plant.entityStates).toContain(PlantStates.WITHERED);
    });

    it("should throw when food is null", () => {
        const animal = AnimalFactory.createRabbit();

        expect(() => {
            animal.eat(null as any);
        }).toThrow("Food is required");
    });

    it("should add hunger without cap when max is undefined", () => {
        const animal = AnimalFactory.createRabbit({
            hunger: { current: 10 } as any,
        });
        const plant = PlantFactory.createCommonPlant({ nutritionalValue: { current: 30, max: 100 } });

        animal.eat(plant);

        expect(animal.hunger.current).toBe(40);
    });
});
