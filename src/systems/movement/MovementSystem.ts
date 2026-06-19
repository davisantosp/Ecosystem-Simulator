import { World } from "../../core/World";
import { Animal } from "../../domain/entities/Animal";
import { Calculations } from "../systems_functions/Calculations";
import { RandomlyMove } from "./animal_movements/RandomlyMove";
import { MovementStrategyInterface } from "./MovementStrategyInterface";
import { movementStrategyMap } from "./MovementStrategyMap";

export class MovementSystem {
    static moveEntity(animal: Animal, world: World): void {
        const entityNextMovement = this.chooseNextMovement(animal);
        try {
            if (entityNextMovement.entityMove(animal, world))
                return;
        } catch (error: any) {
            throw new Error("Movement Fail");
        }
    }

    private static chooseNextMovement(animal: Animal): MovementStrategyInterface {
        if (!animal) throw new Error("Entity doesn't exist");

        const movementToDo: MovementStrategyInterface[] = [];

        for (const state of animal.entityStates) {
            const movement = movementStrategyMap.find(x => x.state === state);
            if (!movement?.strategy) {
                return new RandomlyMove();
            }
            movementToDo.push(movement.strategy);
        }
        if (!movementToDo) {
            throw new Error("No movements available");
        }
        return this.mostPriorityMovement(animal, movementToDo);
    }

    private static mostPriorityMovement(animal: Animal, strategies: MovementStrategyInterface[]): MovementStrategyInterface {
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
        if (!strategyAndPriorityMap || strategyAndPriorityMap === undefined)
            throw new Error("No strategies found to select");

        // Last value is the most priority one
        const sortedMap = strategyAndPriorityMap.sort((a, b) => a.priority - b.priority);
        return sortedMap.at(-1)!.strategy;
    }
}