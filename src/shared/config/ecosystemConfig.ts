import { AnimalSpecies, LivingEntitiesTypes, DietTypes, GeneTypes } from "../../domain/enums";
import { Interval } from "../types/Interval";

// O Readonly garante que ninguém altere o mapa em tempo de execução
export const DIET_FOOD_PREFERENCE_MAP: Readonly<Record<DietTypes, LivingEntitiesTypes | LivingEntitiesTypes[]>> = {
    [DietTypes.CARNIVORE]: LivingEntitiesTypes.ANIMAL,
    [DietTypes.HERBIVORE]: LivingEntitiesTypes.PLANT,
    [DietTypes.OMNIVORE]: [LivingEntitiesTypes.ANIMAL, LivingEntitiesTypes.PLANT],
};

export const ANIMAL_NUTRITIONAL_VALUE_MAP: Record<AnimalSpecies, number> = {
    [AnimalSpecies.RABBIT]: 100,
    [AnimalSpecies.WOLF]: 200,
    [AnimalSpecies.MOOSE]: 400
};

export const ANIMAL_STATE_THRESHOLDS = {
    HUNGER_CRITICAL: 0.4,
    THIRST_CRITICAL: 0.4,
    PROCREATION_READY: 0.3,
} as const;

export const GENE_VALUE_INTERVAL_MAP: Readonly<Record<GeneTypes, Interval | null>> = {
    [GeneTypes.LIFESPAN_GENE]: { start: 50, end: 500 },

    [GeneTypes.VISION_GENE]: { start: 1, end: 15 },
    [GeneTypes.SPEED_GENE]: { start: 1, end: 10 },
    [GeneTypes.HUNGER_MAX_GENE]: { start: 25, end: 250 },
    [GeneTypes.THIRST_MAX_GENE]: { start: 25, end: 250 },

    [GeneTypes.GROWTH_RATE_GENE]: { start: 10, end: 1000 },
    [GeneTypes.NUTRITIONAL_VALUE_MAX_GENE]: { start: 100, end: 1000 },

    [GeneTypes.DIET_SHIFT_GENE]: null,
    [GeneTypes.RARE_PLANT_GENE]: null,
    [GeneTypes.VENOMOUS_PLANT_GENE]: null
};

export const SPREAD_CHANCE = 0.05