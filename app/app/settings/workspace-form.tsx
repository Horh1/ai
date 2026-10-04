"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const industries = ["B2B", "E-commerce", "Услуги", "Производство", "Агентство", "Другое"];

export default function WorkspaceForm({ organization, role }: { organization: { id: string; name: string; industry: string | null; description: string | null } | null; role: string }) {
  const [name, setName] = useState(organization?.name ?? "");
  const [industry, setIndustry] = useState(organization?.industry ?? "");
  const [description, setDescription] = useState(organization?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const canEdit = role === "owner" || role === "admin";

  async function save() {
    if (!organization || !canEdit) return;
    setSaving(true); setSaved(false);
    const supabase = createClient();
    const { error } = await supabase.from("organizations").update({ name: name.trim(), industry, description: description.trim() }).eq("id", organization.id);
    setSaving(false);
    if (!error) setSaved(true);
  }

  return <div><p className="text-sm font-medium text-accent">Workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Настройки</h1><p className="mt-2 text-sm text-muted">Данные компании используются в workspace и AI-контексте.</p>
    <section className="mt-8 max-w-3xl rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
      <div className="grid gap-5"><label className="grid gap-2 text-sm font-medium">Название компании<input disabled={!canEdit} value={name} onChange={e => setName(e.target.value)} className="rounded-xl border border-line px-4 py-3 font-normal outline-none focus:border-accent disabled:bg-surface" /></label>
      <label className="grid gap-2 text-sm font-medium">Сфера бизнеса<select disabled={!canEdit} value={industry} onChange={e => setIndustry(e.target.value)} className="rounded-xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-accent disabled:bg-surface"><option value="">Выберите сферу</option>{industries.map(i => <option key={i}>{i}</option>)}</select></label>
      <label className="grid gap-2 text-sm font-medium">Описание<textarea disabled={!canEdit} value={description} onChange={e => setDescription(e.target.value)} rows={5} className="resize-none rounded-xl border border-line px-4 py-3 font-normal outline-none focus:border-accent disabled:bg-surface" /></label></div>
      <div className="mt-6 flex items-center justify-between gap-4"><p className="text-xs text-muted">Роль: <span className="font-semibold text-ink">{role}</span></p>{canEdit && <div className="flex items-center gap-3">{saved && <span className="text-sm text-muted">Сохранено</span>}<button disabled={saving} onClick={save} className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Сохраняем…" : "Сохранить"}</button></div>}</div>
    </section></div>;
}
