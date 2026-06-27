import { Random } from "../../../src/systems/utils/Random";
import { CoreFactory } from "../../factories/CoreFactory";

describe("Random.generateID", () => {
    it("should return unique IDs on successive calls", () => {
        const id1 = Random.generateID();
        const id2 = Random.generateID();
        expect(id1).not.toEqual(id2);
    });
});

describe("Random.generatePosition", () => {
    it("should return a valid position within world bounds", () => {
        const world = CoreFactory.createWorld({ width: 10, height: 10 });

        const position = Random.generatePosition(world);

        expect(world.isValidPosition(position)).toBe(true);
        expect(position.x).toBeGreaterThanOrEqual(0);
        expect(position.x).toBeLessThan(10);
        expect(position.y).toBeGreaterThanOrEqual(0);
        expect(position.y).toBeLessThan(10);
    });

    it("should return { x: 0, y: 0 } when no world is provided", () => {
        const position = Random.generatePosition();

        expect(position).toEqual({ x: 0, y: 0 });
    });

    it("should return positions distributed across the world over multiple calls", () => {
        const world = CoreFactory.createWorld({ width: 100, height: 100 });
        const positions = new Set<string>();

        for (let i = 0; i < 50; i++) {
            const pos = Random.generatePosition(world);
            positions.add(`${pos.x},${pos.y}`);
        }

        expect(positions.size).toBeGreaterThan(1);
    });
});
