import { create } from "zustand";
import axiosInstance from "../common/axiosInstance";

export interface User {
  user_id: number;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  initializeAuth: (accessToken: string | null, user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  // 액세스 토큰이 변경될 때 axiosInstance의 헤더에도 반영
  setAccessToken: (token: string | null) => {
    axiosInstance.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
    set({ accessToken: token });
  },

  setUser: (user: User | null) => set({ user }),
  // 초기 인증 정보를 한번에 설정하는 함수
  clearAuth: () => {
    axiosInstance.defaults.headers.common["Authorization"] = "";
    set({ user: null, accessToken: null });
  },

  // 로그인: 이메일/비밀번호로 로그인 요청 후, 응답에서 accessToken과 user 정보를 저장합니다.
  // refreshToken은 HttpOnly 쿠키로 설정됩니다.
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { accessToken, payload } = response.data.data;
      const user = payload;
      // axiosInstance 헤더에 accessToken 설정
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
      set({ accessToken, user });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  // 로그아웃: 서버에 로그아웃 요청 후 상태 초기화
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ accessToken: null, user: null });
      axiosInstance.defaults.headers.common["Authorization"] = "";
    }
  },

  // 토큰 갱신: 만료된 accessToken 대신, 서버로부터 새로운 accessToken 발급받기
  refreshAccessToken: async () => {
    try {
      const response = await axiosInstance.post("/auth/refresh");
      if (!response.data.data) return;
      const { accessToken, payload } = response.data.data;
      const user = payload;
      // axiosInstance 헤더에 accessToken 설정
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
      set({ accessToken, user });
    } catch (error) {
      console.error("Refresh token failed:", error);
      throw error;
    }
  },
  initializeAuth: (accessToken, user) => {
    set({ accessToken, user });
  },
}));
