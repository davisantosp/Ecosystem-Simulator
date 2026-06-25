import { AnimalSpecies } from "../../domain/enums/entities_enums/AnimalSpecies";
import { LivingEntitiesTypes } from "../../domain/enums/entities_enums/LivingEntitiesTypes";
import { DietTypes } from "../../domain/enums/other_enums/DietTypes";

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