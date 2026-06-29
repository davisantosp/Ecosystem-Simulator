import { Gene } from "../../shared/types/Gene";
import { EntityState, LivingEntitiesTypes } from "../enums";
import { Position } from "../../shared/types/Position";
import { ID } from "../../shared/types/ID";
import { StatValue } from "../../shared/types/StatValue";
import { LivingEntityActionsInterface } from "../../shared/interfaces/LivingEntityActionsInterface";

export abstract class LivingEntity implements LivingEntityActionsInterface {
    constructor(
        public readonly id: ID,
        public position: Position,
        public readonly entityType: LivingEntitiesTypes,

        public lifespan: StatValue,
        public genes: Gene[],
        public entityStates: EntityState[]
    ) { }

    abstract update(): void;
    abstract getNutritionalValue(): number;
    abstract die(): void;

    updateState(states: EntityState[]): void {
        if (!states) throw new Error("States array is required but was null or undefined");
        for (const state of states) {
            if (!this.entityStates.includes(state))
                this.entityStates.push(state)
        }
    }
    removeState(states: EntityState[]): void {
        if (!states) throw new Error("States array is required but was null or undefined");
        this.entityStates = this.entityStates.filter(s => !states.includes(s));
    }
    updateGenes(genes?: Gene[]): void {
        if (genes)
            this.genes = genes;
    }

    static isOfType(livingEntity: LivingEntity, entityType: LivingEntitiesTypes): boolean {
        return (livingEntity.entityType == entityType)
    }

}