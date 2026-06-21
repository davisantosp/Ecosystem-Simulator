import { SearchFood } from "./animal_movements/SearchFood";
import { SearchWater } from "./animal_movements/SearchWater";
import { MoveToProcreate } from "./animal_movements/MoveToProcreate";

export type StatKey = "hunger" | "thirst" | "procreate";

export type StrategyEntry = {
    statKey: StatKey;
    priorityWeight: number;
};

export const strategyStatMap = new Map<Function, StrategyEntry>([
    [SearchFood, { statKey: "hunger", priorityWeight: 2 }],
    [SearchWater, { statKey: "thirst", priorityWeight: 3 }],
    [MoveToProcreate, { statKey: "procreate", priorityWeight: 1 }],
]);
