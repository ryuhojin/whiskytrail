import { create } from "zustand";
import axiosInstance from "../common/axiosInstance";

export interface User {
  user_id: number;
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  initializeAuth: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user: User | null) => set({ user }),
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { payload } = response.data.data;
      set({ user: payload });
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
      set({ user: null });
    }
  },

  // 토큰 갱신: 만료된 accessToken 대신, 서버로부터 새로운 accessToken 발급받기
  refreshAccessToken: async () => {
    try {
      const response = await axiosInstance.post("/auth/refresh");
      if (!response.data.data) return;
      const { payload } = response.data.data;
      set({ user: payload });
    } catch (error) {
      console.error("Refresh token failed:", error);
      throw error;
    }
  },
  initializeAuth: (user) => {
    set({ user });
  },
}));
