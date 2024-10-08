export interface Session {
  id: number;
  totalRevenue: number;
  cashForChange: number;
  startDate: string;
  endDate: string;
  fuelPrice: number;
  status: string;
  volumeSold: number;
}