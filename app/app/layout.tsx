import Link from "next/link";
import { BarChart3, Inbox, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const nav = [
  { href: "/app/dashboard", label: "Обзор", icon: LayoutDashboard },
  { href: "/app/leads", label: "Заявки", icon: Inbox },
  { href: "/app/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/app/settings", label: "Настройки", icon: Settings }
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? "";

  return (
    <div className="min-h-screen bg-surface text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white px-4 py-5 lg:block">
        <Link href="/app/dashboard" className="flex items-center gap-3 px-2">
          <span className="grid size-9 place-items-center rounded-xl bg-ink text-xs font-bold text-white">LP</span>
          <div>
            <p className="font-semibold">LeadPilot</p>
            <p className="text-xs text-muted">Sales workspace</p>
          </div>
        </Link>
        <nav className="mt-10 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface hover:text-ink">
              <Icon className="size-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="absolute inset-x-4 bottom-5 border-t border-line pt-4">
          <p className="truncate px-2 text-xs text-muted">{email}</p>
          <form action="/auth/signout" method="post" className="mt-2">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-ink" type="submit">
              <LogOut className="size-4" />Выйти
            </button>
          </form>
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
