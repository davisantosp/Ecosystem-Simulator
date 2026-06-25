import { EntityState } from "../../domain/enums/states_enums/EntityState";
import { Gene } from "../types/Gene";

export interface LivingEntityActionsInterface {
    getNutritionalValue(): number;
    updateState(states: EntityState[]): void;
    removeState(states: EntityState[]): void;
    updateGenes(genes?: Gene[]): void;
    die(): void;
}