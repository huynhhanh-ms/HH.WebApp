
import type { Session } from 'src/domains/dto/session';

import axiosClient from '../axios-client';
import { apiEndpoint } from '../endpoint';

import type { ResponseObject } from '../response';

export const SessionApi = {
  gets: async (): Promise<Session[]> => {
    try {
      const response = await axiosClient.get<ResponseObject<Session[]>>(
        apiEndpoint.Session
      );
      const result = response.data;
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  create: async (data: Session): Promise<Session> => {
    try {
      const response = await axiosClient.post<ResponseObject<Session>>(
        apiEndpoint.Session,
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
      await axiosClient.delete<ResponseObject<Session>>(
        `${apiEndpoint.Session}/${id}`
      );
    } catch (error) {
      throw new Error(error);
    }
  }

};
