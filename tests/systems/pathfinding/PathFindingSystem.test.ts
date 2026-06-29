import { World } from "../../../src/core/World";
import { PathfindingSystem } from "../../../src/systems/pathfinding/PathFindingSystem";
import { CoreFactory } from "../../factories/CoreFactory";

describe("PathfindingSystem.nextStep", () => {
    let world: World;

    beforeEach(() => {
        world = CoreFactory.createWorld({ width: 20, height: 20 });
    });

    it("should return the next step toward the target horizontally", () => {
        const result = PathfindingSystem.nextStep({ x: 0, y: 0 }, { x: 3, y: 0 }, world);
        expect(result).toEqual({ x: 1, y: 0 });
    });

    it("should return the next step toward the target vertically", () => {
        const result = PathfindingSystem.nextStep({ x: 0, y: 0 }, { x: 0, y: 3 }, world);
        expect(result).toEqual({ x: 0, y: 1 });
    });

    it("should return the next step toward the target diagonally", () => {
        const result = PathfindingSystem.nextStep({ x: 0, y: 0 }, { x: 3, y: 4 }, world);
        expect(result).toEqual({ x: 1, y: 0 });
    });

    it("should return null when already at the target", () => {
        const result = PathfindingSystem.nextStep({ x: 3, y: 3 }, { x: 3, y: 3 }, world);
        expect(result).toBeNull();
    });

    it("should return null when target is unreachable (blocked by water)", () => {
        const blockedWorld = new World(5, 5, [], [
            { x: 1, y: 0 }, { x: 0, y: 1 },
        ]);
        const result = PathfindingSystem.nextStep({ x: 0, y: 0 }, { x: 2, y: 2 }, blockedWorld);
        expect(result).toBeNull();
    });

    it("should navigate around an obstacle to reach the target", () => {
        const worldWithObstacle = new World(5, 5, [], [
            { x: 1, y: 0 },
        ]);
        const result = PathfindingSystem.nextStep({ x: 0, y: 0 }, { x: 2, y: 0 }, worldWithObstacle);
        expect(result).not.toBeNull();
        expect(result!.x).toBe(0);
        expect(result!.y).toBe(1);
    });
});

describe("PathfindingSystem.closestAdjacentValid", () => {
    let world: World;

    beforeEach(() => {
        world = CoreFactory.createWorld({ width: 20, height: 20 });
    });

    it("should return the closest valid adjacent position to the target", () => {
        const result = PathfindingSystem.closestAdjacentValid({ x: 0, y: 0 }, { x: 3, y: 0 }, world);
        expect(result).toEqual({ x: 2, y: 0 });
    });

    it("should return null when no adjacent positions are valid (1x1 world)", () => {
        const tinyWorld = new World(1, 1);
        const result = PathfindingSystem.closestAdjacentValid({ x: 0, y: 0 }, { x: 0, y: 0 }, tinyWorld);
        expect(result).toBeNull();
    });

    it("should return the only valid adjacent position when others are water", () => {
        const worldWithWater = new World(5, 5, [], [
            { x: 0, y: 1 }, { x: 0, y: -1 }, { x: -1, y: 0 },
        ]);
        const result = PathfindingSystem.closestAdjacentValid({ x: 2, y: 0 }, { x: 0, y: 0 }, worldWithWater);
        expect(result).toEqual({ x: 1, y: 0 });
    });

    it("should prefer the adjacent position closest to the from position", () => {
        const result = PathfindingSystem.closestAdjacentValid({ x: 10, y: 10 }, { x: 0, y: 0 }, world);
        const expected = { x: 1, y: 0 };
        const dist = Math.abs(10 - 1) + Math.abs(10 - 0);
        const altDist = Math.abs(10 - 0) + Math.abs(10 - 1);
        expect(dist).toBeLessThanOrEqual(altDist);
        expect(result).toEqual(expected);
    });
});
