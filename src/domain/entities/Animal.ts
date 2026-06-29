import { AnimalSpecies, EntityState, LivingEntitiesTypes, AnimalStates, PlantSpecies } from "../enums";
import { StatValue } from "../../shared/types/StatValue";
import { Distance } from "../../shared/types/Distance";
import { MovementSpeed } from "../../shared/types/MovementSpeed";
import { LivingEntity } from "./LivingEntity";
import { Position } from "../../shared/types/Position";
import { Gene } from "../../shared/types/Gene";
import { ID } from "../../shared/types/ID";
import { Diet } from "../../shared/types/Diet";
import { AnimalActionsInterface } from "../../shared/interfaces/AnimalActionsInterface";
import { ANIMAL_NUTRITIONAL_VALUE_MAP, ANIMAL_STATE_THRESHOLDS } from "../../shared/config/ecosystemConfig";

export class Animal extends LivingEntity implements AnimalActionsInterface {
    constructor(
        id: ID,
        position: Position,

        lifespan: StatValue,
        genes: Gene[],
        entityState: EntityState[],

        public readonly animalSpecies: AnimalSpecies,
        public hunger: StatValue,
        public thirst: StatValue,
        public procreation: StatValue,
        public diet: Diet,
        public speed: MovementSpeed,
        public visionRadius: Distance
    ) {
        super(
            id,
            position,
            LivingEntitiesTypes.ANIMAL,
            lifespan,
            genes,
            entityState
        );
    }

    override update(): void {
        this.lifespan.current--;
        this.hunger.current--;
        this.thirst.current--;
        if (this.lifespan.current <= 0 || this.hunger.current <= 0 || this.thirst.current <= 0) {
            this.die();
            return;
        }

        const minProcreation = this.procreation.min ?? 0;
        this.procreation.current = Math.max(minProcreation, this.procreation.current - 1);

        this.syncStates();
    }

    private syncStates(): void {
        const hungerRatio = this.hunger.current / (this.hunger.max ?? this.hunger.current);
        const thirstRatio = this.thirst.current / (this.thirst.max ?? this.thirst.current);
        const procreationRatio = this.procreation.current / (this.procreation.max ?? this.procreation.current);

        if (hungerRatio < ANIMAL_STATE_THRESHOLDS.HUNGER_CRITICAL)
            this.updateState([AnimalStates.HUNGRY]);
        else
            this.removeState([AnimalStates.HUNGRY]);
        if (thirstRatio < ANIMAL_STATE_THRESHOLDS.THIRST_CRITICAL)
            this.updateState([AnimalStates.THIRSTY]);
        else
            this.removeState([AnimalStates.THIRSTY]);
        if (procreationRatio < ANIMAL_STATE_THRESHOLDS.PROCREATION_READY)
            this.updateState([AnimalStates.PROCREATING_SEASON]);
        else
            this.removeState([AnimalStates.PROCREATING_SEASON]);
    }

    override getNutritionalValue(): number {
        return ANIMAL_NUTRITIONAL_VALUE_MAP[this.animalSpecies] || 50;
    }

    override die(): void {
        this.updateState([AnimalStates.DEAD]);
    }

    eat(food: LivingEntity): void {
        if (!food) throw new Error("Food is required");

        const nutrition = food.getNutritionalValue();
        const maxH = this.hunger.max;
        const newValue = this.hunger.current + nutrition;
        this.hunger.current = maxH !== undefined ? Math.min(newValue, maxH) : newValue;

        if (food.entityType === LivingEntitiesTypes.PLANT && (food as any).plantSpecies === PlantSpecies.VENOMOUS)
            this.hunger.current = Math.max(0, this.hunger.current - 30);

        food.die();
    }
    drink(): void {
        this.thirst.current = this.thirst.max ?? 100;
    }
}