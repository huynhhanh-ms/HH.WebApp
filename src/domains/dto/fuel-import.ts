export interface FuelImport {
  id: number;
  tankName: string;
  tankId: string;
  importVolume: number;
  importPrice: number;
  weight: number;
  totalCost: number;
  importDate: Date;
}