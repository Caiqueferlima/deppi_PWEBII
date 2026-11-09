import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";
import type { AppRole, SessionUser } from "../lib/authSession";

type IconName = "home" | "school" | "clipboard" | "users" | "user" | "menu" | "arrow";

const iconPaths: Record<IconName, string> = {
  home: "M3 10.5 12 3l9 7.5M5 9v11h14V9M9 20v-6h6v6",
  school: "M3 9.5 12 5l9 4.5-9 4.5-9-4.5ZM6 12v5.5c3.5 2 8.5 2 12 0V12M21 10v6",
  clipboard: "M6 4h12v17H6zM9 4V2h6v2M9 9h6M9 13h6M9 17h3",
  users: "M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 11a3 3 0 1 0 0-6M17 14.5h1.5a3.5 3.5 0 0 1 3.5 3.5V20",
  user: "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  menu: "M4 7h16M4 12h16M4 17h16",
  arrow: "M5 12h14M13 6l6 6-6 6",
};

function Icon({ name }: { name: IconName }) {
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={iconPaths[name]} />
    </svg>
  );
}

type NavigationItem = { label: string; icon: IconName; href?: string };

const navigation: Record<Exclude<AppRole, "ADMIN">, NavigationItem[]> = {
  DEPPI: [
    { label: "Início", icon: "home" },
    { label: "Cursos", icon: "school" },
    { label: "Inscrições", icon: "clipboard" },
    { label: "Professores", icon: "users" },
    { label: "Perfil", icon: "user" },
  ],
  PROFESSOR: [
    { label: "Início", icon: "home" },
    { label: "Cursos", icon: "school" },
    { label: "Perfil", icon: "user" },
  ],
  ALUNO: [
    { label: "Início", icon: "home" },
    { label: "Cursos", icon: "school" },
    { label: "Minhas inscrições", icon: "clipboard" },
    { label: "Perfil", icon: "user" },
  ],
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function RoleDashboardLayout({
  role,
  user,
  children,
}: {
  role: Exclude<AppRole, "ADMIN">;
  user: SessionUser;
  children: ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const items = navigation[role];

  return (
    <div className="flex min-h-screen bg-page text-ink">
      <div className={`shrink-0 overflow-hidden transition-[width] duration-300 ${isSidebarOpen ? "w-[230px]" : "w-0"}`}>
        <aside className="h-full w-[230px] border-r border-line bg-sidebar px-3 py-6">
          <div className="px-3"><BrandLogo /></div>
          <nav className="mt-10 space-y-1" aria-label="Navegação principal">
            {items.map((item, index) => (
              <Link
                key={item.label}
                to={item.href ?? (index === 0 ? `/inicio/${role.toLowerCase()}` : "#")}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${index === 0 ? "bg-accent-soft font-medium text-accent" : "text-ink-2 hover:bg-surface-2 hover:text-ink"}`}
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
            <button type="button" className="rounded-md p-1.5 hover:bg-surface-2" aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setIsSidebarOpen((open) => !open)}>
              <Icon name="menu" />
            </button>
            <span>Início</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-ink">{user.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-wide text-accent">{role}</p>
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent" aria-label={`Iniciais de ${user.name}`}>
              {initials(user.name)}
            </div>
          </div>
        </header>
        <div className="w-full px-5 py-7 sm:px-8 sm:py-9">{children}</div>
      </main>
    </div>
  );
}

export function ArrowIcon() {
  return <Icon name="arrow" />;
}
