import { PlantSpecies } from "../enums/entities_enums/PlantSpecies";
import { PlantStates } from "../enums/states_enums/PlantStates";
import { ST } from "../../shared/types/ST";
import { LivingEntity } from "./LivingEntity";
import { Position } from "../../shared/types/Position";
import { Gene } from "../../shared/types/Gene";
import { EntityState } from "../enums/states_enums/EntityState";
import { LivingEntitiesTypes } from "../enums/entities_enums/LivingEntitiesTypes";
import { ID } from "../../shared/types/ID";

export class Plant extends LivingEntity {
    constructor(
        id: ID,
        position: Position,

        lifespan: ST,
        genes: Gene[],
        entityState: EntityState[],

        public readonly plantSpecies: PlantSpecies,
        public growthRate: ST,
        public nutritionalValue: ST,
    ) {
        super(
            id,
            position,
            LivingEntitiesTypes.PLANT,
            lifespan, genes, entityState
        );
    }
}