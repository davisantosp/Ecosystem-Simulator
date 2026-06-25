import { Gene } from "../../shared/types/Gene";
import { EntityState } from "../enums/states_enums/EntityState";
import { Position } from "../../shared/types/Position";
import { LivingEntitiesTypes } from "../enums/entities_enums/LivingEntitiesTypes";
import { ID } from "../../shared/types/ID";
import { ST } from "../../shared/types/ST";
import { LivingEntityActionsInterface } from "../../shared/actions_interfaces/LivingEntityActionsInterface";
import { PlantStates } from "../enums/states_enums/PlantStates";
import { AnimalStates } from "../enums/states_enums/AnimalStates";

export abstract class LivingEntity implements LivingEntityActionsInterface {
    constructor(
        public readonly id: ID,
        public position: Position,
        public readonly entityType: LivingEntitiesTypes,

        public lifespan: ST,
        public genes: Gene[],
        public entityStates: EntityState[]
    ) { }

    update(): void {
        throw new Error("No implementation for abstract classes");
    }
    getNutritionalValue(): number {
        throw new Error("No implementation for abstract classes");
    }

    updateState(states: EntityState[]): void {
        if (!states) throw new Error("States array is required but was null or undefined");
        for (const state of states) {
            if (!this.entityStates.includes(state))
                this.entityStates.push(state)
        }
    }
    updateGenes(genes?: Gene[]): void {
        if (genes)
            this.genes = genes;
    }
    die(): void {
        if (this.entityType === LivingEntitiesTypes.PLANT)
            this.updateState([PlantStates.WITHERED]);
        if (this.entityType === LivingEntitiesTypes.ANIMAL)
            this.updateState([AnimalStates.DEAD]);
    }


    static isOfType(livingEntity: LivingEntity, entityType: LivingEntitiesTypes): boolean {
        return (livingEntity.entityType == entityType)
    }

}