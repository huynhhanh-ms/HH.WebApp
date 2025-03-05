import type { Land, CreatedLand } from 'src/domains/dto/land';

import { create } from 'domain';

import axiosClient from '../axios-client';
import { apiEndpoint } from '../endpoint';

const SecondApi = 'http://localhost:9000/api';

export const LandApi = {
  gets: async (): Promise<Land[]> => {
    try {
      const response = await axiosClient.get<Land[]>(`${SecondApi}${apiEndpoint.Land}`);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  },
  getBound: async (bound: { lng: number; lat: number }): Promise<Land> => {
    try {
      const response = await axiosClient.get<Land>(`${SecondApi}/get-bound`, {
        params: bound,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  },
  create: async (land: CreatedLand): Promise<any> => {
    try {
      const response = await axiosClient.post<CreatedLand>(`${SecondApi}${apiEndpoint.Land}`, land);

      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  },
  delete: async (id: string): Promise<any> => {
    try {
      const response = await axiosClient.delete(`${SecondApi}${apiEndpoint.Land}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  },
};
