import { LivingEntity } from "../../domain/entities/LivingEntity"
import { DietTypes } from "../../domain/enums/other_enums/DietTypes"

export type Diet = {
    type: DietTypes,
    food: LivingEntity[]
}