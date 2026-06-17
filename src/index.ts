import { Engine } from "./core/Engine";
import { World } from "./core/World";

const worldWidth = 100;
const worldHeight = 100;

const world = new World(worldWidth, worldHeight);
const engine = new Engine(world);

const timetoStop = 20;

engine.start();

const intervalId = setInterval(() => {
    if (engine.currentTick >= timetoStop) {
        engine.stop();
        clearInterval(intervalId);
        return;
    }
    engine.update();
}, engine.tickRate);
