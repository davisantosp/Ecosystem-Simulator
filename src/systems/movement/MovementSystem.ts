import { World } from "../../core/World";
import { Animal } from "../../domain/entities/Animal";
import { Calculations } from "../systems_functions/Calculations";
import { RandomlyMove } from "./animal_movements/RandomlyMove";
import { MovementStrategyInterface } from "./MovementStrategyInterface";
import { movementStrategyMap } from "./MovementStrategyMap";

export class MovementSystem {
    static moveEntity(animal: Animal, world: World): void {
        const orderedMovements = this.chooseNextMovements(animal);

        for (const strategy of orderedMovements) {
            try {
                if (strategy.entityMove(animal, world))
                    return;
            } catch (error: any) {
                console.error(`Falha ao executar a estratégia: ${strategy.constructor.name}`, error);
            }
        }

        new RandomlyMove().entityMove(animal, world);
    }

    private static chooseNextMovements(animal: Animal): MovementStrategyInterface[] {
        if (!animal) throw new Error("Entity doesn't exist");

        const movementToDo: MovementStrategyInterface[] = [];

        for (const state of animal.entityStates) {
            const movement = movementStrategyMap.find(x => x.state === state);
            if (!movement?.strategy) {
                continue;
            }
            movementToDo.push(movement.strategy);
        }
        if (movementToDo.length === 0) {
            return [new RandomlyMove()];
        }
        return this.sortMovementsByPriority(animal, movementToDo);
    }

    private static sortMovementsByPriority(animal: Animal, strategies: MovementStrategyInterface[]): MovementStrategyInterface[] {
        type StrategyAndPriority = {
            strategy: MovementStrategyInterface,
            priority: number
        }

        const strategyAndPriorityMap: StrategyAndPriority[] = [];
        for (const strategy of strategies) {
            const temp: StrategyAndPriority = {
                strategy: strategy,
                priority: Calculations.utilityScore(animal, strategy)
            };
            if (!temp) throw new Error("Error assigning priorities");

            strategyAndPriorityMap.push(temp);
        }

        // Reversed
        const sortedMap = strategyAndPriorityMap.sort((a, b) => b.priority - a.priority);
        return sortedMap.map(x => x.strategy);
    }
}