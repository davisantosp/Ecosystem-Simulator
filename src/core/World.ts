import { LivingEntity } from "../domain/entities/LivingEntity";
import { Distance } from "../shared/types/Distance";
import { Position } from "../shared/types/Position";

export class World {
    constructor(
        private readonly width: Distance,
        private readonly height: Distance,
        public livingEntities?: LivingEntity[],
    ) {
    }

    public isValidPosition(position: Position): boolean {
        return position.x >= 0
            && position.x < this.width
            && position.y >= 0
            && position.y < this.height;
    }

}