export type StatKey = "hunger" | "thirst" | "procreation";

export type StrategyPriorityEntry = {
    statKey: StatKey;
    priorityWeight: number;
};

export const strategyPriorityRegistry = new Map<string, StrategyPriorityEntry>([
    ["SearchFood", { statKey: "hunger", priorityWeight: 2 }],
    ["SearchWater", { statKey: "thirst", priorityWeight: 3 }],
    ["MoveToProcreate", { statKey: "procreation", priorityWeight: 1 }],
]);