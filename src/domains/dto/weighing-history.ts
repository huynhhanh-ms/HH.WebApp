// Define an enum for weighing_status if it has specific values
export enum WeighingStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  // Add other statuses as needed
}

export interface WeighingHistory {
  serial?: number;
  id: number;
  customerName?: string;
  address?: string;
  goodsType?: string;
  licensePlate?: string;
  totalWeight?: number;
  vehicleWeight?: number;
  goodsWeight?: number;
  price?: number;
  totalCost?: number;
  totalWeighingDate?: Date;
  vehicleWeighingDate?: Date;
  note?: string;
  vehicleImages?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
}
