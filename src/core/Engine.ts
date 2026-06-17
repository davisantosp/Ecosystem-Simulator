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

    public update() {
        if (this.isRunning) {
            this.currentTick++;
        }
        else {
            throw new Error("Engine is not running. Please start the engine before updating.");
        }

        console.log(`Tick: ${this.currentTick}`);

        // update world state, entities, etc. here
    }
}