import { AnimalFactory } from "../tests/factories/AnimalFactory";
import { PlantFactory } from "../tests/factories/PlantFactory";
import { Engine } from "./core/Engine";
import { World } from "./core/World";
import { Distance } from "./shared/types/Distance";
import { Random } from "./systems/systems_functions/Random";
import { ConsoleRenderer } from "./ui/ConsoleRenderer";

const worldWidth: Distance = 10;
const worldHeight: Distance = 10;

const world = new World(worldWidth, worldHeight);
const engine = new Engine(world);

const timetoStop = 60;

const entities = [
    AnimalFactory.createGeneric({ position: Random.generatePosition(world) }),
    AnimalFactory.createGeneric({ position: Random.generatePosition(world) }),
    PlantFactory.createCommonPlant({ position: Random.generatePosition(world) }),
    PlantFactory.createCommonPlant({ position: Random.generatePosition(world) }),
]
world.livingEntities = entities

engine.start();

const intervalId = setInterval(() => {
    if (engine.currentTick >= timetoStop) {
        engine.stop();
        clearInterval(intervalId);
        return;
    }
    engine.update();
    ConsoleRenderer.render(engine.world, engine.currentTick);
}, engine.tickRate);
