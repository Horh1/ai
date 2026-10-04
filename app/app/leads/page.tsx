export default function LeadsPage() {
  return (
    <div>
      <header className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-accent">Workspace</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Заявки</h1>
          <p className="mt-2 text-sm text-muted">Здесь появится полноценный Lead CRUD на PATCH 05.</p>
        </div>
        <button className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white">+ Новая заявка</button>
      </header>

      <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap gap-2">
          {["Все", "Новые", "В работе", "Обработанные", "Горячие", "Тёплые", "Холодные"].map((item, i) => (
            <button key={item} className={`rounded-full px-3.5 py-2 text-sm ${i === 0 ? "bg-ink text-white" : "bg-surface text-muted"}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="pb-3">Клиент</th>
                <th className="pb-3">Компания</th>
                <th className="pb-3">Источник</th>
                <th className="pb-3">AI Score</th>
                <th className="pb-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Иван Петров", "ООО Альфа", "Website", "92", "Hot"],
                ["Сергей", "Beta LLC", "Telegram", "71", "Warm"],
                ["Алексей", "—", "Manual", "42", "Cold"]
              ].map((row) => (
                <tr key={row[0]} className="border-b border-line last:border-0">
                  {row.map((cell, index) => <td key={index} className="py-4 text-muted">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}