import axios from "axios";

// const BASE_URL = import.meta.env.VITE_DEV_SERVER_URI;
export const BASE_URL = "http://localhost:6789";

const headerObj = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? `${BASE_URL}/api`,
  headers: headerObj,
});

// config interceptor for header
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosClient;