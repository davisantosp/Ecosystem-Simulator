import { Animal } from "../domain/entities/Animal";

export class TurnManager {

    static organizeAnimalsActionOrder(animals: Animal[]): void {
        if (!animals) throw new Error("No entities in the world");

        this.shuffle(animals);
        animals.sort((a, b) => b.speed - a.speed);
    }
    private static shuffle(animals: Animal[]): Animal[] {
        for (let i = animals.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            const temp = animals[i]!;
            animals[i] = animals[j]!;
            animals[j] = temp;
        }
        return animals;
    }
}