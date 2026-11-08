import { useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import ThemeToggle from "../components/ThemeToggle";

type IconName =
  | "home"
  | "school"
  | "building"
  | "users"
  | "chart"
  | "user"
  | "menu"
  | "moon"
  | "arrow"
  | "clock"
  | "check"
  | "close"
  | "slash"
  | "lock"
  | "hourglass"
  | "play"
  | "sun";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, string> = {
    home: "M3 10.5 12 3l9 7.5M5 9v11h14V9M9 20v-6h6v6",
    school:
      "M3 9.5 12 5l9 4.5-9 4.5-9-4.5ZM6 12v5.5c3.5 2 8.5 2 12 0V12M21 10v6",
    building:
      "M4 21V5l8-2v18M12 21h8V9l-8-2M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2M15 20h2",
    users:
      "M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 11a3 3 0 1 0 0-6M17 14.5h1.5a3.5 3.5 0 0 1 3.5 3.5V20",
    chart:
      "M4 19V5M4 19h17M8 16v-4M12 16V8M16 16v-7M20 16v-4",
    user:
      "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    menu: "M4 7h16M4 12h16M4 17h16",
    moon: "M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z",
    arrow: "M5 12h14M13 6l6 6-6 6",
    clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    check: "m8 12 2.5 2.5L16 9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    close: "m9 9 6 6M15 9l-6 6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    slash: "M7 17 17 7M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    lock: "M6 10h12v10H6zM9 10V7a3 3 0 0 1 6 0v3",
    hourglass: "M6 3h12M6 21h12M8 3v4l8 10v4M16 3v4L8 17",
    play: "m9 6 9 6-9 6Z",
    sun: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  };

  return (
    <svg
      aria-hidden="true"
      className="size-[18px] shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}

const navigation = [
  { label: "Início", icon: "home" as const, active: true },
  { label: "Cursos", icon: "school" as const },
  { label: "Instituições", icon: "building" as const, href: "/instituicoes" },
  { label: "Usuários", icon: "users" as const, href: "/usuarios" },
  { label: "Relatórios", icon: "chart" as const },
  { label: "Perfil", icon: "user" as const },
];

const metrics = [
  ["Usuários", "1.284"],
  ["Alunos", "1.142"],
  ["Professores", "96"],
  ["Cursos", "38"],
  ["Inscrições", "2.317"],
  ["Instituições", "7"],
  ["Vagas restantes", "214"],
];

const enrollmentStatuses = [
  { label: "Pendente", value: "412", color: "bg-[#c26b2c] text-[#c26b2c]", icon: "clock" as const },
  { label: "Deferida", value: "1.480", color: "bg-[#369557] text-[#369557]", icon: "check" as const },
  { label: "Indeferida", value: "298", color: "bg-[#c7373b] text-[#c7373b]", icon: "close" as const },
  { label: "Cancelada", value: "127", color: "bg-[#777777] text-[#777777]", icon: "slash" as const },
];

const courseStatuses = [
  { label: "Em análise", value: "6", color: "bg-[#c26b2c] text-[#c26b2c]", icon: "hourglass" as const },
  { label: "Em andamento", value: "17", color: "bg-[#16813b] text-[#16813b]", icon: "play" as const },
  { label: "Concluído", value: "12", color: "bg-[#2455dc] text-[#2455dc]", icon: "check" as const },
  { label: "Fechado", value: "3", color: "bg-[#777777] text-[#777777]", icon: "lock" as const },
];

export default function AdminHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex min-h-screen bg-page text-ink">
      <div
        className={`shrink-0 overflow-hidden transition-[width] duration-300 ${
          isSidebarOpen ? "w-[260px]" : "w-0"
        }`}
      >
        <aside className="h-full w-[260px] border-r border-line bg-sidebar px-3 py-6">
          <div className="px-3">
            <BrandLogo />
          </div>

          <nav className="mt-10 space-y-1" aria-label="Navegação principal">
            {navigation.map((item) => (
              <Link
                key={item.label}
                to={item.href ?? (item.active ? "/inicio" : "#")}
                className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                  item.active
                    ? "bg-[#f0dfd4] font-medium text-accent"
                    : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon name={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      <main className="min-w-0 flex-1">
        <header className="flex h-[72px] items-center justify-between border-b border-line bg-surface px-6 sm:px-10">
          <div className="flex items-center gap-3 text-sm text-ink-2">
            <button
              type="button"
              className="rounded-md p-1.5 hover:bg-surface-2"
              aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen((open) => !open)}
            >
              <Icon name="menu" />
            </button>
            <span>Início</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-ink">Administrador</p>
              <p className="text-xs text-ink-3">ADMIN</p>
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-accent text-xs font-semibold text-white">
              AD
            </div>
          </div>
        </header>

        <div className="w-full px-5 py-7 sm:px-8 sm:py-9">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-[30px] leading-9 font-semibold text-ink sm:text-[36px]">
                Bom dia, administrador
              </h1>
              <p className="mt-1 text-sm text-ink-2">
                {currentDate.charAt(0).toUpperCase() + currentDate.slice(1)}
              </p>
            </div>
            <Link
              to="#relatorios"
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-line-strong bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-2 sm:self-auto"
            >
              <Icon name="chart" />
              Ver relatórios
              <Icon name="arrow" />
            </Link>
          </div>

          <section
            aria-label="Resumo do sistema"
            className="mt-8 grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-surface sm:grid-cols-4 lg:grid-cols-7"
          >
            {metrics.map(([label, value], index) => (
              <div
                key={label}
                className={`px-4 py-5 ${
                  index > 0 ? "border-l border-line" : ""
                } ${index === 4 ? "sm:border-l-0 lg:border-l" : ""}`}
              >
                <p className="text-xs text-ink-3">{label}</p>
                <p
                  className={`mt-1 font-display text-[25px] leading-8 font-semibold ${
                    label === "Vagas restantes" ? "text-accent" : "text-ink"
                  }`}
                >
                  {value}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-semibold">
                  Inscrições por situação
                </h2>
                <Link
                  to="#inscricoes"
                  className="text-xs font-medium text-link hover:text-link-hover"
                >
                  Detalhes
                </Link>
              </div>
              <div className="mt-6 space-y-4">
                {enrollmentStatuses.map((status) => (
                  <div key={status.label} className="grid grid-cols-[116px_1fr_52px] items-center gap-4 text-sm">
                    <span className={`flex items-center gap-2 ${status.color.split(" ")[1]}`}>
                      <Icon name={status.icon} />
                      {status.label}
                    </span>
                    <div className="h-3 overflow-hidden rounded-sm bg-surface-2">
                      <div
                        className={`h-full rounded-sm ${status.color}`}
                        style={{ width: `${(Number(status.value.replace(".", "")) / 1480) * 100}%` }}
                      />
                    </div>
                    <strong className="text-right font-display text-base text-ink">{status.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-line bg-surface p-6">
              <h2 className="font-display text-base font-semibold">
                Cursos por situação
              </h2>
              <div className="mt-5 flex flex-col items-center gap-8 sm:flex-row sm:items-center">
                <div
                  className="grid size-36 shrink-0 place-items-center rounded-full"
                  style={{
                    background:
                      "conic-gradient(#d97706 0 15.8%, #4d8a61 15.8% 60.5%, #356a9a 60.5% 92.1%, #7b7770 92.1% 100%)",
                  }}
                >
                  <div className="grid size-24 place-items-center rounded-full bg-surface">
                    <div className="text-center">
                      <span className="block font-display text-3xl font-semibold leading-8">38</span>
                      <span className="text-xs text-ink-2">cursos</span>
                    </div>
                  </div>
                </div>
                <div className="min-w-0 flex-1 space-y-5">
                  {courseStatuses.map((status) => (
                    <div key={status.label} className="flex items-center justify-between gap-3 text-base">
                      <span className={`flex items-center gap-2 ${status.color.split(" ")[1]}`}>
                        <Icon name={status.icon} />
                        {status.label}
                      </span>
                      <strong className="font-display text-lg">{status.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
