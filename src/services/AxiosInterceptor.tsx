import type { PropsWithChildren } from "react";
import type { AxiosError, AxiosResponse} from "axios";

import React, { useEffect } from "react";
// import { InternalAxiosRequestConfig } from "axios";

import axiosClient from "./axios-client";

const AxiosInterceptor: React.FC<PropsWithChildren<{ key?: string }>> = ({
  children,
}) => {
  // const excludedEndpoints = ['/login', '/refresh-token'];
  useEffect(() => {
    // console.log("accessToken at interceptor = ", accessToken);

    const resInterceptor = (response: AxiosResponse) => {
      if (response.data?.data?.accessToken) {
        // setToken(response.data.data);
      }
      return response;
    };

    const errInterceptor = async (error: AxiosError) => {

      const data = error?.response?.data as ({ Message: string, message: string });
      // why this line is needed? i dont know why message have object with sensitive and not?? //jinergenkai fixlate
      const message = data.Message ?? data.message;

      if (error.response) {
        switch (error.response.status) {

          // case 403: case 401: case 404:
          //   break;

          case 500: case 400:
            console.log({ message });
            throw new Error(message);

          default:
            throw new Error(message);
        }
      }

      return Promise.resolve(error);
    };
    // const reqInterceptor = axiosClient.interceptors.request.use(
    //   (config: InternalAxiosRequestConfig) => {
    //     const { url } = config;
    //     console.log({ url });

    //     if (!excludedEndpoints.some(endpoint => url.includes(endpoint)) && accessToken) {
    //       config.headers.Authorization = `Bearer ${accessToken}`
    //     }
    //     return config;
    //   },
    //   (err) =>
    //     // if(!isLoading) openLoading("FULL");
    //     Promise.reject(err)

    // );
    const interceptor = axiosClient.interceptors.response.use(
      resInterceptor,
      errInterceptor,
    );

    return () => {
      axiosClient.interceptors.response.eject(interceptor);
      // axiosClient.interceptors.request.eject(reqInterceptor);
    };
  }, []);
  return <>{children}</>;
};

export default AxiosInterceptor;






















// import axios from 'axios';
// import { useEffect } from 'react';

// const AxiosInterceptor: React.FC<React.PropsWithChildren<{ key?: string }>> = ({ children }) => {

//   useEffect(() => {
//     const responseInterceptor = axios.interceptors.response.use(
//       (response) => 
//         // Return response if everything is okay
//          response
//       ,
//       (error) => {
//         console.log("interceptor");
//         // Check if the response has a status code and is 400
//         if (error.response && error.response.status === 400) {
//           // Extract the custom message from the response data
//           const errorMessage = error.response.data?.message || 'Bad Request';

//           // Pass the custom message to the rejection to handle in useMutation
//           return Promise.reject(new Error(errorMessage));
//         }
//         // Pass other errors as usual
//         return Promise.reject(error);
//       }
//     );

//     // Cleanup the interceptor when component unmounts
//     return () => {
//       axios.interceptors.response.eject(responseInterceptor);
//     };
//   }, []);

//   return <>{children}</>;
// };

// export default AxiosInterceptor;