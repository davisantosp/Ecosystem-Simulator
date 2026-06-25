import { Plant } from "../../src/domain/entities/Plant";
import { PlantSpecies } from "../../src/domain/enums/entities_enums/PlantSpecies";
import { PlantStates } from "../../src/domain/enums/states_enums/PlantStates";
import { Random } from "../../src/systems/systems_functions/Random";

export class PlantFactory {
    static createGeneric(overrides?: Partial<Plant>): Plant {
        const defaultPlant = new Plant(
            Random.generateID(),
            { x: 0, y: 0 },
            { current: 100, max: 100 },
            [],
            [PlantStates.MATURE],
            PlantSpecies.COMMON,
            { current: 10 },
            { current: 0, max: 100 },
        );
        return Object.assign(defaultPlant, overrides);
    }

    static createCommonPlant(overrides?: Partial<Plant>): Plant {
        const newCommonPlant = new Plant(
            Random.generateID(),
            { x: 0, y: 0 },
            { current: 250, max: 250 },
            [],
            [PlantStates.MATURE],
            PlantSpecies.COMMON,
            { current: 25 },
            { current: 0, max: 150 },
        );
        return Object.assign(newCommonPlant, overrides);
    }

    static createVenomousPlant(overrides?: Partial<Plant>): Plant {
        const newVenomousPlant = new Plant(
            Random.generateID(),
            { x: 0, y: 0 },
            { current: 250, max: 250 },
            [],
            [PlantStates.MATURE],
            PlantSpecies.VENOMOUS,
            { current: 25 },
            { current: 0, max: 50 },
        );
        return Object.assign(newVenomousPlant, overrides);
    }

    static createRarePlant(overrides?: Partial<Plant>): Plant {
        const newRarePlant = new Plant(
            Random.generateID(),
            { x: 0, y: 0 },
            { current: 250, max: 250 },
            [],
            [PlantStates.MATURE],
            PlantSpecies.RARE,
            { current: 250 },
            { current: 0, max: 500 },
        );
        return Object.assign(newRarePlant, overrides);
    }
}