import { GeneType } from "../../domain/enums/other/GeneTypes";

export type Gene = {
    id: string,
    geneType: GeneType,

    geneModification(modification: any): void
}