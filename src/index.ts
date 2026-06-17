import { Engine } from "./core/Engine";
import { World } from "./core/World";

const worldWidth = 100;
const worldHeight = 100;

const world = new World(worldWidth, worldHeight);
const engine = new Engine(world);

const timetoStop = 20;

engine.start();

while (engine.isRunning && engine.currentTick < timetoStop) {
    engine.update();
}

engine.stop();