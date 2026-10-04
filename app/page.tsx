import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, Flame, Sparkles } from "lucide-react";
import { MotionSection } from "../components/motion-section";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-анализ",
    text: "Понимает содержание заявки, намерение клиента и ключевые сигналы."
  },
  {
    icon: Flame,
    title: "Lead scoring",
    text: "Оценивает потенциальную ценность и приоритет каждой заявки."
  },
  {
    icon: Sparkles,
    title: "AI Reply",
    text: "Готовит персональный черновик ответа на основе контекста компании."
  },
  {
    icon: BarChart3,
    title: "Analytics",
    text: "Показывает качество входящих лидов и динамику отдела продаж."
  }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <section className="landing-grid relative">
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-7 lg:px-8 lg:pb-32 lg:pt-8">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
              <span className="grid size-9 place-items-center rounded-xl bg-ink text-white">
                LP
              </span>
              <span>LeadPilot</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-white hover:text-ink sm:block"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-soft transition hover:-translate-y-0.5"
              >
                Попробовать бесплатно
              </Link>
            </div>
          </nav>

          <div className="grid items-center gap-14 pb-10 pt-24 lg:grid-cols-[1.05fr_.95fr] lg:pt-32">
            <MotionSection>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3.5 py-2 text-xs font-medium text-muted backdrop-blur">
                <span className="size-1.5 rounded-full bg-accent" />
                AI Sales Assistant
              </div>

              <h1 className="text-balance max-w-3xl text-5xl font-semibold tracking-[-0.045em] text-ink sm:text-6xl lg:text-7xl">
                AI, который превращает входящие заявки в готовые сделки
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                LeadPilot анализирует обращения клиентов, определяет приоритет и помогает
                менеджеру подготовить персональный ответ за секунды.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
                >
                  Попробовать бесплатно
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center rounded-2xl border border-line bg-white px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-ink/20 hover:bg-surface"
                >
                  Посмотреть возможности
                </a>
              </div>
            </MotionSection>

            <MotionSection delay={0.08}>
              <div className="relative rounded-[28px] border border-line bg-white p-5 shadow-card">
                <div className="absolute -right-5 -top-5 rounded-2xl border border-line bg-white px-4 py-3 text-xs font-semibold shadow-soft">
                  AI analysis complete
                </div>

                <div className="rounded-2xl bg-surface p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted">Новая заявка</p>
                      <h2 className="mt-1 text-lg font-semibold">ООО Альфа</h2>
                    </div>
                    <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accent">
                      HOT
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-muted">
                    «Хотим заказать 500 единиц продукции. Какая будет цена и сможете ли
                    доставить в Москву?»
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-line bg-white p-4">
                      <p className="text-xs text-muted">Lead score</p>
                      <p className="mt-1 text-3xl font-semibold tracking-tight">92</p>
                    </div>
                    <div className="rounded-xl border border-line bg-white p-4">
                      <p className="text-xs text-muted">Intent</p>
                      <p className="mt-2 text-sm font-semibold">Purchase</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-line bg-white p-4">
                    <p className="text-xs font-medium text-muted">AI summary</p>
                    <p className="mt-2 text-sm leading-6 text-ink">
                      Клиент заинтересован в оптовой закупке и запрашивает цену с доставкой.
                    </p>
                  </div>
                </div>
              </div>
            </MotionSection>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <MotionSection>
          <p className="text-sm font-semibold text-accent">Возможности</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.035em] text-ink">
            От входящего сообщения до следующего действия менеджера.
          </h2>
        </MotionSection>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <MotionSection key={feature.title} delay={index * 0.05}>
                <article className="h-full rounded-2xl border border-line bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-card">
                  <div className="grid size-11 place-items-center rounded-xl bg-surface">
                    <Icon className="size-5 text-ink" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 max-w-md leading-7 text-muted">{feature.text}</p>
                </article>
              </MotionSection>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>LeadPilot AI</span>
          <span>AI sales workspace</span>
        </div>
      </footer>
    </main>
  );
}