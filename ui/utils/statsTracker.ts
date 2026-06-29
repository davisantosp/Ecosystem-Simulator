import { AnimalSpecies, PlantSpecies, AnimalStates, PlantStates } from "../../src/domain/enums";
import { Animal } from "../../src/domain/entities/Animal";
import { Plant } from "../../src/domain/entities/Plant";

export const MAX_HISTORY = 120;

export type AnimalStatSnapshot = {
  population: number;
  avgHungerPct: number;
  avgThirstPct: number;
  avgLifespanPct: number;
  avgSpeed: number;
  avgVision: number;
  states: { state: string; count: number }[];
};

export type PlantStatSnapshot = {
  population: number;
  avgGrowthRatePct: number;
  avgNutritionalValuePct: number;
  avgLifespanPct: number;
  states: { state: string; count: number }[];
};

export type TickSnapshot = {
  tick: number;
  totalAnimals: number;
  totalPlants: number;
  animalSpecies: Record<string, AnimalStatSnapshot>;
  plantSpecies: Record<string, PlantStatSnapshot>;
};

const ANIMAL_SPECIES_KEYS = Object.keys(AnimalSpecies).filter((k) => isNaN(Number(k)));
const PLANT_SPECIES_KEYS = Object.keys(PlantSpecies).filter((k) => isNaN(Number(k)));
const ANIMAL_STATE_KEYS = Object.keys(AnimalStates).filter((k) => isNaN(Number(k)));
const PLANT_STATE_KEYS = Object.keys(PlantStates).filter((k) => isNaN(Number(k)));

function pct(value: number, max: number | undefined): number {
  if (!max || max <= 0) return 0;
  return Math.round((value / max) * 100);
}

export function captureSnapshot(
  animals: Animal[],
  plants: Plant[],
  tick: number
): TickSnapshot {
  const byAnimalSpecies: Record<string, Animal[]> = {};
  for (const key of ANIMAL_SPECIES_KEYS) byAnimalSpecies[key] = [];
  for (const a of animals) {
    const name = AnimalSpecies[a.animalSpecies];
    if (!byAnimalSpecies[name]) byAnimalSpecies[name] = [];
    byAnimalSpecies[name].push(a);
  }

  const byPlantSpecies: Record<string, Plant[]> = {};
  for (const key of PLANT_SPECIES_KEYS) byPlantSpecies[key] = [];
  for (const p of plants) {
    const name = PlantSpecies[p.plantSpecies];
    if (!byPlantSpecies[name]) byPlantSpecies[name] = [];
    byPlantSpecies[name].push(p);
  }

  const animalSpecies: Record<string, AnimalStatSnapshot> = {};
  for (const [name, list] of Object.entries(byAnimalSpecies)) {
    const count = list.length;
    if (count === 0) {
      animalSpecies[name] = {
        population: 0,
        avgHungerPct: 0,
        avgThirstPct: 0,
        avgLifespanPct: 0,
        avgSpeed: 0,
        avgVision: 0,
        states: ANIMAL_STATE_KEYS.filter((k) => k !== "DEAD").map((s) => ({ state: s, count: 0 })),
      };
      continue;
    }
    const sumHungerPct = list.reduce((s, a) => s + pct(a.hunger.current, a.hunger.max), 0);
    const sumThirstPct = list.reduce((s, a) => s + pct(a.thirst.current, a.thirst.max), 0);
    const sumLifespanPct = list.reduce((s, a) => s + pct(a.lifespan.current, a.lifespan.max), 0);
    const sumSpeed = list.reduce((s, a) => s + a.speed, 0);
    const sumVision = list.reduce((s, a) => s + a.visionRadius, 0);

    const stateMap: Record<string, number> = {};
    for (const sk of ANIMAL_STATE_KEYS) if (sk !== "DEAD") stateMap[sk] = 0;
    for (const a of list) {
      for (const st of a.entityStates) {
        const name = AnimalStates[st];
        if (name && name !== "DEAD") stateMap[name] = (stateMap[name] ?? 0) + 1;
      }
    }

    animalSpecies[name] = {
      population: count,
      avgHungerPct: Math.round(sumHungerPct / count),
      avgThirstPct: Math.round(sumThirstPct / count),
      avgLifespanPct: Math.round(sumLifespanPct / count),
      avgSpeed: Math.round((sumSpeed / count) * 10) / 10,
      avgVision: Math.round((sumVision / count) * 10) / 10,
      states: Object.entries(stateMap).map(([state, cnt]) => ({ state, count: cnt })),
    };
  }

  const plantSpecies: Record<string, PlantStatSnapshot> = {};
  for (const [name, list] of Object.entries(byPlantSpecies)) {
    const count = list.length;
    if (count === 0) {
      plantSpecies[name] = {
        population: 0,
        avgGrowthRatePct: 0,
        avgNutritionalValuePct: 0,
        avgLifespanPct: 0,
        states: PLANT_STATE_KEYS.filter((k) => k !== "WITHERED").map((s) => ({ state: s, count: 0 })),
      };
      continue;
    }
    const sumGrowthPct = list.reduce((s, p) => s + pct(p.growthRate.current, p.growthRate.max), 0);
    const sumNutritionPct = list.reduce((s, p) => s + pct(p.nutritionalValue.current, p.nutritionalValue.max), 0);
    const sumLifespanPct = list.reduce((s, p) => s + pct(p.lifespan.current, p.lifespan.max), 0);

    const stateMap: Record<string, number> = {};
    for (const sk of PLANT_STATE_KEYS) if (sk !== "WITHERED") stateMap[sk] = 0;
    for (const p of list) {
      for (const st of p.entityStates) {
        const name = PlantStates[st];
        if (name && name !== "WITHERED") stateMap[name] = (stateMap[name] ?? 0) + 1;
      }
    }

    plantSpecies[name] = {
      population: count,
      avgGrowthRatePct: Math.round(sumGrowthPct / count),
      avgNutritionalValuePct: Math.round(sumNutritionPct / count),
      avgLifespanPct: Math.round(sumLifespanPct / count),
      states: Object.entries(stateMap).map(([state, cnt]) => ({ state, count: cnt })),
    };
  }

  return {
    tick,
    totalAnimals: animals.length,
    totalPlants: plants.length,
    animalSpecies,
    plantSpecies,
  };
}
