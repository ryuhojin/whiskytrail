"use client";

import { useEffect, useState } from "react";
import { User, useAuthStore } from "@/libs/stores/authStore";
import HeaderView from "@/components/common/HeaderView";

interface HeaderContainerProps {
  initUser: User | null;
}

export default function HeaderContainer({ initUser }: HeaderContainerProps) {
  const { user, logout, setUser } = useAuthStore();
  const [displayUser, setDisplayUser] = useState<User | null>(initUser);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized && initUser) {
      setUser(initUser);
      setDisplayUser(initUser);
      setHasInitialized(true);
    }
  }, [initUser, hasInitialized, setUser]);

  useEffect(() => {
    if (hasInitialized) {
      setDisplayUser(user);
    }
  }, [user, hasInitialized]);

  const handleLogout = () => {
    logout();
  };

  return <HeaderView displayUser={displayUser} onLogout={handleLogout} />;
}
