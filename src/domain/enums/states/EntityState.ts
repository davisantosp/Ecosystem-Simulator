import { TerrainStates } from "./TerrainStates";
import { AnimalStates } from "./AnimalStates";
import { PlantStates } from "./PlantStates";

export type EntityState =
    TerrainStates |
    PlantStates |
    AnimalStates;
