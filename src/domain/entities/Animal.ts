import { AnimalState } from "../enums/states/AnimalState";
import { AnimalSpecies } from "../enums/entities_types/AnimalSpecies";
import { Diet } from "../enums/other/Diet";
import { ST } from "../../shared/types/ST";
import { AnimalActions } from "../enums/other/AnimalActions";
import { Distance } from "../../shared/types/Distance";
import { MovementSpeed } from "../../shared/types/MovementSpeed";
import { LivingEntity } from "./LivingEntity";

export interface Animal extends LivingEntity {
    hunger: ST;
    thirst: ST;
    procreate: ST;
    animalSpecie: AnimalSpecies;
    currentAction: AnimalActions;
    diet: Diet;
    speed: MovementSpeed;
    visionRadius: Distance;
}