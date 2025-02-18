import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => config);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshAccessToken } = useAuthStore.getState();
      try {
        await refreshAccessToken();
        // 원래 요청을 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 재발급 실패 시 로그아웃 처리 등 추가 로직
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
