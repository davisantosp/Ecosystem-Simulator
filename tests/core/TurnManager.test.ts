import { Animal } from "../../src/domain/entities/Animal";
import { TurnManager } from "../../src/core/TurnManager";
import { AnimalFactory } from "../factories/AnimalFactory";

describe("TurnManager.organizeAnimalsActionOrder", () => {
    it("should sort animals by speed in descending order", () => {
        const slow = AnimalFactory.createRabbit({ speed: 1 });
        const fast = AnimalFactory.createWolf({ speed: 10 });
        const animals = [slow, fast];

        TurnManager.organizeAnimalsActionOrder(animals);

        expect(animals[0]!.speed).toBeGreaterThanOrEqual(animals[1]!.speed);
    });

    it("should throw when animals is null", () => {
        expect(() => {
            TurnManager.organizeAnimalsActionOrder(null as any);
        }).toThrow("No entities in the world");
    });
});
