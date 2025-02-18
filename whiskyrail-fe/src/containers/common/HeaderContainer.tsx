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
    if (!hasInitialized) {
      if (initUser) {
        setUser(initUser);
        setDisplayUser(initUser);
        setHasInitialized(true);
      } else if (user) {
        setUser(user);
        setDisplayUser(user);
        setHasInitialized(true);
      }
    } else {
      // 초기화가 완료된 이후엔 store의 user 값에 따라 displayUser를 업데이트합니다.
      setDisplayUser(user);
    }
  }, [user, initUser, hasInitialized, setUser]);
  const handleLogout = () => {
    logout();
  };

  return <HeaderView displayUser={displayUser} onLogout={handleLogout} />;
}
