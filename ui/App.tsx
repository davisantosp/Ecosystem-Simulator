import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Engine } from "../src/core/Engine";
import { World } from "../src/core/World";
import { Animal } from "../src/domain/entities/Animal";
import { Plant } from "../src/domain/entities/Plant";
import { AnimalStates, PlantStates, PlantSpecies, AnimalSpecies, LivingEntitiesTypes, GeneTypes } from "../src/domain/enums";
import { Random } from "../src/systems/utils/Random";
import { AnimalFactory } from "../tests/factories/AnimalFactory";
import { PlantFactory } from "../tests/factories/PlantFactory";
import SimulationGrid from "./components/SimulationGrid";
import ControlPanel from "./components/ControlPanel";
import EntityStats from "./components/EntityStats";
import Legend from "./components/Legend";
import ConfigMenu, { DEFAULT_CONFIG, type SimConfig } from "./components/ConfigMenu";
import StatisticsPanel from "./components/StatisticsPanel";
import DetailedStats from "./components/DetailedStats";
import { captureSnapshot, MAX_HISTORY, type TickSnapshot } from "./utils/statsTracker";

type EntityInfo = {
  id: string;
  species: string;
  state: string;
  hunger: string;
  thirst: string;
  position: string;
  type: "animal" | "plant" | "water";
  genes: string[];
};

function createInitialWorld(config: SimConfig): World {
  const world = new World(config.gridWidth, config.gridHeight);

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
  const engineRef = useRef<Engine>(new Engine(worldRef.current, {} as any));
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<"info" | "stats">("info");
  const [detailedStatsOpen, setDetailedStatsOpen] = useState(false);
  const statsHistoryRef = useRef<TickSnapshot[]>([]);
  const timerRef = useRef<number | null>(null);

  const tickSimulation = useCallback(() => {
    const engine = engineRef.current;
    if (!engine.isRunning) engine.start();
    engine.update();
    setTick(engine.currentTick);
    const world = worldRef.current;
    const animals = (world.livingEntities ?? []).filter(
      (e) => e.entityType === LivingEntitiesTypes.ANIMAL &&
             !e.entityStates.includes(AnimalStates.DEAD)
    ) as Animal[];
    const plants = (world.livingEntities ?? []).filter(
      (e) => e.entityType === LivingEntitiesTypes.PLANT &&
             !e.entityStates.includes(PlantStates.WITHERED)
    ) as Plant[];
    const snapshot = captureSnapshot(animals, plants, engine.currentTick);
    const history = statsHistoryRef.current;
    history.push(snapshot);
    if (history.length > MAX_HISTORY) history.shift();
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
    engineRef.current = new Engine(newWorld, {} as any);
    setTick(0);
    setSelectedId(null);
    statsHistoryRef.current = [];
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
    (e) => e.entityType === LivingEntitiesTypes.ANIMAL && !e.entityStates.includes(AnimalStates.DEAD)
  ) as Animal[];
  const plants = (world.livingEntities ?? []).filter(
    (e) => e.entityType === LivingEntitiesTypes.PLANT && !e.entityStates.includes(PlantStates.WITHERED)
  ) as Plant[];

  const selectedEntity = useMemo<EntityInfo | null>(() => {
    if (!selectedId) return null;
    const entity = (world.livingEntities ?? []).find((e) => e.id === selectedId);
    if (!entity) return null;
    if (entity.entityType === LivingEntitiesTypes.ANIMAL) {
      const a = entity as Animal;
      return {
        id: a.id,
        species: AnimalSpecies[a.animalSpecies],
        state: a.entityStates
          .map((s) => AnimalStates[s] ?? PlantStates[s])
          .join(", "),
        hunger: `${a.hunger.current}/${a.hunger.max ?? "∞"}`,
        thirst: `${a.thirst.current}/${a.thirst.max ?? "∞"}`,
        position: `(${a.position.x}, ${a.position.y})`,
        type: "animal" as const,
        genes: a.genes.map(g => GeneTypes[g.geneType] ?? String(g.geneType)),
      };
    }
    const p = entity as Plant;
    const stateName = p.entityStates
      .map((s) => PlantStates[s])
      .filter(Boolean)
      .join(", ");
    return {
      id: p.id,
      species: PlantSpecies[p.plantSpecies],
      state: stateName || "NORMAL",
      hunger: "-",
      thirst: "-",
      position: `(${p.position.x}, ${p.position.y})`,
      type: "plant" as const,
      genes: p.genes.map(g => GeneTypes[g.geneType] ?? String(g.geneType)),
    };
  }, [selectedId, tick]);

  const statsHistory = useMemo(() => statsHistoryRef.current, [tick]);
  const currentSnapshot = statsHistory.length > 0 ? statsHistory[statsHistory.length - 1] : null;

  return (
    <div className="app">
      <header className="app-header">
        <button className="config-toggle" onClick={() => setConfigOpen(v => !v)} title="Configuration">
          ⚙
        </button>
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
          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab ${sidebarTab === "info" ? "sidebar-tab--active" : ""}`}
              onClick={() => setSidebarTab("info")}
            >
              Info
            </button>
            <button
              className={`sidebar-tab ${sidebarTab === "stats" ? "sidebar-tab--active" : ""}`}
              onClick={() => setSidebarTab("stats")}
            >
              Stats
            </button>
          </div>

          {sidebarTab === "info" && (
            <>
              <Legend />
              <EntityStats entity={selectedEntity} />
            </>
          )}

          {sidebarTab === "stats" && (
            <StatisticsPanel
              history={statsHistory}
              current={currentSnapshot}
              onOpenDetailed={() => setDetailedStatsOpen(true)}
            />
          )}
        </aside>
      </div>

      {detailedStatsOpen && (
        <div className="modal-overlay" onClick={() => setDetailedStatsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <DetailedStats
              history={statsHistory}
              onClose={() => setDetailedStatsOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
