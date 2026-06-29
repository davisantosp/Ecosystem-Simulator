import { Animal } from "../domain/entities/Animal";
import { Plant } from "../domain/entities/Plant";
import { LivingEntitiesTypes, AnimalStates, PlantStates } from "../domain/enums";
import { MovementSystem } from "../systems/movement/MovementSystem";
import { TurnManager } from "./TurnManager";
import { World } from "./World";

export class Engine {
    public world: World;
    public isRunning: boolean = false;
    public currentTick: number;
    public tickRate: number;

    constructor(world: World, tickRate: number) {
        this.world = world;
        this.tickRate = tickRate / 1000; // To be in seconds
        this.currentTick = 0;
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

    public update() {
        if (this.isRunning) {
            this.currentTick++;
        }
        else {
            throw new Error("Engine is not running. Please start the engine before updating.");
        }

        console.log(`Tick: ${this.currentTick}`);

        const livingPlants: Plant[] = (this.world.livingEntities?.filter(x => x.entityType === LivingEntitiesTypes.PLANT) ?? []) as Plant[];
        const livingAnimals: Animal[] = (this.world.livingEntities?.filter(x => x.entityType === LivingEntitiesTypes.ANIMAL) ?? []) as Animal[];
        TurnManager.organizeAnimalsActionOrder(livingAnimals);

        for (const animal of livingAnimals) {
            if (animal.entityStates.includes(AnimalStates.DEAD)) {
                continue;
            }
            animal.update();
            MovementSystem.moveEntity(animal, this.world);
        }

        for (const plant of livingPlants) {
            if (plant.entityStates.includes(PlantStates.WITHERED)) {
                continue;
            }
            plant.update();
        }

        this.world.deleteDeadEntities();
    }
}