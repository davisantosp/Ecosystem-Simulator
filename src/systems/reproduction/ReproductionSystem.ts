import { AnimalFactory } from "../../../tests/factories/AnimalFactory";
import { World } from "../../core/World";
import { Animal } from "../../domain/entities/Animal";
import { AnimalStates } from "../../domain/enums/states_enums/AnimalStates";
import { Position } from "../../shared/types/Position";

export class ReproductionSystem {

    static procreate(animal1: Animal, animal2: Animal, world: World): void {
        if (!animal1 || !animal2) throw new Error("Not enough animals to reproduce");

        const offspring = this.createOffspring(animal1, animal2, world);
        if (!offspring) throw new Error("Unable to create offspring");

        this.registerOffspring(offspring, world);

        animal1.procreation.current = animal1.procreation.max ?? 100;
        animal2.procreation.current = animal2.procreation.max ?? 100;

        animal1.removeState([AnimalStates.PROCREATING_SEASON]);
        animal2.removeState([AnimalStates.PROCREATING_SEASON]);
    }

    // Gene inheritance and offspring stats based on parents will be here
    private static createOffspring(animal1: Animal, animal2: Animal, world: World): Animal {
        return AnimalFactory.createGeneric({
            animalSpecie: animal1.animalSpecie,
            position: this.findOffspringPosition(animal1, animal2, world),
            diet: animal1.diet,
            hunger: { current: animal1.hunger.max ?? 50, max: animal2.hunger.max ?? 100 },
            thirst: { current: animal2.thirst.max ?? 50, max: animal1.thirst.max ?? 100 },
            // Max procreation = its not going to reproduce soon
            procreation: { current: animal2.procreation.max ?? 100, min: animal1.procreation.min ?? 1, max: animal2.procreation.max ?? 100 },
        });
    }

    private static findOffspringPosition(animal1: Animal, animal2: Animal, world: World): Position {
        const candidates: Position[] = [
            { x: animal1.position.x + 1, y: animal1.position.y },
            { x: animal1.position.x - 1, y: animal1.position.y },
            { x: animal1.position.x, y: animal1.position.y + 1 },
            { x: animal1.position.x, y: animal1.position.y - 1 },
        ];

        return candidates.find(p => world.isValidPosition(p)) ?? animal1.position;
    }
    private static registerOffspring(offspring: Animal, world: World) {
        if (!world.livingEntities)
            throw new Error("World has no entity list to register offspring.");
        world.livingEntities?.push(offspring);
    }
}