
import type { Land } from 'src/domains/dto/land';

import axiosClient from '../axios-client';
import { apiEndpoint } from '../endpoint';

const SecondApi = "http://localhost:9000/api";

export const LandApi = {
  gets: async (): Promise<Land[]> => {
    try {
      const response = await axiosClient.get<Land[]>(
        `${SecondApi}${apiEndpoint.Land}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  },
  getBound: async (bound: { lng: number; lat: number }): Promise<Land> => {
    try {
      const response = await axiosClient.get<Land>(
        `${SecondApi}/get-bound`,
        {
          params: bound,
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
};
