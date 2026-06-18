import { Gene } from "../../shared/types/Gene";
import { EntityState } from "../enums/states_enums/EntityState";
import { Position } from "../../shared/types/Position";
import { LivingEntitiesTypes } from "../enums/entities_enums/LivingEntitiesTypes";
import { ID } from "../../shared/types/ID";

export abstract class LivingEntity {
    constructor(
        public readonly id: ID,
        public position: Position,
        public readonly entityType: LivingEntitiesTypes,

        public currentLifespan: number,
        public maxLifespan: number,
        public genes: Gene[],
        public entityState: EntityState[]
    ) { }
}