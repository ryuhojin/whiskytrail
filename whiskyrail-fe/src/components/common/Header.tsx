"use client";

import Link from "next/link";
import { useAuthStore } from "@/libs/stores/authStore";
import { useEffect } from "react";

export default function Header() {
  const { user, logout } = useAuthStore();
    
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
          {user ? (
            <>
              <li>{user.email}</li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
