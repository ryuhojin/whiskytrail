"use client";

import { useState } from "react";
import axiosInstance from "@/libs/utils/axiosInstance";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      // 실제 회원가입 API 엔드포인트에 맞게 수정하세요.
      await axiosInstance.post("/auth/signup", form);
      router.push("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("회원가입에 실패했습니다.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Signup</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
