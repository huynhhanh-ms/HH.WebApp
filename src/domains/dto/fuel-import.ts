import type { Tank } from "./tank";
import type { FuelImportSession } from "./fuel-import-session";

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
  totalSalePrice: number;
  volumeUsed: string;
  density: number;
  profit: number;
  fuelImportSessions: FuelImportSession[];
}