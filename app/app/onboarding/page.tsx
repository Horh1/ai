"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Building2, Check, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const industries = ["B2B", "E-commerce", "Услуги", "Производство", "Агентство", "Другое"];
const tones = ["Professional", "Friendly", "Concise", "Expert"];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        window.location.href = "/login";
        return;
      }

      const { data: membership } = await supabase
        .from("organization_members")
        .select("organization_id, role")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (membership?.organization_id) {
        const { data: org } = await supabase
          .from("organizations")
          .select("name, industry, description")
          .eq("id", membership.organization_id)
          .single();

        if (org) {
          setCompany(org.name ?? "");
          setIndustry(org.industry ?? "");
          setDescription(org.description ?? "");
          if (org.name && org.industry && org.description) {
            window.location.href = "/app/dashboard";
            return;
          }
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  async function next() {
    setError("");
    if (step === 1 && !company.trim()) return setError("Введите название компании.");
    if (step === 2 && !industry) return setError("Выберите сферу бизнеса.");
    if (step === 3 && !description.trim()) return setError("Добавьте короткое описание компании.");
    setStep((value) => Math.min(4, value + 1));
  }

  async function finish() {
    setError("");
    setSaving(true);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("create_leadpilot_workspace", {
      workspace_name: company.trim(),
      workspace_industry: industry,
      workspace_description: description.trim(),
    });

    if (rpcError || !data) {
      setError(rpcError?.message ?? "Не удалось создать workspace.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("organizations")
      .update({ name: company.trim(), industry, description: description.trim() })
      .eq("id", data);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    window.location.href = "/app/dashboard";
  }

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-surface"><div className="text-sm text-muted">Загружаем workspace…</div></main>;
  }

  const progress = `${step * 25}%`;

  return (
    <main className="min-h-screen bg-surface px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-ink text-xs font-bold text-white">LP</span>
            <div><p className="font-semibold">LeadPilot</p><p className="text-xs text-muted">Настройка workspace</p></div>
          </div>
          <span className="text-sm text-muted">Шаг {step} из 4</span>
        </div>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: progress }} /></div>

        <section className="mx-auto mt-10 max-w-2xl rounded-3xl border border-line bg-white p-7 shadow-card sm:p-10">
          {step === 1 && <>
            <div className="grid size-12 place-items-center rounded-2xl bg-accentSoft text-accent"><Building2 className="size-6" /></div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">Как называется ваша компания?</h1>
            <p className="mt-2 text-muted">Это название будет использоваться в workspace и контексте AI.</p>
            <input autoFocus value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Например, Acme Sales" className="mt-8 w-full rounded-xl border border-line px-4 py-3.5 outline-none focus:border-accent" />
          </>}

          {step === 2 && <>
            <div className="grid size-12 place-items-center rounded-2xl bg-accentSoft text-accent"><Building2 className="size-6" /></div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">Чем занимается компания?</h1>
            <p className="mt-2 text-muted">Выберите вариант, который ближе всего к вашему бизнесу.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">{industries.map((item) => <button type="button" key={item} onClick={() => setIndustry(item)} className={`rounded-xl border p-4 text-left text-sm font-medium transition ${industry === item ? "border-accent bg-accentSoft text-accent" : "border-line hover:border-ink/20 hover:bg-surface"}`}>{item}</button>)}</div>
          </>}

          {step === 3 && <>
            <div className="grid size-12 place-items-center rounded-2xl bg-accentSoft text-accent"><Sparkles className="size-6" /></div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">Расскажите о компании</h1>
            <p className="mt-2 text-muted">Например: «Производим и продаём оборудование для складов». AI использует этот контекст при анализе заявок.</p>
            <textarea autoFocus value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Чем вы занимаетесь, что продаёте и кому?" className="mt-8 w-full resize-none rounded-xl border border-line px-4 py-3.5 outline-none focus:border-accent" />
          </>}

          {step === 4 && <>
            <div className="grid size-12 place-items-center rounded-2xl bg-accentSoft text-accent"><Sparkles className="size-6" /></div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">Как должен общаться AI?</h1>
            <p className="mt-2 text-muted">Этот параметр станет основой для будущего AI Reply.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">{tones.map((item) => <button type="button" key={item} onClick={() => setTone(item)} className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm font-medium transition ${tone === item ? "border-accent bg-accentSoft text-accent" : "border-line hover:bg-surface"}`}>{item}{tone === item && <Check className="size-4" />}</button>)}</div>
            <div className="mt-6 rounded-2xl bg-surface p-4 text-sm text-muted"><strong className="text-ink">Готово.</strong> Создадим workspace «{company}» и назначим вас владельцем.</div>
          </>}

          {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="mt-8 flex justify-end">
            {step < 4 ? <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">Продолжить <ArrowRight className="size-4" /></button> : <button type="button" onClick={finish} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60">{saving ? "Создаём workspace…" : "Завершить настройку"} <ArrowRight className="size-4" /></button>}
          </div>
        </section>
      </div>
    </main>
  );
}
