import { Gene } from "../../shared/types/Gene";
import { EntityState } from "../enums/states_enums/EntityState";
import { Position } from "../../shared/types/Position";
import { LivingEntitiesTypes } from "../enums/entities_enums/LivingEntitiesTypes";
import { ID } from "../../shared/types/ID";
import { ST } from "../../shared/types/ST";

export abstract class LivingEntity {
    constructor(
        public readonly id: ID,
        public position: Position,
        public readonly entityType: LivingEntitiesTypes,

        public lifespan: ST,
        public genes: Gene[],
        public entityStates: EntityState[]
    ) { }
}