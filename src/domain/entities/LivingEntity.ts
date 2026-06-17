import { EntityState } from "../enums/other/EntityState";
import { Gene } from "../../shared/types/Gene";
import { Position } from "../../shared/types/Position";
import { LivingEntitiesType } from "../enums/entities_types/LivingEntitiesType";
import { Animal } from "./Animal";
import { Plant } from "./Plant";

export interface LivingEntity {
    id: string;
    currentLifespan: number;
    maxLifespan: number;
    genes: Gene[];
    position: Position;
    entityType: LivingEntitiesType;
    entityState: EntityState;
}