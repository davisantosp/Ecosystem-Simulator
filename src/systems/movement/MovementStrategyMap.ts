// c:\Users\david\Desktop\Area\Matérias Unifesp (3rd semester)\POO\Projeto POO\src\systems\movement\MovementStrategyMap.ts
import { EntityState } from "../../domain/enums/states_enums/EntityState";
import { AnimalStates } from "../../domain/enums/states_enums/AnimalStates";
import { MovementStrategyInterface } from "./MovementStrategyInterface";
import { RandomlyMove } from "./animal_movements/RandomlyMove";
import { SearchFood } from "./animal_movements/SearchFood";
import { SearchWater } from "./animal_movements/SearchWater";
import { MoveToProcreate } from "./animal_movements/MoveToProcreate";

export type MovementStrategyMap = {
    state: EntityState,
    strategy: MovementStrategyInterface
};

export const movementStrategyMap: MovementStrategyMap[] = [
    {
        state: AnimalStates.NORMAL,
        strategy: new RandomlyMove()
    },
    {
        state: AnimalStates.HUNGRY,
        strategy: new SearchFood()
    },
    {
        state: AnimalStates.THIRSTY,
        strategy: new SearchWater()
    },
    {
        state: AnimalStates.PROCREATING_SEASON,
        strategy: new MoveToProcreate()
    }
];
