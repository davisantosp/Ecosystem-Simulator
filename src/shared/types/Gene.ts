import { GeneTypes } from "../../domain/enums/other/GeneTypes";

export type Gene = {
    id: string,
    geneType: GeneTypes,

    geneModification(modification: any): void
}