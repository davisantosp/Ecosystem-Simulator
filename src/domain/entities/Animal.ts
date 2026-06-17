import { AnimalState } from "../enums/states/AnimalState";
import { AnimalSpecies } from "../enums/entities_types/AnimalSpecies";
import { Diet } from "../enums/other/Diet";
import { Gene } from "../../shared/types/Gene";
import { Position } from "../../shared/types/Position";
import { ST } from "../../shared/types/ST";
import { AnimalActions } from "../enums/states/AnimalActions";

export interface Animal {
    id: string;
    hunger: ST;
    thirst: ST;
    procreatingSeason: ST;
    lifeSpan: ST;
    animalState: AnimalState;
    animalSpecie: AnimalSpecies;
    currentAction: AnimalActions;
    diet: Diet;
    genes: Gene[];
    position: Position;
}