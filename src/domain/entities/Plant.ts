import { PlantSpecies } from "../enums/entities_types/PlantSpecies";
import { PlantState } from "../enums/states/PlantState";
import { Gene } from "../../shared/types/Gene";
import { Position } from "../../shared/types/Position";
import { ST } from "../../shared/types/ST";

export interface Plant {
    id: string;
    lifespan: ST;
    growthRate: ST;
    foodProduction: ST;
    plantState: PlantState;
    plantSpecies: PlantSpecies;
    genes: Gene[];
    position: Position;
}