import Link from "next/link";

const kpis = [
  ["Новые заявки", "24"],
  ["Горячие", "8"],
  ["Обработано", "57"],
  ["Средний AI Score", "74"]
];

export default function DashboardPage() {
  return (
    <div>
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-accent">Обзор</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Добрый день 👋</h1>
          <p className="mt-2 text-sm text-muted">Показываем состояние входящих заявок.</p>
        </div>
        <Link href="/app/leads" className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          + Новая заявка
        </Link>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <article className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Leads over time</h2>
              <p className="mt-1 text-sm text-muted">Последние 7 дней</p>
            </div>
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">Demo</span>
          </div>
          <div className="mt-8 flex h-52 items-end gap-3">
            {[35, 52, 43, 70, 56, 82, 64].map((height, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-accent/15" style={{ height: `${height}%` }}>
                  <div className="h-2/3 w-full rounded-t-lg bg-accent/80" />
                </div>
                <span className="text-[11px] text-muted">{["Пн","Вт","Ср","Чт","Пт","Сб","Вс"][i]}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <h2 className="font-semibold">Последние заявки</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Иван Петров", "ООО Альфа", "92"],
              ["Сергей", "Beta LLC", "71"],
              ["Алексей", "—", "42"]
            ].map(([name, company, score]) => (
              <div key={name} className="flex items-center justify-between rounded-xl bg-surface p-3.5">
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="mt-0.5 text-xs text-muted">{company}</p>
                </div>
                <span className="text-sm font-semibold">{score}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}