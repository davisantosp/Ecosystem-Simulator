import { Position } from "../../shared/types/Position";
import { AmbienceType } from "../enums/entities_types/AmbienceType";
import { AmbienceState } from "../enums/states/AmbienceState";

export class Ambience {
    constructor(
        public id: string,
        public type: AmbienceType,
        public state: AmbienceState,
        public occupyingEntityId: string | null,
        public position: Position,
    ) { }
}