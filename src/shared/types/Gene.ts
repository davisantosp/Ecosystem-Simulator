import { GeneTypes } from "../../domain/enums/other_enums/GeneTypes";

export type Gene = {
    id: string,
    geneType: GeneTypes,

    geneModification(modification: any): void
}