import { AmbienceState } from "../states/AmbienceState";
import { AnimalState } from "../states/AnimalState";
import { PlantState } from "../states/PlantState";

export type EntityState =
    AmbienceState |
    PlantState |
    AnimalState;
