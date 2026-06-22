import { World } from "../../src/core/World";
import { Animal } from "../../src/domain/entities/Animal";
import { LivingEntity } from "../../src/domain/entities/LivingEntity";
import { Plant } from "../../src/domain/entities/Plant";
import { AnimalSpecies } from "../../src/domain/enums/entities_enums/AnimalSpecies";
import { DietTypes } from "../../src/domain/enums/other_enums/DietTypes";
import { AnimalStates } from "../../src/domain/enums/states_enums/AnimalStates";
import { Random } from "../../src/systems/systems_functions/Random";

export class AnimalFactory {
    static createGeneric(overrides?: Partial<Animal>): Animal {
        const defaultAnimal = new Animal(
            Random.generateID(),
            { x: 0, y: 0 },
            { current: 100, max: 100 },
            [],
            [AnimalStates.NORMAL],
            AnimalSpecies.RABBIT, // Espécie neutra padrão
            { current: 50, max: 50 },
            { current: 50, max: 50 },
            { current: 50, max: 50 },
            { type: DietTypes.HERBIVORE, food: [] },
            1,
            1
        );
        return Object.assign(defaultAnimal, overrides);
    }

    static createWolf(overrides?: Partial<Animal>): Animal {
        const newWolf = new Animal(
            Random.generateID(),
            { x: 0, y: 0 },
            { current: 250, max: 250 },
            [],
            [AnimalStates.NORMAL],
            AnimalSpecies.WOLF,
            { current: 50, max: 50 },
            { current: 50, max: 50 },
            { current: 50, max: 50 },
            { type: DietTypes.CARNIVORE, food: [Animal as unknown as LivingEntity] },
            5,
            10
        );
        return Object.assign(newWolf, overrides);
    }

    static createRabbit(overrides?: Partial<Animal>): Animal {
        const newRabbit = new Animal(
            Random.generateID(),
            { x: 0, y: 0 },
            { current: 150, max: 150 },
            [],
            [AnimalStates.NORMAL],
            AnimalSpecies.RABBIT,
            { current: 25, max: 25 },
            { current: 25, max: 25 },
            { current: 50, max: 50 },
            { type: DietTypes.HERBIVORE, food: [Plant as unknown as LivingEntity] },
            2,
            4
        );
        return Object.assign(newRabbit, overrides);
    }

    static createMoose(overrides?: Partial<Animal>): Animal {
        const newMoose = new Animal(
            Random.generateID(),
            { x: 0, y: 0 },
            { current: 300, max: 300 },
            [],
            [AnimalStates.NORMAL],
            AnimalSpecies.MOOSE,
            { current: 75, max: 75 },
            { current: 75, max: 75 },
            { current: 125, max: 125 },
            { type: DietTypes.HERBIVORE, food: [Plant as unknown as LivingEntity] },
            4,
            8
        );
        return Object.assign(newMoose, overrides);
    }
}