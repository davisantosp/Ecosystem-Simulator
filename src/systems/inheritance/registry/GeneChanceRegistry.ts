import { GeneTypes } from "../../../domain/enums";

export const GeneChanceRegistry: Readonly<Record<GeneTypes, number>> = {
    [GeneTypes.LIFESPAN_GENE]: 0.7,
    [GeneTypes.SPEED_GENE]: 0.7,
    [GeneTypes.VISION_GENE]: 0.7,
    [GeneTypes.HUNGER_MAX_GENE]: 0.7,
    [GeneTypes.THIRST_MAX_GENE]: 0.7,
    [GeneTypes.DIET_SHIFT_GENE]: 0.1,   // raro — muda dieta
    [GeneTypes.GROWTH_RATE_GENE]: 0.7,
    [GeneTypes.NUTRITIONAL_VALUE_MAX_GENE]: 0.7,
    [GeneTypes.RARE_PLANT_GENE]: 0.05,  // muito raro
    [GeneTypes.VENOMOUS_PLANT_GENE]: 0.1,
};

export const MUTATION_CHANCE = 0.05; // 5% de chance de surgir um gene novo