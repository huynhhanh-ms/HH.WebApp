import type { BaseEntity } from "./baseEntity";


export interface Area extends BaseEntity {
    name: string;
    boundaries?: Location[];
    // kitchens?: Kitchen[];
}

export interface AreaAdmin extends Area {
    noOfKitchens: number;
   
}