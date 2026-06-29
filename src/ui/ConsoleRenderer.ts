import { World } from "../core/World";
import { Animal } from "../domain/entities/Animal";
import { Plant } from "../domain/entities/Plant";
import { AnimalSpecies, LivingEntitiesTypes } from "../domain/enums";

export class ConsoleRenderer {
    static render(world: World, tick: number): void {
        console.clear();
        console.log(`Tick: ${tick}`);
        this.renderGrid(world);
        this.renderStats(world);
    }

    private static renderGrid(world: World): void {
        const grid: string[][] = Array.from({ length: world.height }, () =>
            Array(world.width).fill(".")
        );

        for (const entity of world.livingEntities ?? []) {
            const { x, y } = entity.position;
            if (entity.entityType === LivingEntitiesTypes.ANIMAL) {
                if ((entity as Animal).animalSpecies === AnimalSpecies.MOOSE)
                    grid[y]![x] = "M";
                else if ((entity as Animal).animalSpecies === AnimalSpecies.WOLF)
                    grid[y]![x] = "W";
                else if ((entity as Animal).animalSpecies === AnimalSpecies.RABBIT)
                    grid[y]![x] = "R";
            } else {
                grid[y]![x] = "P";
            }
        }
        for (const ponds of world.waterSources ?? []) {
            const { x, y } = ponds;
            grid[y]![x] = "~";
        }

        const border = "+" + "-".repeat(world.width) + "+";
        console.log(border);
        for (const row of grid) {
            console.log("|" + row.join("") + "|");
        }
        console.log(border);
    }

    private static renderStats(world: World): void {
        const animals = (world.livingEntities ?? [])
            .filter(e => e.entityType === LivingEntitiesTypes.ANIMAL) as Animal[];
        const plants = (world.livingEntities ?? [])
            .filter(e => e.entityType === LivingEntitiesTypes.PLANT) as Plant[];

        console.log(`Animals: ${animals.length}  Plants: ${plants.length}`);
        for (const a of animals) {
            console.log(
                `[${a.animalSpecies}] pos:(${a.position.x},${a.position.y}) ` +
                `hunger:${a.hunger.current}/${a.hunger.max} ` +
                `thirst:${a.thirst.current}/${a.thirst.max} ` +
                `states:[${a.entityStates.join(", ")}]`
            );
        }
    }
}