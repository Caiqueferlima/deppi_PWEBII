import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";

type IconName =
  | "home"
  | "school"
  | "building"
  | "users"
  | "chart"
  | "user"
  | "menu"
  | "moon"
  | "arrow";

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
  { label: "Usuários", icon: "users" as const },
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
  { label: "Pendente", value: "412", color: "bg-[#d97706]" },
  { label: "Deferida", value: "1.480", color: "bg-[#4d8a61]" },
  { label: "Indeferida", value: "298", color: "bg-[#b42318]" },
  { label: "Cancelada", value: "127", color: "bg-[#7b7770]" },
];

const courseStatuses = [
  { label: "Em análise", value: "6", color: "bg-[#d97706]" },
  { label: "Em andamento", value: "17", color: "bg-[#4d8a61]" },
  { label: "Concluído", value: "12", color: "bg-[#356a9a]" },
  { label: "Fechado", value: "3", color: "bg-[#7b7770]" },
];

export default function AdminHome() {
  return (
    <div className="flex min-h-screen bg-page text-ink">
      <aside className="hidden w-[260px] shrink-0 border-r border-line bg-sidebar px-3 py-6 lg:block">
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
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex h-[72px] items-center justify-between border-b border-line bg-surface px-6 sm:px-10">
          <div className="flex items-center gap-3 text-sm text-ink-2">
            <button
              type="button"
              className="rounded-md p-1.5 hover:bg-surface-2 lg:hidden"
              aria-label="Abrir menu"
            >
              <Icon name="menu" />
            </button>
            <span>Início</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-md p-2 text-ink-2 hover:bg-surface-2"
              aria-label="Alternar tema"
            >
              <Icon name="moon" />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-ink">Administrador</p>
              <p className="text-xs text-ink-3">ADMIN</p>
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-accent text-xs font-semibold text-white">
              AD
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-6 py-9 sm:px-10 sm:py-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-[30px] leading-9 font-semibold text-ink sm:text-[36px]">
                Bom dia, administrador
              </h1>
              <p className="mt-1 text-sm text-ink-2">
                Segunda-feira, 5 de outubro de 2026
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
                <p className="mt-1 font-display text-[25px] leading-8 font-semibold">
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
              <div className="mt-6 grid grid-cols-2 gap-3">
                {enrollmentStatuses.map((status) => (
                  <div
                    key={status.label}
                    className="rounded-lg border border-line bg-page p-4"
                  >
                    <div className="flex items-center gap-2 text-xs text-ink-2">
                      <span className={`size-2 rounded-full ${status.color}`} />
                      {status.label}
                    </div>
                    <p className="mt-2 font-display text-2xl font-semibold">
                      {status.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-line bg-surface p-6">
              <h2 className="font-display text-base font-semibold">
                Cursos por situação
              </h2>
              <div className="mt-5 flex items-center gap-5 border-b border-line pb-5">
                <p className="font-display text-4xl font-semibold">38</p>
                <p className="text-sm text-ink-2">cursos cadastrados</p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4">
                {courseStatuses.map((status) => (
                  <div key={status.label} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-ink-2">
                      <span className={`size-2 rounded-full ${status.color}`} />
                      {status.label}
                    </span>
                    <strong className="font-display text-base">{status.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
