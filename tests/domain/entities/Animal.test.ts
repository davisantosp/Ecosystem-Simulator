import { Animal } from "../../../src/domain/entities/Animal";
import { AnimalSpecies } from "../../../src/domain/enums/entities_enums/AnimalSpecies";
import { AnimalStates } from "../../../src/domain/enums/states_enums/AnimalStates";
import { PlantStates } from "../../../src/domain/enums/states_enums/PlantStates";
import { World } from "../../../src/core/World";
import { PlantFactory } from "../../factories/PlantFactory";
import { AnimalFactory } from "../../factories/AnimalFactory";
import { CoreFactory } from "../../factories/CoreFactory";

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
        });
        const plant = PlantFactory.createCommonPlant({ nutritionalValue: { current: 50, max: 100 } });

        animal.eat(plant);

        expect(animal.hunger.current).toBeLessThanOrEqual(100);
    });

    it("should kill the food entity after eating", () => {
        const animal = AnimalFactory.createRabbit({ hunger: { current: 10, max: 100 } });
        const plant = PlantFactory.createCommonPlant({ entityStates: [], nutritionalValue: { current: 10, max: 100 } });

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

describe("Animal.drink", () => {
    it("should fill thirst to max", () => {
        const animal = AnimalFactory.createRabbit({
            thirst: { current: 10, max: 100 },
        });

        animal.drink();

        expect(animal.thirst.current).toBe(100);
    });

    it("should work when max is undefined", () => {
        const animal = AnimalFactory.createRabbit({
            thirst: { current: 10 } as any,
        });

        animal.drink();

        expect(animal.thirst.current).toBe(100);
    });
});

describe("Animal.die", () => {
    it("should add DEAD state", () => {
        const animal = AnimalFactory.createRabbit({ entityStates: [AnimalStates.NORMAL] });

        animal.die();

        expect(animal.entityStates).toContain(AnimalStates.DEAD);
    });
});

describe("Animal.update", () => {
    let world: World;

    beforeEach(() => {
        world = CoreFactory.createWorld({ width: 20, height: 20 });
    });

    it("should decrement lifespan each tick", () => {
        const animal = AnimalFactory.createRabbit({ lifespan: { current: 10, max: 10 } });

        animal.update(world);

        expect(animal.lifespan.current).toBe(9);
    });

    it("should decrement hunger each tick", () => {
        const animal = AnimalFactory.createRabbit({ hunger: { current: 50, max: 100 } });

        animal.update(world);

        expect(animal.hunger.current).toBe(49);
    });

    it("should decrement thirst each tick", () => {
        const animal = AnimalFactory.createRabbit({ thirst: { current: 50, max: 100 } });

        animal.update(world);

        expect(animal.thirst.current).toBe(49);
    });

    it("should die when lifespan reaches zero", () => {
        const animal = AnimalFactory.createRabbit({
            lifespan: { current: 1, max: 10 },
            entityStates: [AnimalStates.NORMAL],
        });

        animal.update(world);

        expect(animal.entityStates).toContain(AnimalStates.DEAD);
    });

    it("should throw when world is not provided", () => {
        const animal = AnimalFactory.createRabbit();

        expect(() => {
            (animal as any).update();
        }).toThrow("World not created");
    });
});

describe("Animal.syncStates", () => {
    it("should add HUNGRY state when hunger ratio is low", () => {
        const animal = AnimalFactory.createRabbit({
            hunger: { current: 10, max: 100 },
            entityStates: [],
        });

        (animal as any).syncStates();

        expect(animal.entityStates).toContain(AnimalStates.HUNGRY);
    });

    it("should remove HUNGRY state when hunger ratio is adequate", () => {
        const animal = AnimalFactory.createRabbit({
            hunger: { current: 80, max: 100 },
            entityStates: [AnimalStates.HUNGRY],
        });

        (animal as any).syncStates();

        expect(animal.entityStates).not.toContain(AnimalStates.HUNGRY);
    });

    it("should add THIRSTY state when thirst ratio is low", () => {
        const animal = AnimalFactory.createRabbit({
            thirst: { current: 10, max: 100 },
            entityStates: [],
        });

        (animal as any).syncStates();

        expect(animal.entityStates).toContain(AnimalStates.THIRSTY);
    });

    it("should remove THIRSTY state when thirst ratio is adequate", () => {
        const animal = AnimalFactory.createRabbit({
            thirst: { current: 80, max: 100 },
            entityStates: [AnimalStates.THIRSTY],
        });

        (animal as any).syncStates();

        expect(animal.entityStates).not.toContain(AnimalStates.THIRSTY);
    });
});
