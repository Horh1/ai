"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const supabase = createClient();
    const origin = window.location.origin;
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, company_name: company },
        emailRedirectTo: `${origin}/auth/callback?next=/app/onboarding`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      window.location.href = "/app/onboarding";
      return;
    }

    setMessage("Аккаунт создан. Проверьте почту и перейдите по ссылке подтверждения, чтобы продолжить.");
    setLoading(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-card">
        <Link href="/" className="text-sm font-semibold text-ink">← LeadPilot</Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">Создать workspace</h1>
        <p className="mt-2 text-sm text-muted">Создайте аккаунт. Рабочее пространство настроим следующим шагом.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-accent" placeholder="Имя" autoComplete="name" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-accent" placeholder="Email" type="email" autoComplete="email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-accent" placeholder="Пароль (минимум 6 символов)" type="password" autoComplete="new-password" />
          <input value={company} onChange={(e) => setCompany(e.target.value)} required className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-accent" placeholder="Название компании" autoComplete="organization" />
          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {message && <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink">{message}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" type="submit">
            {loading ? "Создаём..." : "Создать аккаунт"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Уже есть аккаунт? <Link className="font-semibold text-ink" href="/login">Войти</Link>
        </p>
      </div>
    </main>
  );
}
