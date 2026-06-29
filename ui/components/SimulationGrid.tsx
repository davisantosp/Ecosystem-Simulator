import { useMemo } from "react";
import { World } from "../../src/core/World";
import { Animal } from "../../src/domain/entities/Animal";
import { Plant } from "../../src/domain/entities/Plant";
import { AnimalSpecies, AnimalStates, PlantStates, PlantSpecies } from "../../src/domain/enums";

const ANIMAL_EMOJIS: Record<number, string> = {
  [AnimalSpecies.RABBIT]: "🐇",
  [AnimalSpecies.WOLF]: "🐺",
  [AnimalSpecies.MOOSE]: "🦌",
};

const PLANT_EMOJIS: Record<number, Record<number, string>> = {
  [PlantSpecies.COMMON]: {
    [PlantStates.SEED]: "🌱",
    [PlantStates.SPROUT]: "🌿",
    [PlantStates.MATURE]: "🌳",
    [PlantStates.WITHERED]: "🥀",
  },
  [PlantSpecies.VENOMOUS]: {
    [PlantStates.SEED]: "🌱",
    [PlantStates.SPROUT]: "🪴",
    [PlantStates.MATURE]: "🪲",
    [PlantStates.WITHERED]: "🥀",
  },
  [PlantSpecies.RARE]: {
    [PlantStates.SEED]: "🌱",
    [PlantStates.SPROUT]: "🌸",
    [PlantStates.MATURE]: "🌺",
    [PlantStates.WITHERED]: "🥀",
  },
};

const STATE_INDICATORS: Record<number, string> = {
  [AnimalStates.HUNGRY]: "🍽",
  [AnimalStates.THIRSTY]: "💧",
  [AnimalStates.PROCREATING_SEASON]: "💕",
  [AnimalStates.DEAD]: "💀",
};

type CellData = {
  type: "empty" | "water" | "animal" | "plant";
  emoji: string;
  entityId?: string;
  overlay?: string;
  state?: string;
};

export default function SimulationGrid({
  world,
  tick,
  onSelectEntity,
  selectedId,
}: {
  world: World;
  tick: number;
  onSelectEntity: (info: any) => void;
  selectedId: string | null;
}) {
  const grid = useMemo(() => {
    const rows: CellData[][] = Array.from({ length: world.height }, () =>
      Array.from({ length: world.width }, () => ({
        type: "empty" as const,
        emoji: "",
      }))
    );

    const waterSet = new Set(
      (world.waterSources ?? []).map((w) => `${w.x},${w.y}`)
    );

    for (const entity of world.livingEntities ?? []) {
      const { x, y } = entity.position;
      if (y < 0 || y >= world.height || x < 0 || x >= world.width) continue;
      const cell = rows[y]![x]!;

      if (entity.entityType === 1) {
        const animal = entity as Animal;
        const specie = animal.animalSpecies;
        cell.type = "animal";
        cell.emoji = ANIMAL_EMOJIS[specie] ?? "?";
        cell.entityId = animal.id;

        const states = animal.entityStates;
        if (states.includes(AnimalStates.DEAD)) {
          cell.overlay = STATE_INDICATORS[AnimalStates.DEAD];
          cell.state = "DEAD";
        } else if (states.includes(AnimalStates.HUNGRY)) {
          cell.overlay = STATE_INDICATORS[AnimalStates.HUNGRY];
          cell.state = "HUNGRY";
        } else if (states.includes(AnimalStates.THIRSTY)) {
          cell.overlay = STATE_INDICATORS[AnimalStates.THIRSTY];
          cell.state = "THIRSTY";
        } else if (states.includes(AnimalStates.PROCREATING_SEASON)) {
          cell.overlay = STATE_INDICATORS[AnimalStates.PROCREATING_SEASON];
          cell.state = "PROCREATING";
        }
      } else {
        const plant = entity as Plant;
        const species = plant.plantSpecies;
        const stateIdx = plant.entityStates.find(
          (s) =>
            s === PlantStates.SEED ||
            s === PlantStates.SPROUT ||
            s === PlantStates.MATURE ||
            s === PlantStates.WITHERED
        );

        const plantEmojis = PLANT_EMOJIS[species] ?? PLANT_EMOJIS[0]!;
        cell.type = "plant";
        cell.emoji = stateIdx !== undefined ? plantEmojis[stateIdx] ?? "🌱" : "🌱";
        cell.entityId = plant.id;
        cell.state = stateIdx !== undefined ? PlantStates[stateIdx] : "SEED";
      }
    }

    for (const key of waterSet) {
      const [x, y] = key.split(",").map(Number);
      if (y! < 0 || y! >= world.height || x! < 0 || x! >= world.width) continue;
      const cell = rows[y!]![x!]!;
      cell.type = "water";
      cell.emoji = "🌊";
    }

    return rows;
  }, [world.livingEntities, world.waterSources, world.width, world.height, tick]);

  return (
    <div
      className="grid-container"
      style={{
        gridTemplateColumns: `repeat(${world.width}, 1fr)`,
        gridTemplateRows: `repeat(${world.height}, 1fr)`,
      }}
    >
      {grid.flatMap((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`grid-cell cell-${cell.type}${cell.entityId === selectedId ? " cell-selected" : ""}`}
            onClick={() => onSelectEntity(cell.entityId ? { id: cell.entityId } : null)}
            title={
              cell.type === "water"
                ? "Water"
                : cell.type === "empty"
                  ? `(${x}, ${y})`
                  : `${cell.type === "animal" ? "Animal" : "Plant"} at (${x}, ${y})`
            }
          >
            {cell.type !== "empty" && (
              <span className="cell-emoji">{cell.emoji}</span>
            )}
            {cell.overlay && (
              <span className="cell-overlay">{cell.overlay}</span>
            )}
          </div>
        ))
      )}
    </div>
  );
}
