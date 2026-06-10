"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("superadmin@example.com");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (result.error || !result.data) {
      setError(result.error ?? "Login failed");
      return;
    }
    window.localStorage.setItem("accessToken", result.data.accessToken);
    router.push("/dashboard");
  }

  return (
    <main className="login-page">
      <section className="card login-card">
        <h1 style={{ marginTop: 0 }}>BioExam Verify</h1>
        <p className="muted">Sign in to manage exam verification operations.</p>
        <form className="form" onSubmit={onSubmit}>
          <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          {error ? <div style={{ color: "var(--danger)" }}>{error}</div> : null}
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
