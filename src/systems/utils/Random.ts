import { World } from "../../core/World";
import { ID } from "../../shared/types/ID";
import { Position } from "../../shared/types/Position";

export class Random {
    static generateID(): ID {
        return crypto.randomUUID();
    }

    static generatePosition(world?: World): Position {
        if (world && world !== undefined) {
            while (true) {
                const randomX = Math.floor(Math.random() * world.width);
                const randomY = Math.floor(Math.random() * world.height);
                const position: Position = { x: randomX, y: randomY };
                if (world.isValidPosition(position))
                    return position;
            }
        }
        return { x: 0, y: 0 }
    }
}