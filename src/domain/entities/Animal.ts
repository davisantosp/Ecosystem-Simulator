import { AnimalSpecies } from "../enums/entities_enums/AnimalSpecies";
import { ST } from "../../shared/types/ST";
import { Distance } from "../../shared/types/Distance";
import { MovementSpeed } from "../../shared/types/MovementSpeed";
import { LivingEntity } from "./LivingEntity";
import { Position } from "../../shared/types/Position";
import { Gene } from "../../shared/types/Gene";
import { EntityState } from "../enums/states_enums/EntityState";
import { LivingEntitiesTypes } from "../enums/entities_enums/LivingEntitiesTypes";
import { ID } from "../../shared/types/ID";
import { Diet } from "../../shared/types/Diet";
import { AnimalActionsInterface } from "../../shared/actions_interfaces/AnimalActionsInterface";
import { ANIMAL_NUTRITIONAL_VALUE_MAP } from "../../shared/config/ecosystemConfig";
import { World } from "../../core/World";
import { MovementSystem } from "../../systems/movement/MovementSystem";
import { AnimalStates } from "../enums/states_enums/AnimalStates";

export class Animal extends LivingEntity implements AnimalActionsInterface {
    constructor(
        id: ID,
        position: Position,

        lifespan: ST,
        genes: Gene[],
        entityState: EntityState[],

        public readonly animalSpecie: AnimalSpecies,
        public hunger: ST,
        public thirst: ST,
        public procreation: ST,
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

    override update(world?: World): void {
        if (!world) throw new Error("World not created");

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
        MovementSystem.moveEntity(this, world);
    }

    private syncStates(): void {
        const hungerRatio = this.hunger.current / (this.hunger.max ?? this.hunger.current);
        const thirstRatio = this.thirst.current / (this.thirst.max ?? this.thirst.current);
        const procreationRatio = this.procreation.current / (this.procreation.max ?? this.procreation.current);

        if (hungerRatio < 0.4)
            this.updateState([AnimalStates.HUNGRY]);
        else
            this.removeState([AnimalStates.HUNGRY]);
        if (thirstRatio < 0.4)
            this.updateState([AnimalStates.THIRSTY]);
        else
            this.removeState([AnimalStates.THIRSTY]);
        if (procreationRatio < 0.3)
            this.updateState([AnimalStates.PROCREATING_SEASON]);
        else
            this.removeState([AnimalStates.PROCREATING_SEASON]);
    }

    override getNutritionalValue(): number {
        return ANIMAL_NUTRITIONAL_VALUE_MAP[this.animalSpecie] || 50;
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

        food.die();
    }
    drink(): void {
        this.thirst.current = this.thirst.max ?? 100;
    }
}