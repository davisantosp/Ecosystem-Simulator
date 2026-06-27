import { Position } from "../../shared/types/Position";
export class Calculations {
    static distanceBetween(position1: Position, position2: Position): number {
        const x1 = position1.x;
        const y1 = position1.y;
        const x2 = position2.x;
        const y2 = position2.y;

        return Math.ceil(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    }
}