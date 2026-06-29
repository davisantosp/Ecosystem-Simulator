import { PlantFactory } from "../../../tests/factories/PlantFactory";
import { World } from "../../core/World";
import { Animal } from "../../domain/entities/Animal";
import { Plant } from "../../domain/entities/Plant";
import { AnimalStates, PlantSpecies, PlantStates } from "../../domain/enums";
import { SPREAD_CHANCE } from "../../shared/config/ecosystemConfig";
import { Position } from "../../shared/types/Position";
import { InheritanceSystem } from "../inheritance/InheritanceSystem";
import { Random } from "../utils/Random";

export class ReproductionSystem {
    // Animal
    static procreate(animal1: Animal, animal2: Animal, world: World): void {
        if (!animal1 || !animal2) throw new Error("Not enough animals to reproduce");

        const offspring = this.createOffspring(animal1, animal2, world);
        if (!offspring) throw new Error("Unable to create offspring");

        InheritanceSystem.inheritCharacteristics(animal1, animal2, offspring);
        InheritanceSystem.inheritGenes(animal1, animal2, offspring);

        this.registerEntity(offspring, world);

        animal1.procreation.current = animal1.procreation.max ?? 100;
        animal2.procreation.current = animal2.procreation.max ?? 100;
        animal1.removeState([AnimalStates.PROCREATING_SEASON]);
        animal2.removeState([AnimalStates.PROCREATING_SEASON]);
    }

    private static createOffspring(animal1: Animal, animal2: Animal, world: World): Animal {
        const offspringPosition = this.findAdjacentPosition(animal1.position, world) ?? animal1.position;

        const avgStat = (a: number, b: number) => Math.round((a + b) / 2);
        return new Animal(
            Random.generateID(),
            offspringPosition,
            { current: avgStat(animal1.lifespan.max ?? 150, animal2.lifespan.max ?? 150), max: avgStat(animal1.lifespan.max ?? 150, animal2.lifespan.max ?? 150) },
            [],
            [AnimalStates.NORMAL],
            animal1.animalSpecies,
            { current: avgStat(animal1.hunger.max ?? 50, animal2.hunger.max ?? 50), max: avgStat(animal1.hunger.max ?? 100, animal2.hunger.max ?? 100) },
            { current: animal2.thirst.max ?? 50, max: animal1.thirst.max ?? 100 },
            { current: animal2.procreation.max ?? 100, min: animal1.procreation.min ?? 1, max: animal2.procreation.max ?? 100 },
            animal1.diet,
            avgStat(animal1.speed, animal2.speed),
            avgStat(animal1.visionRadius, animal2.visionRadius),

        );
    }

    // Plant
    static canSpread(plant: Plant): boolean {
        return (
            plant.entityStates.includes(PlantStates.MATURE) &&
            !plant.entityStates.includes(PlantStates.WITHERED) &&
            Math.random() < SPREAD_CHANCE
        );
    }

    static propagatePlant(plant: Plant, world: World): void {
        if (!this.canSpread(plant)) return;

        const position = this.findAdjacentPosition(plant.position, world);
        if (!position) return;

        const seed = this.createSeed(plant, position);

        InheritanceSystem.inheritCharacteristics(plant, plant, seed);
        InheritanceSystem.inheritGenes(plant, plant, seed);

        this.registerEntity(seed, world);
    }

    private static createSeed(parent: Plant, position: Position): Plant {
        switch (parent.plantSpecies) {
            case PlantSpecies.VENOMOUS:
                return PlantFactory.createVenomousPlant({ position });
            case PlantSpecies.RARE:
                return PlantFactory.createRarePlant({ position });
            default:
                return PlantFactory.createCommonPlant({ position });
        }
    }

    // Shared
    private static findAdjacentPosition(origin: Position, world: World): Position | null {
        const candidates: Position[] = [
            { x: origin.x + 1, y: origin.y },
            { x: origin.x - 1, y: origin.y },
            { x: origin.x, y: origin.y + 1 },
            { x: origin.x, y: origin.y - 1 },
        ].filter(p => {
            if (!world.isValidPosition(p)) return false;
            return !(world.livingEntities ?? []).some(
                e => e.position.x === p.x && e.position.y === p.y
            );
        });

        if (candidates.length === 0) return null;
        return candidates[Math.floor(Math.random() * candidates.length)]!;
    }

    private static registerEntity(entity: Animal | Plant, world: World): void {
        if (!world.livingEntities)
            throw new Error("World has no entity list to register entity.");
        world.livingEntities.push(entity);
    }
}