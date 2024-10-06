
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
  // refreshToken: async ()=> {},
  // logout: async ()=> {}
};
