import { Position } from "../shared/types/Position";

export class World {
    constructor(
        private readonly width: number,
        private readonly height: number,
    ) {
    }

    public isValidPosition(position: Position): boolean {
        return position.x >= 0
            && position.x < this.width
            && position.y >= 0
            && position.y < this.height;
    }

}