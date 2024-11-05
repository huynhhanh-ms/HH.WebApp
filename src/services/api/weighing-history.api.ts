

import type { WeighingHistory } from 'src/domains/dto/weighing-history';

import axiosClient from '../axios-client';
import { apiEndpoint } from '../endpoint';

import type { ResponseObject } from '../response';

interface BaseParams {
  
}

interface WeighingHistoryApiParams extends BaseParams{
  startDate?: Date;
  endDate?: Date;
}

export const WeighingHistoryApi = {
  gets: async (params: WeighingHistoryApiParams): Promise<WeighingHistory[]> => {
    try {
      // Fix Utc date time - hardcode +7 to compare utc with local time in backend
      const fixStartDate = params?.startDate ? new Date(params.startDate) : undefined;
      if (fixStartDate) {
        fixStartDate.setHours(fixStartDate.getHours() + 7);
      }
      const fixEndDate = params?.endDate ? new Date(params.endDate) : undefined;
      if (fixEndDate) {
        fixEndDate.setHours(fixEndDate.getHours() + 7);
      }

      const response = await axiosClient.get<ResponseObject<WeighingHistory[]>>(
        apiEndpoint.WeighingHistory,
        {
          params: {
            ...(params?.startDate ? { "startDate": fixStartDate } : {}),
            ...(params?.endDate ? { "endDate": fixEndDate } : {}),
          }
        }
      );
      const result = response.data;
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  get: async (data: number): Promise<WeighingHistory> => {
    try {
      const response = await axiosClient.get<ResponseObject<WeighingHistory>>(
        `${apiEndpoint.WeighingHistory}/${data}`
      );
      const result = response.data;
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  update: async (data: WeighingHistory): Promise<void> => {
    try {
      await axiosClient.put<ResponseObject<WeighingHistory>>(
        `${apiEndpoint.WeighingHistory}`,
        data
      );
    } catch (error) {
      throw new Error(error);
    }
  },

  close: async (id: number): Promise<void> => {
    try {
      await axiosClient.put<ResponseObject<WeighingHistory>>(
        `${apiEndpoint.WeighingHistory}/close`,
        id
      );
    } catch (error) {
      throw new Error(error);
    }
  },

  create: async (data: WeighingHistory): Promise<number> => {
    try {
      const response = await axiosClient.post<ResponseObject<number>>(
        apiEndpoint.WeighingHistory,
        data
      );
      const result = response.data;
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await axiosClient.delete<ResponseObject<WeighingHistory>>(
        `${apiEndpoint.WeighingHistory}/${id}`
      );
    } catch (error) {
      throw new Error(error);
    }
  }

};
