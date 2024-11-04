import axiosClient from '../axios-client';

interface UploadParams {
  file: Blob | string | File;
  storagePath?: string;
}

const BASE_PATH = '/file';
export const FileApi = {
  uploadFile: async ({ file, storagePath = '' }: UploadParams): Promise<string> => {
    try {
      const response = await axiosClient.post(
        `${BASE_PATH}/upload`,
        {
          file,
        },
        {
          params: {
            storagePath,
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (e) {
      console.log(`api${e}`);
      throw new Error(e);
    }
  },
};
