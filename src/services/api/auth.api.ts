import type { LoginRequest } from 'src/domains/dto/login-request';
import type { AuthResponse } from 'src/domains/dto/auth-response';
import type { AccountResponse } from 'src/domains/dto/account-response';

import { enqueueSnackbar } from 'notistack';

import axiosClient from '../axios-client';
import { apiEndpoint } from '../endpoint';

import type { ResponseObject } from '../response';

export const AuthApi = {
  login: async (payload: LoginRequest): Promise<string> => {
    try {
      const response = await axiosClient.post<ResponseObject<AuthResponse>>(
        `${apiEndpoint.Auth}/login`,
        payload
      );
      const result = response.data;
      return result?.data?.accessToken;

    } catch (error) {
      enqueueSnackbar(error.message);
      return '';
    }
  },
  me: async (token: string): Promise<AccountResponse> => {
    try {
      const response = await axiosClient.get<ResponseObject<AccountResponse>>(
        `${apiEndpoint.Auth}/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
