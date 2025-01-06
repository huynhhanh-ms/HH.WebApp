
import type { Tank } from 'src/domains/dto/tank';

import axiosClient from '../axios-client';
import { apiEndpoint } from '../endpoint';

import type { ResponseObject } from '../response';

export const TankApi = {
  gets: async (): Promise<Tank[]> => {
    try {
      const response = await axiosClient.get<ResponseObject<Tank[]>>(
        apiEndpoint.Tank
      );
      const result = response.data;
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },
  getHistories: async (): Promise<Tank[]> => {
    try {
      const response = await axiosClient.get<ResponseObject<Tank[]>>(
        apiEndpoint.TankHistory
      );
      const result = response.data;
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  saveHistory: async (tankHistories: []): Promise<boolean> => {
    try {
      console.log(tankHistories);
      const response = await axiosClient.post<ResponseObject<boolean>>(
        `${apiEndpoint.TankHistory}/save`,
        {
          "tankHistories": tankHistories.map((tankHistory: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...rest } = tankHistory;
          return {
            tankId: tankHistory.id,
            ...rest
          };
        })
      }
      );
      const result = response.data;
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  }
  // refreshToken: async ()=> {},
  // logout: async ()=> {}
};
