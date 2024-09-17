// import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
// import React, { PropsWithChildren, useEffect } from "react";
// import axiosClient from "./axios-client";
// import useToast from '@/base/hooks/useToast';
// import { useNavigate } from "react-router-dom";
// import { useAppAuth } from "../store/zustand/auth";
// import ProtectedRoute from "@/route/ProtectedRoute";

// const AxiosInterceptor: React.FC<PropsWithChildren<{ key?: string }>> = ({
//   children,
// }) => {
// 	// const {toast} = useToast();
// 	// const {accessToken} = useAppAuth();
//   const navigate = useNavigate();
//   const excludedEndpoints = ['/login', '/refresh-token'];
//   useEffect(() => {
// 		// console.log("accessToken at interceptor = ", accessToken);

//     // const resInterceptor = (response: AxiosResponse) => {
//     //   if (response.data?.data?.accessToken) {
//     //     setToken(response.data.data);
//     //   }
//     //   return response;
//     // };

//     const errInterceptor = async (error: AxiosError) => {

//       const data = error.response.data as ({Message: string, message: string});

//       // why this line is needed? i dont know why message have object with sensitive and not?? //jinergenkai fixlate
//       const message = data.Message ?? data.message;

// 			if(error.response) {
// 				switch(error.response.status){
				
// 					case 403 : 
// 						// route to access denied page
// 						// toast({
// 						// 	variant: "error",
// 						// 	title: "Lỗi",
// 						// 	description: "Không có quyền vào trang này."
// 						// })
// 						break;


// 						case 401 : 
// 						toast({
// 							variant: "error",
// 							title: "Lỗi",
// 							description: "Vui lòng đăng nhập để tiếp tục."
// 						})
// 						navigate("/login")
// 						break;


// 						case 404 : 
// 						console.error("404");
// 						break;


// 						case 500:
//               toast({
//                 variant: "error",
//                 title: "Lỗi",
//                 description: "Hệ thống đang bận! Vui lòng thử lại sau.",
// 			          duration: 5000,
//               })
//               throw new Error(translated);
// 						return Promise.reject();
// 						break;

//             case 415:
//               toast({
//                 variant: "error",
//                 title: "Lỗi",
//                 description: translated,
// 			          duration: 5000,
//               })
//               throw new Error(translated);
// 						return Promise.reject();
// 						break;

// 						case 400: 
//             toast({
// 							variant: "error",
// 							title: "Lỗi",
// 							description: translated,
// 			        duration: 5000,
// 						})
//               throw new Error(translated);
// 						return Promise.reject();
// 						break;


// 					default: 
// 					break;
// 				}
// 				// switch(error.response.status)
// 			}
			
//       return Promise.resolve(error);
//     };
//     const reqInterceptor = axiosClient.interceptors.request.use(
//       (config: InternalAxiosRequestConfig) => {
// 				const url = config.url;
// 				console.log({url});
				
// 				if (!excludedEndpoints.some(endpoint => url.includes(endpoint)) && accessToken) {
// 					config.headers["Authorization"] = `Bearer ${accessToken}`
// 				}
// 				return config;
//       },
//       (err) => {
//         // if(!isLoading) openLoading("FULL");
//         return Promise.reject(err);
//       }
//     );
//     const interceptor = axiosClient.interceptors.response.use(
//       resInterceptor,
//       errInterceptor,
//     );

//     return () => {
//       axiosClient.interceptors.response.eject(interceptor);
//       axiosClient.interceptors.request.eject(reqInterceptor);
//     };
//   }, [accessToken]);
//   return <>{children}</>;
// };

// export default AxiosInterceptor;
