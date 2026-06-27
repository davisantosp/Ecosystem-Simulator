import { AnimalFactory } from "../tests/factories/AnimalFactory";
import { PlantFactory } from "../tests/factories/PlantFactory";
import { Engine } from "./core/Engine";
import { World } from "./core/World";
import { Distance } from "./shared/types/Distance";
import { Random } from "./systems/systems_functions/Random";
import { ConsoleRenderer } from "./ui/ConsoleRenderer";

const worldWidth: Distance = 15;
const worldHeight: Distance = 15;

const world = new World(worldWidth, worldHeight);
const engine = new Engine(world);

const timetoStop = 60;

const entities = [
    AnimalFactory.createRabbit({ position: Random.generatePosition(world), procreation: { current: 25, max: 50 } }),
    AnimalFactory.createRabbit({ position: Random.generatePosition(world), procreation: { current: 25, max: 50 } }),
    AnimalFactory.createRabbit({ position: Random.generatePosition(world), procreation: { current: 25, max: 50 } }),
    AnimalFactory.createRabbit({ position: Random.generatePosition(world) }),
    AnimalFactory.createRabbit({ position: Random.generatePosition(world) }),
    PlantFactory.createCommonPlant({ position: Random.generatePosition(world) }),
    PlantFactory.createCommonPlant({ position: Random.generatePosition(world) }),
    PlantFactory.createCommonPlant({ position: Random.generatePosition(world) }),
    PlantFactory.createCommonPlant({ position: Random.generatePosition(world) }),
    PlantFactory.createCommonPlant({ position: Random.generatePosition(world) }),
    PlantFactory.createCommonPlant({ position: Random.generatePosition(world) }),
]

const ponds = [
    Random.generatePosition(world),
    Random.generatePosition(world),
    Random.generatePosition(world),
    Random.generatePosition(world),
    Random.generatePosition(world),
    Random.generatePosition(world),
    Random.generatePosition(world),
    Random.generatePosition(world),
]

world.livingEntities = entities
world.waterSources = ponds

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
