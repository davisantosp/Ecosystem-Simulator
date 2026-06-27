import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Engine } from "../src/core/Engine";
import { TurnManager } from "../src/core/TurnManager";
import { World } from "../src/core/World";
import { Animal } from "../src/domain/entities/Animal";
import { Plant } from "../src/domain/entities/Plant";
import { AnimalStates } from "../src/domain/enums/states_enums/AnimalStates";
import { PlantStates } from "../src/domain/enums/states_enums/PlantStates";
import { PlantSpecies } from "../src/domain/enums/entities_enums/PlantSpecies";
import { Random } from "../src/systems/systems_functions/Random";
import { AnimalFactory } from "../tests/factories/AnimalFactory";
import { PlantFactory } from "../tests/factories/PlantFactory";
import SimulationGrid from "./components/SimulationGrid";
import ControlPanel from "./components/ControlPanel";
import EntityStats from "./components/EntityStats";
import Legend from "./components/Legend";
import ConfigMenu, { DEFAULT_CONFIG, type SimConfig } from "./components/ConfigMenu";

type EntityInfo = {
  id: string;
  specie: string;
  state: string;
  hunger: string;
  thirst: string;
  position: string;
  type: "animal" | "plant" | "water";
};

function createInitialWorld(config: SimConfig): World {
  const world = new World(20, 20);

  const entities: (Animal | Plant)[] = [];

  for (let i = 0; i < config.rabbitCount; i++)
    entities.push(AnimalFactory.createRabbit({
      position: Random.generatePosition(world),
      procreation: { current: 25, max: 50 },
    }));
  for (let i = 0; i < config.wolfCount; i++)
    entities.push(AnimalFactory.createWolf({ position: Random.generatePosition(world) }));
  for (let i = 0; i < config.mooseCount; i++)
    entities.push(AnimalFactory.createMoose({ position: Random.generatePosition(world) }));
  for (let i = 0; i < config.commonPlantCount; i++)
    entities.push(PlantFactory.createCommonPlant({ position: Random.generatePosition(world) }));
  for (let i = 0; i < config.rarePlantCount; i++)
    entities.push(PlantFactory.createRarePlant({ position: Random.generatePosition(world) }));
  for (let i = 0; i < config.venomousPlantCount; i++)
    entities.push(PlantFactory.createVenomousPlant({ position: Random.generatePosition(world) }));

  world.livingEntities = entities;

  const ponds: { x: number; y: number }[] = [];
  for (let i = 0; i < config.waterSourceCount; i++) {
    ponds.push(Random.generatePosition(world));
  }
  world.waterSources = ponds;

  return world;
}

export default function App() {
  const [config, setConfig] = useState<SimConfig>(DEFAULT_CONFIG);
  const [configOpen, setConfigOpen] = useState(false);
  const worldRef = useRef<World>(createInitialWorld(config));
  const engineRef = useRef<Engine>(new Engine(worldRef.current));
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const tickSimulation = useCallback(() => {
    const engine = engineRef.current;
    const world = worldRef.current;
    if (!engine.isRunning) engine.start();

    const aliveAnimals = (world.livingEntities ?? []).filter(
      (e) => e.entityType === 1 && !e.entityStates.includes(AnimalStates.DEAD)
    ) as Animal[];
    const alivePlants = (world.livingEntities ?? []).filter(
      (e) => e.entityType === 0 && !e.entityStates.includes(PlantStates.WITHERED)
    ) as Plant[];

    TurnManager.organizeAnimalsActionOrder(aliveAnimals);

    for (const animal of aliveAnimals) {
      animal.update(world);
    }
    for (const plant of alivePlants) {
      plant.update();
    }

    world.deleteDeadEntities();
    engine.currentTick++;
    setTick(engine.currentTick);
  }, []);

  const start = useCallback(() => {
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
  }, []);

  const step = useCallback(() => {
    tickSimulation();
  }, [tickSimulation]);

  const reset = useCallback(() => {
    setRunning(false);
    const newWorld = createInitialWorld(config);
    worldRef.current = newWorld;
    engineRef.current = new Engine(newWorld);
    setTick(0);
    setSelectedId(null);
  }, [config]);

  useEffect(() => {
    if (tick >= config.maxTicks && config.maxTicks > 0) {
      setRunning(false);
    }
  }, [tick, config.maxTicks]);

  useEffect(() => {
    if (running) {
      timerRef.current = window.setInterval(tickSimulation, config.tickSpeed * 1000);
    } else {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, [running, tickSimulation, config.tickSpeed]);

  const world = worldRef.current;
  const animals = (world.livingEntities ?? []).filter(
    (e) => e.entityType === 1 && !e.entityStates.includes(AnimalStates.DEAD)
  ) as Animal[];
  const plants = (world.livingEntities ?? []).filter(
    (e) => e.entityType === 0 && !e.entityStates.includes(PlantStates.WITHERED)
  ) as Plant[];

  const selectedEntity = useMemo<EntityInfo | null>(() => {
    if (!selectedId) return null;
    const entity = (world.livingEntities ?? []).find((e) => e.id === selectedId);
    if (!entity) return null;
    if (entity.entityType === 1) {
      const a = entity as Animal;
      return {
        id: a.id,
        specie: AnimalSpecies[a.animalSpecie],
        state: a.entityStates
          .map((s) => AnimalStates[s] ?? PlantStates[s])
          .join(", "),
        hunger: `${a.hunger.current}/${a.hunger.max ?? "∞"}`,
        thirst: `${a.thirst.current}/${a.thirst.max ?? "∞"}`,
        position: `(${a.position.x}, ${a.position.y})`,
        type: "animal" as const,
      };
    }
    const p = entity as Plant;
    const stateName = p.entityStates
      .map((s) => PlantStates[s])
      .filter(Boolean)
      .join(", ");
    return {
      id: p.id,
      specie: PlantSpecies[p.plantSpecies],
      state: stateName || "NORMAL",
      hunger: "-",
      thirst: "-",
      position: `(${p.position.x}, ${p.position.y})`,
      type: "plant" as const,
    };
  }, [selectedId, tick]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>EcoSim</h1>
        <span className="tick-display">Tick: {tick}{config.maxTicks > 0 ? ` / ${config.maxTicks}` : ""}</span>
      </header>

      <ConfigMenu
        open={configOpen}
        config={config}
        onChange={setConfig}
        onToggle={() => setConfigOpen((v) => !v)}
      />

      <div className="app-body">
        <div className="main-area">
          <SimulationGrid
            world={world}
            tick={tick}
            onSelectEntity={(info) => setSelectedId(info ? info.id : null)}
            selectedId={selectedId}
          />
          <ControlPanel
            running={running}
            onStart={start}
            onStop={stop}
            onStep={step}
            onReset={reset}
          />
          <div className="counts">
            <span>Animals: {animals.length}</span>
            <span>Plants: {plants.length}</span>
          </div>
        </div>

        <aside className="sidebar">
          <Legend />
          <EntityStats entity={selectedEntity} />
        </aside>
      </div>
    </div>
  );
}
