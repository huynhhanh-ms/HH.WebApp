// Define an enum for weighing_status if it has specific values
export enum WeighingStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  // Add other statuses as needed
}

export interface WeighingHistory {
  id: number;
  customerName?: string;
  address?: string;
  goodsType?: string;
  licensePlate?: string;
  totalWeight?: number;
  vehicleWeight?: number;
  goodsWeight?: number;
  price?: number;
  total?: number;
  totalWeighingDate?: string;
  vehicleWeighingDate?: string;
  note?: string;
  vehicleImages?: string[];
  createdDate?: string;
  updatedDate?: string;
  createdBy?: number;
  updatedBy?: number;
}
