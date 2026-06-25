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
import { Plant } from "./Plant";
import { ANIMAL_NUTRITIONAL_VALUE_MAP } from "../../shared/config/ecosystemConfig";

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

    override update(): void {

    }

    override getNutritionalValue(): number {
        // Definindo valores nutricionais por espécie (isso pode vir de uma config externa depois)

        return ANIMAL_NUTRITIONAL_VALUE_MAP[this.animalSpecie] || 50; // Valor padrão caso não listado
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
        throw new Error("Method not implemented.");
    }
    procreate(): void {
        throw new Error("Method not implemented.");
    }

}