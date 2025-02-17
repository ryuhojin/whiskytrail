// app/components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore, User } from "@/libs/stores/authStore";

interface AuthProviderProps {
  initialAccessToken: string | null;
  initialUser: User | null;
  children: React.ReactNode;
}

export default function AuthProvider({
  initialAccessToken,
  initialUser,
  children,
}: AuthProviderProps) {
  // authStore의 initAuth 함수를 사용합니다.
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth(initialAccessToken, initialUser);
  }, [initialAccessToken, initialUser, initAuth]);

  return <>{children}</>;
}
