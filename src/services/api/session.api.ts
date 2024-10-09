
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

  get: async (data: number): Promise<Session> => {
    try {
      const response = await axiosClient.get<ResponseObject<Session>>(
        `${apiEndpoint.Session}/${data}`
      );
      const result = response.data;
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  update: async (data: Session): Promise<void> => {
    try {
      await axiosClient.put<ResponseObject<Session>>(
        `${apiEndpoint.Session}`,
        data
      );
    } catch (error) {
      throw new Error(error);
    }
  },

  create: async (data: Session): Promise<number> => {
    try {
      const response = await axiosClient.post<ResponseObject<number>>(
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
