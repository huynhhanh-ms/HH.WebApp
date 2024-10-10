

import type { ExpenseType } from 'src/domains/dto/expense-type';

import axiosClient from '../axios-client';
import { apiEndpoint } from '../endpoint';

import type { ResponseObject } from '../response';

export const ExpenseTypeApi = {
  gets: async (): Promise<ExpenseType[]> => {
    try {
      const response = await axiosClient.get<ResponseObject<ExpenseType[]>>(
        apiEndpoint.ExpenseType
      );
      const result = response.data;
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  create: async (data: ExpenseType): Promise<ExpenseType> => {
    try {
      const response = await axiosClient.post<ResponseObject<ExpenseType>>(
        apiEndpoint.ExpenseType,
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
      await axiosClient.delete<ResponseObject<ExpenseType>>(
        `${apiEndpoint.ExpenseType}/${id}`
      );
    } catch (error) {
      throw new Error(error);
    }
  }

};
