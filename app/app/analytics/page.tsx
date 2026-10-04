export default function AnalyticsPage() {
  return (
    <div>
      <p className="text-sm font-medium text-accent">Workspace</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Аналитика</h1>
      <p className="mt-2 text-sm text-muted">Метрики и графики подключим после появления реальных данных.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total leads", "128"],
          ["Hot leads", "34"],
          ["Conversion", "18.4%"],
          ["Average score", "68"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}