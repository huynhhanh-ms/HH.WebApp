/* eslint-disable no-restricted-syntax */


import type { WeighingHistory } from 'src/domains/dto/weighing-history';

import { defaultNumber, isEmptyOrZero } from 'src/utils/global-util';

import { WeighingTable } from './db';
import axiosClient from '../../axios-client';
import { apiEndpoint } from '../../endpoint';

import type { ResponseObject } from '../../response';

interface BaseParams {
  
}

interface WeighingHistoryApiParams extends BaseParams{
  startDate?: Date;
  endDate?: Date;
}

export const WeighingHistoryOffline = {
  gets: async (params: WeighingHistoryApiParams): Promise<WeighingHistory[]> => {
    try {
      let localData = await WeighingTable.toArray();

      if (params.startDate || params.endDate) {
        localData = localData.filter(item => {
          if (!item.createdAt) return false;
          const createdAt = new Date(item.createdAt);
          return (!params.startDate || createdAt >= params.startDate) &&
                 (!params.endDate || createdAt <= params.endDate);
        });
      }

      return localData;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu offline:", error);
      throw new Error("Không thể lấy dữ liệu từ IndexedDB");
    }
  },

      // Fix Utc date time - hardcode +7 to compare utc with local time in backend
      // const fixStartDate = params?.startDate ? new Date(params.startDate) : undefined;
      // if (fixStartDate) {
      //   fixStartDate.setHours(fixStartDate.getHours() + 7);
      // }
      // const fixEndDate = params?.endDate ? new Date(params.endDate) : undefined;
      // if (fixEndDate) {
      //   fixEndDate.setHours(fixEndDate.getHours() + 7);
      // }

      // Get data from server
      // axiosClient.get<ResponseObject<WeighingHistory[]>>(
      //   apiEndpoint.WeighingHistory,
      //   {
      //     params: {
      //       ...(params?.startDate ? { "startDate": fixStartDate } : {}),
      //       ...(params?.endDate ? { "endDate": fixEndDate } : {}),
      //     }
      //   }
      // ).then(async (response) => {
      //   const result = response.data;
      //   await WeighingTable.bulkPut(result.data);
      //   return result.data;
      // });

  update: async (id: number, data: WeighingHistory): Promise<void> => {
    console.log("data", data);
    data = normalizeData(data);
    await WeighingTable.update(id, data);
    // syncData();

    // return true;
  },

  create: async (data: WeighingHistory): Promise<boolean> => {
    const newWeighing = getDefaultWeighing(data);
    await WeighingTable.add(newWeighing);
    syncData();

    return true;
  },

  delete: async (id: number): Promise<boolean> => {
    await WeighingTable.delete(id);
    // axiosClient.delete(`${apiEndpoint}/${id}`).catch(err => console.error("Lỗi khi xóa từ API:", err));

    return true;
  }
};

const syncData = async () => {
  // const unsyncedData = await WeighingTable.where("isSync").equals("false").toArray();

  // if (unsyncedData.length === 0) return;

  // console.log(`🔄 Đang đồng bộ ${unsyncedData.length} mục chưa sync...`);

  // for (const item of unsyncedData) {
  //   try {
  //     // const response = await axiosClient.post(apiEndpoint, item);

  //     const response = await axiosClient.put<ResponseObject<WeighingHistory>>(
  //       `${apiEndpoint.WeighingHistory}`,
  //       data
  //     );
  //     if (response.status === 200) {
  //       await WeighingTable.update(item.id, { isSync: true }); // Đánh dấu đã sync
  //       console.log(`✅ Đã đồng bộ cân xe ID ${item.id}`);
  //     }
  //   } catch (error) {
  //     console.error(`⚠️ Lỗi đồng bộ cân xe ID ${item.id}:`, error);
  //   }
  // }
};

// setInterval(syncData, 10000);

// window.addEventListener("online", syncData);

export const normalizeData = (data: WeighingHistory): WeighingHistory => {
  data.goodsWeight = (isEmptyOrZero(data.totalWeight) || isEmptyOrZero(data.vehicleWeight)) ? 0 :  defaultNumber(data.totalWeight) - defaultNumber(data.vehicleWeight);
  data.impurityWeight = Math.round(1.0 * defaultNumber(data.impurityRatio) * data.goodsWeight / 100);
  data.goodsWeightAfter = data.goodsWeight - data.impurityWeight;
  data.totalCost = data.goodsWeightAfter * defaultNumber(data.price);

  return data;
}


export const getDefaultWeighing = (data: Partial<WeighingHistory>): WeighingHistory => ({
    customerName: data.customerName ?? "",
    address: data.address ?? "",
    goodsType: data.goodsType ?? "",
    licensePlate: data.licensePlate ?? "",
    totalWeight: data.totalWeight ?? 0,
    vehicleWeight: data.vehicleWeight ?? 0,
    goodsWeight: data.goodsWeight ?? 0,
    price: data.price ?? 0,
    totalCost: data.totalCost ?? 0,
    totalWeighingDate: data.totalWeighingDate ?? undefined,
    vehicleWeighingDate: data.vehicleWeighingDate ?? undefined,
    goodsWeightAfter: data.goodsWeightAfter ?? 0,
    impurityRatio: data.impurityRatio ?? 0,
    impurityWeight: data.impurityWeight ?? 0,
    isDeleted: data.isDeleted ?? false,
    note: data.note ?? "",
    vehicleImages: data.vehicleImages ?? [],
    createdAt: data.createdAt ?? new Date(), 
    updatedAt: data.updatedAt ?? new Date(),
    // createdBy: data.createdBy ?? 0, 
    // updatedBy: data.updatedBy ?? 0,
    isSync: data.isSync ?? false,
  });