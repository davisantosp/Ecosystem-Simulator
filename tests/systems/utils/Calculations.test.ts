import { Position } from "../../../src/shared/types/Position";
import { Calculations } from "../../../src/systems/utils/Calculations";

describe("Calculations.distanceBetween", () => {
    it("should return 0 when both positions are the same", () => {
        const pos: Position = { x: 5, y: 5 };
        expect(Calculations.distanceBetween(pos, pos)).toBe(0);
    });

    it("should calculate horizontal distance correctly", () => {
        const pos1: Position = { x: 0, y: 0 };
        const pos2: Position = { x: 3, y: 0 };
        expect(Calculations.distanceBetween(pos1, pos2)).toBe(3);
    });

    it("should calculate vertical distance correctly", () => {
        const pos1: Position = { x: 0, y: 0 };
        const pos2: Position = { x: 0, y: 4 };
        expect(Calculations.distanceBetween(pos1, pos2)).toBe(4);
    });

    it("should calculate diagonal distance using ceil of euclidean distance", () => {
        const pos1: Position = { x: 0, y: 0 };
        const pos2: Position = { x: 3, y: 4 };
        expect(Calculations.distanceBetween(pos1, pos2)).toBe(5);
    });

    it("should round up (ceil) the distance", () => {
        const pos1: Position = { x: 0, y: 0 };
        const pos2: Position = { x: 1, y: 1 };
        const sqrt2 = Math.ceil(Math.SQRT2);
        expect(Calculations.distanceBetween(pos1, pos2)).toBe(sqrt2);
    });
});
