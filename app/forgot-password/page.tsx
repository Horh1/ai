"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (resetError) setError(resetError.message);
    else setMessage("Если такой email зарегистрирован, ссылка для восстановления отправлена.");
    setLoading(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-card">
        <Link href="/login" className="text-sm font-semibold text-ink">← Назад ко входу</Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">Восстановление</h1>
        <p className="mt-2 text-sm text-muted">Укажите email, на который зарегистрирован аккаунт.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-accent" placeholder="Email" type="email" />
          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {message && <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink">{message}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-ink px-4 py-3 font-semibold text-white disabled:opacity-60" type="submit">{loading ? "Отправляем..." : "Отправить ссылку"}</button>
        </form>
      </div>
    </main>
  );
}
