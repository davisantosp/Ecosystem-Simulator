import { AnimalStates } from "../../../../domain/enums/states_enums/AnimalStates";
import { EntityState } from "../../../../domain/enums/states_enums/EntityState";
import { MovementStrategyInterface } from "../../MovementStrategyInterface";
import { MoveToProcreate } from "../MoveToProcreate";
import { RandomlyMove } from "../RandomlyMove";
import { SearchFood } from "../SearchFood";
import { SearchWater } from "../SearchWater";

export type MovementStrategyMapping = {
    state: EntityState,
    strategy: MovementStrategyInterface
};

export const movementStrategyRegistry: MovementStrategyMapping[] = [
    { state: AnimalStates.NORMAL, strategy: new RandomlyMove() },
    { state: AnimalStates.HUNGRY, strategy: new SearchFood() },
    { state: AnimalStates.THIRSTY, strategy: new SearchWater() },
    { state: AnimalStates.PROCREATING_SEASON, strategy: new MoveToProcreate() }
];