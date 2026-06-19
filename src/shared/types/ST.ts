//System Ticks
export type ST =
    | number
    | {
        current: number,
        max: number
        min?: number,
    }