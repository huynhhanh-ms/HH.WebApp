// export enum WeighingStatus {
//   PENDING = 'pending',
//   COMPLETED = 'completed',
//   CANCELLED = 'cancelled',
//   // Add other statuses as needed
// }

import type { BaseEntity } from "./base-entity";

export interface WeighingHistory extends BaseEntity {
  // serial?: number;
  id?: number;
  customerName?: string;
  address?: string;
  goodsType?: string;
  licensePlate?: string;
  totalWeight?: number;
  vehicleWeight?: number;
  goodsWeight?: number;
  impurityRatio?: number;
  impurityWeight?: number;
  goodsWeightAfter?: number;
  price?: number;
  totalCost?: number;
  totalWeighingDate?: Date;
  vehicleWeighingDate?: Date;
  note?: string;
  vehicleImages?: string[];
}
