import { World } from "../../core/World";
import { Animal } from "../../domain/entities/Animal";
import { LivingEntity } from "../../domain/entities/LivingEntity";
import { LivingEntitiesTypes } from "../../domain/enums/entities_enums/LivingEntitiesTypes";
import { TerrainTypes } from "../../domain/enums/other_enums/TerrainTypes";
import { AnimalStates } from "../../domain/enums/states_enums/AnimalStates";
import { PlantStates } from "../../domain/enums/states_enums/PlantStates";
import { Position } from "../../shared/types/Position";
import { Calculations } from "../systems_functions/Calculations";

export class VisionSystem {
    static searchForTarget(
        animal: Animal,
        world: World,
        targetType: LivingEntitiesTypes | LivingEntitiesTypes[]
    ): LivingEntity | null {

        const entitiesInWorld = world.livingEntities;
        if (!entitiesInWorld)
            return null;

        // Since targetType can be an object or a list
        const isTargetType = (entityType: LivingEntitiesTypes): boolean => {
            if (Array.isArray(targetType)) {
                return targetType.includes(entityType);
            }
            return entityType === targetType;
        };

        const animalVisionRange = animal.visionRadius;
        const entitiesWithinRange = entitiesInWorld.filter(x =>
            isTargetType(x.entityType) &&
            x.id !== animal.id &&
            !x.entityStates.includes(AnimalStates.DEAD) &&
            !x.entityStates.includes(PlantStates.WITHERED) &&
            Calculations.distanceBetween(animal.position, x.position) <= animalVisionRange
        );

        return this.closestEntityTarget(animal, entitiesWithinRange);
    }

    static searchForTerrain(animal: Animal, world: World, terrainType: TerrainTypes): Position {
        throw new Error("Function not implemented");
    }

    private static closestEntityTarget(animal: Animal, entities: LivingEntity[]): LivingEntity | null {
        if (!entities || entities.length === 0)
            return null;

        let closestTarget: LivingEntity = entities[0]!;
        for (const entity of entities) {
            const distance = Calculations.distanceBetween(animal.position, entity.position);
            const closestDistance = Calculations.distanceBetween(animal.position, closestTarget.position);
            if (distance < closestDistance)
                closestTarget = entity;
        }
        return closestTarget;
    }
}