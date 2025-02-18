"use client";

import { useAuthStore, User } from "@/libs/stores/authStore";
import { useEffect } from "react";

interface AuthInitializerProps {
  initUser: User | null;
}

const AuthInitializer = ({ initUser }: AuthInitializerProps) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  useEffect(() => {
    if (initUser) {
      initializeAuth(initUser);
    }
  }, [initUser, initializeAuth]);

  return null;
};
export default AuthInitializer;
