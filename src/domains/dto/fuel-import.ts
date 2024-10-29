import type { Tank } from "./tank";

export interface FuelImport {
  id: number;
  tank: Tank;
  tankId: string;
  importVolume: number;
  importPrice: number;
  weight: number;
  totalCost: number;
  importDate: Date;
  status: string;
  totalSalePrice: string;
  volumeUsed: string;
  density: number;
}