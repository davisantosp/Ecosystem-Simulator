import { World } from "../../core/World";
import { Animal } from "../../domain/entities/Animal";
import { LivingEntity } from "../../domain/entities/LivingEntity";
import { LivingEntitiesTypes, AnimalStates, PlantStates } from "../../domain/enums";
import { Position } from "../../shared/types/Position";
import { Calculations } from "../utils/Calculations";

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

    static searchForWater(animal: Animal, world: World): Position | null {
        if (!world.waterSources?.length) return null;

        let closestWater: Position | null = null;
        let minDistance = Infinity;

        for (const waterPos of world.waterSources) {
            const distance = Calculations.distanceBetween(animal.position, waterPos);
            if (distance <= animal.visionRadius && distance < minDistance) {
                minDistance = distance;
                closestWater = waterPos;
            }
        }

        return closestWater;
    }

    static searchForMate(animal: Animal, world: World): Animal | null {
        const entitiesInWorld = world.livingEntities;
        if (!entitiesInWorld) return null;

        const animalVisionRange = animal.visionRadius;
        const entitiesWithinRange = entitiesInWorld.filter(x =>
            x.id !== animal.id &&
            x.entityType === LivingEntitiesTypes.ANIMAL &&
            (x as Animal).animalSpecies === animal.animalSpecies &&
            x.entityStates.includes(AnimalStates.PROCREATING_SEASON) &&
            !x.entityStates.includes(AnimalStates.DEAD) &&
            Calculations.distanceBetween(animal.position, x.position) <= animalVisionRange
        );

        return (this.closestEntityTarget(animal, entitiesWithinRange) as Animal);

    }

    private static closestEntityTarget(animal: Animal, entities: LivingEntity[]): LivingEntity | null {
        if (!entities || entities.length === 0)
            return null;

        let closestTarget = entities[0]!;
        let closestDistance = Calculations.distanceBetween(animal.position, closestTarget.position);

        for (const entity of entities) {
            const distance = Calculations.distanceBetween(animal.position, entity.position);
            if (distance < closestDistance) {
                closestTarget = entity;
                closestDistance = distance;
            }
        }
        return closestTarget;
    }
}