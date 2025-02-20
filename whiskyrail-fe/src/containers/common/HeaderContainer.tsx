"use client";

import { useEffect, useState } from "react";
import { User, useAuthStore } from "@/libs/stores/authStore";
import HeaderView from "@/components/layout/HeaderView";
import { NavButton, NavLinkButton } from "@/components/common/Button";
import {
  TbBarrel,
  TbDropletStar,
  TbGlassFullFilled,
  TbMapPinSearch,
} from "react-icons/tb";
//import { HeaderView } from "@/components/layout/HeaderView";
//import { NavView } from "@/components/layout/NavView";

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

  return (
    <>
      <HeaderView>
        <HeaderView.Module>
          <HeaderView.NavBox>
            <HeaderView.Title />
            {displayUser && <HeaderView.SearchBox />}
          </HeaderView.NavBox>
          <HeaderView.NavBox>
            {!displayUser && <NavLinkButton href="/login">로그인</NavLinkButton>}
            {displayUser && <NavButton onClick={handleLogout}>로그아웃</NavButton>}
          </HeaderView.NavBox>
        </HeaderView.Module>
        {displayUser && (
          <HeaderView.ModuleFlat>
            <HeaderView.NavBox>
              <NavLinkButton href="/review" icon={<TbGlassFullFilled />}>
                위스키
              </NavLinkButton>
              <NavLinkButton href="/review" icon={<TbBarrel />}>
                캐스크
              </NavLinkButton>
              <NavLinkButton
                href="/review"
                hideOnMobile
                icon={<TbMapPinSearch />}
              >
                지역
              </NavLinkButton>
              <NavLinkButton href="/review" icon={<TbDropletStar />}>
                리뷰
              </NavLinkButton>
            </HeaderView.NavBox>
          </HeaderView.ModuleFlat>
        )}
      </HeaderView>
    </>
  );
}
