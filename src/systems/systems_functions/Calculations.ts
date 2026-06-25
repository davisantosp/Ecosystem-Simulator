import { Animal } from "../../domain/entities/Animal";
import { Position } from "../../shared/types/Position";
import { MovementStrategyInterface } from "../movement/MovementStrategyInterface";
import { strategyStatMap } from "../movement/strategyStatMap";

export class Calculations {
    static distanceBetween(position1: Position, position2: Position): number {
        const x1 = position1.x;
        const y1 = position1.y;
        const x2 = position2.x;
        const y2 = position2.y;

        return Math.ceil(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    }

    static utilityScore(animal: Animal, strategy: MovementStrategyInterface): number {
        const entry = strategyStatMap.get(strategy.constructor);
        if (!entry) return 0;

        const st = animal[entry.statKey];
        if (typeof st === "number")
            return entry.priorityWeight * (1 / (st + 1));

        if (st.max === 0) return 0;

        const urgencyRatio = 1 - (st.current / st.max);
        return entry.priorityWeight * urgencyRatio;
    }
}