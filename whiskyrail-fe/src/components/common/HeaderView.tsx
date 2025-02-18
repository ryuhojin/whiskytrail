"use client";

import Link from "next/link";
import { User } from "@/libs/stores/authStore";

interface HeaderViewProps {
  displayUser: User | null;
  onLogout: () => void;
}

export default function HeaderView({ displayUser, onLogout }: HeaderViewProps) {
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
                <button onClick={onLogout}>Logout</button>
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
