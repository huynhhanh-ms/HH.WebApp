import type { Expense } from 'src/domains/dto/expense';

import axiosClient from '../axios-client';
import { apiEndpoint } from '../endpoint';

import type { ResponseObject } from '../response';

export const ExpenseApi = {
  gets: async (): Promise<Expense[]> => {
    try {
      const response = await axiosClient.get<ResponseObject<Expense[]>>(
        apiEndpoint.Expense
      );
      const result = response.data;
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  create: async (data: Expense): Promise<Expense> => {
    try {
      const response = await axiosClient.post<ResponseObject<Expense>>(
        apiEndpoint.Expense,
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
      await axiosClient.delete<ResponseObject<Expense>>(
        `${apiEndpoint.Expense}/${id}`
      );
    } catch (error) {
      throw new Error(error);
    }
  }

};
