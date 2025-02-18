import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { setAccessToken, setUser } = useAuthStore();
      try {
        // 토큰 재발급 API 호출 (필요에 따라 withCredentials 등 설정)
        const { data } = await axiosInstance.post("/auth/refresh");
        const { accessToken, payload } = data.data;

        // 스토어에 새 토큰 업데이트
        setAccessToken(accessToken);
        setUser(payload);
        // 원래 요청의 헤더에 새 토큰 설정
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

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
