import { AnimalSpecies, LivingEntitiesTypes, DietTypes } from "../../domain/enums";

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