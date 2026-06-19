import { AnimalSpecies } from "../enums/entities_enums/AnimalSpecies";
import { ST } from "../../shared/types/ST";
import { Distance } from "../../shared/types/Distance";
import { MovementSpeed } from "../../shared/types/MovementSpeed";
import { LivingEntity } from "./LivingEntity";
import { AnimalActions } from "../enums/actions_enums/AnimalActions";
import { Position } from "../../shared/types/Position";
import { Gene } from "../../shared/types/Gene";
import { EntityState } from "../enums/states_enums/EntityState";
import { LivingEntitiesTypes } from "../enums/entities_enums/LivingEntitiesTypes";
import { ID } from "../../shared/types/ID";
import { Diet } from "../../shared/types/Diet";

export class Animal extends LivingEntity {
    constructor(
        id: ID,
        position: Position,

        lifespan: ST,
        genes: Gene[],
        entityState: EntityState[],

        public readonly animalSpecie: AnimalSpecies,
        public hunger: ST,
        public thirst: ST,
        public procreate: ST,
        public currentAction: AnimalActions,
        public diet: Diet,
        public speed: MovementSpeed,
        public visionRadius: Distance
    ) {
        super(
            id,
            position,
            LivingEntitiesTypes.ANIMAL,
            lifespan,
            genes,
            entityState
        );
    }
}