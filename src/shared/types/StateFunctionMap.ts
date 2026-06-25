import { EntityState } from '../../domain/enums/states_enums/EntityState';

export type StateFunctionMap = {
    state: EntityState,
    strategy: Function
}[];
