"use client";

import Link from "next/link";
import { User, useAuthStore } from "@/libs/stores/authStore";
import { useEffect, useState } from "react";

interface HeaderProps {
  initUser: User | null;
}
export default function Header({ initUser }: HeaderProps) {
  const { user, logout, setUser } = useAuthStore();
  const [displayUser, setDisplayUser] = useState(initUser);

  useEffect(() => {
    if (!user) {
      setDisplayUser(null);
    } else if (user) {
      setDisplayUser(user);
    } else if (initUser) {
      setDisplayUser(initUser);
      setUser(initUser);
    }
  }, [user, initUser, setUser]);

  const handleLogout = () => {
    logout();
  };
  return (
    <header style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
      <nav>
        <ul
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            listStyle: "none",
          }}
        >
          <li>
            <Link href="/">Home</Link>
          </li>
          {displayUser ? (
            <>
              <li>{displayUser.email}</li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/register">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
