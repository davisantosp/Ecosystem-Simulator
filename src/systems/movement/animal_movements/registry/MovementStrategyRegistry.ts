import { AnimalStates, EntityState } from "../../../../domain/enums";
import { MovementStrategyInterface } from "../../MovementStrategyInterface";
import { MoveToProcreate } from "../MoveToProcreate";
import { RandomlyMove } from "../RandomlyMove";
import { SearchFood } from "../SearchFood";
import { SearchWater } from "../SearchWater";

export type MovementStrategyMapping = {
    state: EntityState,
    strategy: MovementStrategyInterface
};

let cachedRegistry: MovementStrategyMapping[] | null = null;

export function getMovementStrategies(): MovementStrategyMapping[] {
    if (!cachedRegistry) {
        cachedRegistry = [
            { state: AnimalStates.NORMAL, strategy: new RandomlyMove() },
            { state: AnimalStates.HUNGRY, strategy: new SearchFood() },
            { state: AnimalStates.THIRSTY, strategy: new SearchWater() },
            { state: AnimalStates.PROCREATING_SEASON, strategy: new MoveToProcreate() }
        ];
    }
    return cachedRegistry;
}