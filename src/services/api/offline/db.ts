import type { WeighingHistory } from 'src/domains/dto/weighing-history';

import Dexie from 'dexie';

// Tạo database
export const db = new Dexie("WeighingDB");

db.version(1).stores({
  weighings: "++id, customerName, address, goodsType, licensePlate, totalWeight, vehicleWeight, goodsWeight, impurityRatio, impurityWeight, goodsWeightAfter, price , totalCost, totalWeighingDate, vehicleWeighingDate, note, createdAt, updatedAt, createdBy, updatedBy, isSync"
});

export const WeighingTable = db.table<WeighingHistory>('weighings');