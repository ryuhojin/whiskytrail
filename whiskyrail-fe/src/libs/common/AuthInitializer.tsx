"use client";

import { useAuthStore, User } from "@/libs/stores/authStore";
import { useEffect } from "react";

interface AuthInitializerProps {
  initAccessToken: string | null;
  initUser: User | null;
}

const AuthInitializer = ({
  initAccessToken,
  initUser,
}: AuthInitializerProps) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  useEffect(() => {
    if (initUser && initAccessToken) {
      initializeAuth(initAccessToken, initUser);
    }
  }, [initUser, initAccessToken, initializeAuth]);

  return null;
};
export default AuthInitializer;
