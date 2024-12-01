import type { Expense } from "./expense";
import type { PetrolPump } from "./petrol-pump";

export interface Session {
  id: number;
  totalRevenue: number;
  cashForChange: number;
  startDate: string;
  endDate: string;
  status: string;
  volumeSold: number;
  note?: string;

  totalExpense?: number;

  petrolPumps: PetrolPump[];
  expenses?: Expense[];
}