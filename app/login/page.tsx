"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/app/onboarding";
  }

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-card">
        <Link href="/" className="text-sm font-semibold text-ink">← LeadPilot</Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">Войти</h1>
        <p className="mt-2 text-sm text-muted">Войдите в рабочее пространство LeadPilot.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-accent" placeholder="Email" type="email" autoComplete="email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-accent" placeholder="Пароль" type="password" autoComplete="current-password" />
          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-ink px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" type="submit">
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>

        <Link href="/forgot-password" className="mt-4 block text-center text-sm font-medium text-muted hover:text-ink">Забыли пароль?</Link>
        <p className="mt-6 text-center text-sm text-muted">
          Нет аккаунта? <Link className="font-semibold text-ink" href="/register">Создать</Link>
        </p>
      </div>
    </main>
  );
}
