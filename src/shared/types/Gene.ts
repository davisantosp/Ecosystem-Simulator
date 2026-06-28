import { GeneTypes } from "../../domain/enums/other/GeneTypes";

export type Gene = {
    geneType: GeneTypes,
    value?: number
}