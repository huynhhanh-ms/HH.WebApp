

import type { FuelImport } from 'src/domains/dto/fuel-import';

import axiosClient from '../axios-client';
import { apiEndpoint } from '../endpoint';

import type { ResponseObject } from '../response';

export const FuelImportApi = {
  gets: async (): Promise<FuelImport[]> => {
    try {
      const response = await axiosClient.get<ResponseObject<FuelImport[]>>(
        apiEndpoint.FuelImport
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
