import { Engine } from "../../src/core/Engine";
import { World } from "../../src/core/World";
import { AnimalFactory } from "./AnimalFactory";
import { PlantFactory } from "./PlantFactory";

export class CoreFactory {
    static createWorld(overrides?: Partial<World>, createEntities?: boolean): World {
        const newWorld = new World(20, 20, []);

        Object.assign(newWorld, overrides);

        if (createEntities) {
            newWorld.livingEntities = [
                AnimalFactory.createMoose({ position: { x: 1, y: 1 } }),
                AnimalFactory.createRabbit({ position: { x: 2, y: 2 } }),
                AnimalFactory.createWolf({ position: { x: 3, y: 3 } }),
                PlantFactory.createCommonPlant({ position: { x: 4, y: 4 } }),
                PlantFactory.createRarePlant({ position: { x: 5, y: 5 } }),
                PlantFactory.createVenomousPlant({ position: { x: 6, y: 6 } })
            ];
        }

        return newWorld;
    }

    static createEngine(): Engine {
        throw new Error("Function not implemented");
    }
}