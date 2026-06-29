import { GeneTypes } from "../../../domain/enums";
import { DietShiftGene } from "../animal_genes/DietShiftGene";
import { HungerGene } from "../animal_genes/HungerGene";
import { ThirstGene } from "../animal_genes/ThirstGene";
import { SpeedGene } from "../animal_genes/SpeedGene";
import { VisionGene } from "../animal_genes/VisionGene";
import { GeneStrategyInterface } from "../GeneStrategyInterface";
import { LifespanGene } from "../other_genes/LifespanGene";
import { GrowthRateGene } from "../plant_genes/GrowthRateGene";
import { NutritionalValueGene } from "../plant_genes/NutritionalValueGene";
import { RarePlantGene } from "../plant_genes/RarePlantGene";
import { VenomousPlantGene } from "../plant_genes/VenomousPlantGene";

export const GeneStrategyRegistry = new Map<GeneTypes, GeneStrategyInterface>([
    // General Genes
    [GeneTypes.LIFESPAN_GENE, new LifespanGene()],

    // Animal Genes
    [GeneTypes.SPEED_GENE, new SpeedGene()],
    [GeneTypes.VISION_GENE, new VisionGene()],
    [GeneTypes.HUNGER_MAX_GENE, new HungerGene()],
    [GeneTypes.THIRST_MAX_GENE, new ThirstGene()],
    [GeneTypes.DIET_SHIFT_GENE, new DietShiftGene()],

    // Plant Genes
    [GeneTypes.GROWTH_RATE_GENE, new GrowthRateGene()],
    [GeneTypes.NUTRITIONAL_VALUE_MAX_GENE, new NutritionalValueGene()],
    [GeneTypes.RARE_PLANT_GENE, new RarePlantGene()],
    [GeneTypes.VENOMOUS_PLANT_GENE, new VenomousPlantGene()],
]);
