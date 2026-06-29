import { Position } from "../../../src/shared/types/Position";
import { Interval } from "../../../src/shared/types/Interval";
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

describe("Calculations.randomNumberInInterval", () => {
    it("should return the start value when Math.random returns 0", () => {
        jest.spyOn(Math, "random").mockReturnValue(0);
        const interval: Interval = { start: 5, end: 10 };
        expect(Calculations.randomNumberInInterval(interval)).toBe(5);
        jest.restoreAllMocks();
    });

    it("should return the end value when Math.random returns 1", () => {
        jest.spyOn(Math, "random").mockReturnValue(1);
        const interval: Interval = { start: 5, end: 10 };
        expect(Calculations.randomNumberInInterval(interval)).toBe(10);
        jest.restoreAllMocks();
    });

    it("should return an integer within the interval", () => {
        jest.spyOn(Math, "random").mockReturnValue(0.5);
        const interval: Interval = { start: 1, end: 10 };
        const result = Calculations.randomNumberInInterval(interval);
        expect(Number.isInteger(result)).toBe(true);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
        jest.restoreAllMocks();
    });

    it("should return different values on successive calls", () => {
        const interval: Interval = { start: 1, end: 100 };
        const results = new Set<number>();
        for (let i = 0; i < 20; i++) {
            results.add(Calculations.randomNumberInInterval(interval));
        }
        expect(results.size).toBeGreaterThan(1);
    });

    it("should return the exact value when interval start equals end", () => {
        jest.spyOn(Math, "random").mockReturnValue(0.5);
        const interval: Interval = { start: 7, end: 7 };
        expect(Calculations.randomNumberInInterval(interval)).toBe(7);
        jest.restoreAllMocks();
    });
});
