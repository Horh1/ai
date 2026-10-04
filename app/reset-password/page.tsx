"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setMessage("Пароль изменён. Теперь можно войти с новым паролем.");
    setLoading(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-card">
        <Link href="/login" className="text-sm font-semibold text-ink">← LeadPilot</Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">Новый пароль</h1>
        <p className="mt-2 text-sm text-muted">Придумайте новый пароль для аккаунта.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-accent" placeholder="Новый пароль" type="password" autoComplete="new-password" />
          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {message && <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink">{message}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-ink px-4 py-3 font-semibold text-white disabled:opacity-60" type="submit">{loading ? "Сохраняем..." : "Сохранить пароль"}</button>
        </form>
      </div>
    </main>
  );
}
