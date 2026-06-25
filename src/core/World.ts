import { Animal } from "../domain/entities/Animal";
import { LivingEntity } from "../domain/entities/LivingEntity";
import { Plant } from "../domain/entities/Plant";
import { LivingEntitiesTypes } from "../domain/enums/entities_enums/LivingEntitiesTypes";
import { AnimalStates } from "../domain/enums/states_enums/AnimalStates";
import { PlantStates } from "../domain/enums/states_enums/PlantStates";
import { Distance } from "../shared/types/Distance";
import { Position } from "../shared/types/Position";

export class World {
    constructor(
        public readonly width: Distance,
        public readonly height: Distance,
        public livingEntities?: LivingEntity[],
    ) {
    }

    public isValidPosition(position: Position): boolean {
        return position.x >= 0
            && position.x < this.width
            && position.y >= 0
            && position.y < this.height;
    }

    public deleteDeadEntities(): void {
        if (!this.livingEntities?.length) return;

        this.livingEntities = this.livingEntities.filter(entity => {
            if (LivingEntity.isOfType(entity, LivingEntitiesTypes.ANIMAL)) {
                return !entity.entityStates.includes(AnimalStates.DEAD);
            }
            if (LivingEntity.isOfType(entity, LivingEntitiesTypes.PLANT)) {
                return !entity.entityStates.includes(PlantStates.WITHERED);
            }
            return true;
        });
    }
}