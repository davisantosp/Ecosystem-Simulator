import { PlantSpecies } from "../enums/entities_enums/PlantSpecies";
import { PlantStates } from "../enums/states_enums/PlantStates";
import { ST } from "../../shared/types/ST";
import { LivingEntity } from "./LivingEntity";
import { Position } from "../../shared/types/Position";
import { Gene } from "../../shared/types/Gene";
import { EntityState } from "../enums/states_enums/EntityState";
import { LivingEntitiesTypes } from "../enums/entities_enums/LivingEntitiesTypes";
import { ID } from "../../shared/types/ID";
import { PlantActionsInterface } from "../../shared/actions_interfaces/PlantActionsInterface";

export class Plant extends LivingEntity implements PlantActionsInterface {
    constructor(
        id: ID,
        position: Position,

        lifespan: ST,
        genes: Gene[],
        entityState: EntityState[],

        public readonly plantSpecies: PlantSpecies,
        public growthRate: ST,
        public nutritionalValue: ST,
    ) {
        super(
            id,
            position,
            LivingEntitiesTypes.PLANT,
            lifespan, genes, entityState
        );
    }

    override update(): void {
        this.lifespan.current--;
        if (this.lifespan.current <= 0) {
            this.die();
            return;
        }

        // Update nutritionalValue
        this.photosynthesize();
        // Update
        this.grow();
    }
    override getNutritionalValue(): number {
        return this.nutritionalValue.current;
    }
    photosynthesize(): void {
        const foodProduction = Math.floor(this.growthRate.current / 10);
        const currentNV = this.nutritionalValue.current;
        const maxNV = this.nutritionalValue.max;

        if (maxNV === undefined) {
            this.nutritionalValue.current = currentNV + foodProduction;
        } else {
            this.nutritionalValue.current = Math.min(currentNV + foodProduction, maxNV);
        }
    }
    grow(): void {
        const currentNV = this.nutritionalValue.current;
        let maxNV: number;
        if (this.nutritionalValue.max !== undefined)
            maxNV = this.nutritionalValue.max;
        else if (this.lifespan.max !== undefined)
            maxNV = this.lifespan.max;
        else
            maxNV = 100;

        const sprout = Math.floor(maxNV / 3);
        const mature = Math.floor((2 * maxNV) / 3);
        if (currentNV >= mature) {
            this.updateState([PlantStates.MATURE]);
            this.removeState([PlantStates.SPROUT, PlantStates.SEED]);
        } else if (currentNV >= sprout) {
            this.updateState([PlantStates.SPROUT]);
            this.removeState([PlantStates.SEED, PlantStates.MATURE]);
        } else {
            this.updateState([PlantStates.SEED]);
            this.removeState([PlantStates.SPROUT, PlantStates.MATURE]);
        }
    }

}