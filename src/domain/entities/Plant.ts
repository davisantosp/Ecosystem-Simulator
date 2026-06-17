import { PlantSpecies } from "../enums/entities_types/PlantSpecies";
import { PlantState } from "../enums/states/PlantState";
import { ST } from "../../shared/types/ST";
import { LivingEntity } from "./LivingEntity";

export interface Plant extends LivingEntity {
    growthRate: ST;
    nutritionalValue: ST;
    plantSpecies: PlantSpecies;
}