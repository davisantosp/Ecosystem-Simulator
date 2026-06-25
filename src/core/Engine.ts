import { Animal } from "../domain/entities/Animal";
import { Plant } from "../domain/entities/Plant";
import { LivingEntitiesTypes } from "../domain/enums/entities_enums/LivingEntitiesTypes";
import { AnimalStates } from "../domain/enums/states_enums/AnimalStates";
import { PlantStates } from "../domain/enums/states_enums/PlantStates";
import { TurnManager } from "./TurnManager";
import { World } from "./World";

export class Engine {
    public world: World;
    public isRunning: boolean = false;
    public currentTick: number = 0;
    public tickRate: number = 1000; // 1 second

    constructor(world: World) {
        this.world = world;
    }

    public start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.currentTick = 0;
        }

        console.log("Engine started.");
    }

    public stop() {
        if (this.isRunning)
            this.isRunning = false;
        else
            throw new Error("Engine is not running. Please start the engine before stopping.");

        console.log("Engine stopped.");
    }

    public update(world: World) {
        if (this.isRunning) {
            this.currentTick++;
        }
        else {
            throw new Error("Engine is not running. Please start the engine before updating.");
        }

        console.log(`Tick: ${this.currentTick}`);

        const livingPlants: Plant[] = (world.livingEntities?.filter(x => x.entityType === LivingEntitiesTypes.PLANT) ?? []) as Plant[];
        const livingAnimals: Animal[] = (world.livingEntities?.filter(x => x.entityType === LivingEntitiesTypes.ANIMAL) ?? []) as Animal[];
        TurnManager.organizeAnimalsActionOrder(livingAnimals);

        for (const animal of livingAnimals) {
            animal.update();
            if (animal.entityStates.includes(AnimalStates.DEAD)) {
                continue;
            }
        }

        for (const plant of livingPlants) {
            plant.update();
            if (plant.entityStates.includes(PlantStates.WITHERED)) {
                continue;
            }
        }

        world.deleteDeadEntities();
    }
}