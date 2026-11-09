import { Navigate } from "react-router-dom";
import { useState } from "react";
import RoleDashboardLayout, { ArrowIcon } from "../components/RoleDashboardLayout";
import { getSessionUser, type AppRole } from "../lib/authSession";

function dateLabel() {
  const value = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function nameInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

type DeppiCardIcon = "school" | "fact_check" | "badge" | "hourglass_top" | "clock" | "assignment" | "date_range" | "schedule" | "timer" | "play_circle" | "lock" | "check_circle";

function DeppiIcon({ name }: { name: DeppiCardIcon }) {
  const paths: Record<DeppiCardIcon, string> = {
    school: "M3 9.5 12 5l9 4.5-9 4.5-9-4.5ZM6 12v5.5c3.5 2 8.5 2 12 0V12M21 10v6",
    fact_check: "M5 4h14v16H5zM8 9h2m2 0h4M8 13h2m2 0h4M8 17h2m2 0h4",
    badge: "M12 3 14.2 5.2 17.3 5.1 18.5 8 21 9.8 19.2 12.5 19.7 15.5 16.8 16.7 15.2 19.4 12 18.5 8.8 19.4 7.2 16.7 4.3 15.5 4.8 12.5 3 9.8 5.5 8 6.7 5.1 9.8 5.2Z M9 12l2 2 4-4",
    hourglass_top: "M6 4h12M6 20h12M8 4v4l8 8v4M16 4v4l-8 8",
    clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    assignment: "M6 4h12v17H6zM9 4V2h6v2M9 9h6M9 13h6M9 17h3",
    date_range: "M5 5h14v15H5zM8 3v4M16 3v4M5 10h14M8 14h2M12 14h2",
    schedule: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    timer: "M9 3h6M12 3v3M7 7l-2-2M17 7l2-2M12 9v4l3 2M21 14a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    play_circle: "m10 8 5 4-5 4Z M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    lock: "M6 10h12v10H6zM9 10V7a3 3 0 0 1 6 0v3",
    check_circle: "m8 12 2.5 2.5L16 9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  };

  return (
    <svg aria-hidden="true" className="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}

type CourseStatus = "Em andamento" | "Em análise" | "Concluído" | "Fechado";

type Course = {
  initials: string;
  title: string;
  campus: string;
  progress: string;
  status: CourseStatus;
  dates: string;
  hours: string;
};

function CourseCard({ course }: { course: Course }) {
  const { initials, title, campus, progress, status, dates, hours } = course;
  const [enrolled, capacity] = progress.split("/").map(Number);
  const isFull = enrolled === capacity;
  const progressWidth = capacity > 0 ? `${Math.min((enrolled / capacity) * 100, 100)}%` : "0%";
  const statusStyles: Record<CourseStatus, { color: string; icon: DeppiCardIcon }> = {
    "Em andamento": { color: "text-success", icon: "play_circle" },
    "Em análise": { color: "text-warning", icon: "hourglass_top" },
    Concluído: { color: "text-info", icon: "check_circle" },
    Fechado: { color: "text-muted-status", icon: "lock" },
  };
  const currentStatus = statusStyles[status];

  return (
    <article className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex h-[74px] items-center justify-between bg-stripes px-4">
        <span className="font-display text-[28px] font-semibold text-line-strong">{initials}</span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${currentStatus.color} ${status === "Em análise" ? "bg-warning/10" : status === "Em andamento" ? "bg-success/10" : status === "Concluído" ? "bg-info/10" : "bg-muted-status/10"}`}><DeppiIcon name={currentStatus.icon} /> {status}</span>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-ink">{title}</h3>
        <p className="mt-0.5 text-xs text-ink-2">IFCE · {campus}</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-2">
          <span className="inline-flex items-center gap-1"><DeppiIcon name="date_range" /> {dates}</span>
          <span className="inline-flex items-center gap-1"><DeppiIcon name="schedule" /> 18:30–21:30</span>
        </div>
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-2"><DeppiIcon name="timer" /> {hours}</p>
        <div className="mt-3 flex justify-between text-xs text-ink-2"><span>Vagas</span><span>{progress}{isFull && " · lotado"}</span></div>
        <div className="mt-1 h-1 rounded-full bg-surface-2"><div className={`h-1 rounded-full ${isFull ? "bg-ink-3" : "bg-accent"}`} style={{ width: progressWidth }} /></div>
      </div>
    </article>
  );
}

function HomeGuard({ role, children }: { role: Exclude<AppRole, "ADMIN">; children: (user: NonNullable<ReturnType<typeof getSessionUser>>) => React.ReactNode }) {
  const user = getSessionUser();
  if (!user || !user.roles.includes(role)) return <Navigate to="/inicio" replace />;
  return children(user);
}

function DeppiHome({ user }: { user: NonNullable<ReturnType<typeof getSessionUser>> }) {
  const summaryCards = [
    { label: "Cursos em análise", value: "6", detail: "aguardando revisão", icon: "school" as const },
    { label: "Todas as inscrições", value: "", detail: "Filtrar por status", icon: "fact_check" as const },
    { label: "Professores", value: "96", detail: "cadastrados", icon: "badge" as const },
  ];

  return (
    <RoleDashboardLayout role="DEPPI" user={user}>
      <h1 className="font-display text-[30px] leading-9 font-semibold sm:text-[36px]">Bom dia, {user.name.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-ink-2">{dateLabel()}</p>
      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-accent p-5 text-white">
          <p className="flex items-center gap-2 text-sm"><DeppiIcon name="clock" /> Inscrições pendentes</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <strong className="font-display text-5xl leading-none">412</strong>
            <button className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-3.5 text-xs font-semibold text-accent">
              Analisar agora <ArrowIcon />
            </button>
          </div>
        </div>
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border-2 border-line-strong bg-surface p-5">
            <div className="grid size-10 place-items-center rounded-lg bg-surface-2 text-link">
              <DeppiIcon name={card.icon} />
            </div>
            <p className="mt-5 text-base font-medium text-ink">{card.label}</p>
            <p className="mt-0.5 text-sm text-ink-2">
              {card.value && <strong className="font-normal">{card.value} </strong>}{card.detail}
            </p>
          </div>
        ))}
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border-2 border-line-strong bg-surface p-5"><div className="flex justify-between"><h2 className="font-display text-lg font-semibold">Pendentes mais antigas</h2><a className="text-sm text-link underline">Ver todas</a></div>{[
          ["Ana Beatriz Lima Rocha", "Programação com Python", "há 3 dias"],
          ["Carlos Eduardo Nogueira", "Libras Básico", "há 3 dias"],
          ["Francisca Helena Sousa", "Programação com Python", "há 2 dias"],
          ["João Pedro Albuquerque", "Robótica com Arduino", "há 2 dias"],
          ["Mariana Costa Freitas", "Libras Básico", "há 1 dia"],
        ].map(([name, course, age]) => <div key={name} className="flex items-center justify-between gap-4 border-t border-line py-3 text-sm"><div className="flex min-w-0 items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-[10px] font-medium text-ink-2">{nameInitials(name)}</span><span className="truncate">{name}<small className="block text-xs text-ink-2">{course}</small></span></div><span className="shrink-0 text-xs text-ink-3">{age}</span></div>)}</div>
        <div className="rounded-xl border-2 border-line-strong bg-surface p-5"><div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">Cursos em análise</h2><a href="#" className="text-sm text-link underline underline-offset-2">Ver cursos</a></div>{["Inglês Instrumental para TI", "Introdução ao Excel", "Cuidador de Idosos", "Desenho Técnico com CAD"].map((course) => <div key={course} className="flex justify-between border-t border-line py-3 text-sm"><span>{course}<small className="block text-xs text-ink-2">Campus Fortaleza · 40 h</small></span><span className="inline-flex h-6 items-center gap-1 rounded-full bg-warning/10 px-2 text-xs font-medium text-warning"><DeppiIcon name="hourglass_top" /> Em análise</span></div>)}</div>
      </section>
    </RoleDashboardLayout>
  );
}

function ProfessorHome({ user }: { user: NonNullable<ReturnType<typeof getSessionUser>> }) {
  const courses: Course[] = [
    { initials: "PY", title: "Introdução à Programação com Python", campus: "Fortaleza", progress: "31/40", status: "Em andamento", dates: "03/03 – 30/06/2026", hours: "80 h" },
    { initials: "RA", title: "Robótica Educacional com Arduino", campus: "Maracanaú", progress: "25/25", status: "Em andamento", dates: "10/03 – 15/05/2026", hours: "60 h" },
    { initials: "IN", title: "Inglês Instrumental para TI", campus: "Fortaleza", progress: "0/30", status: "Em análise", dates: "05/11 – 18/12/2026", hours: "40 h" },
    { initials: "FE", title: "Fotografia e Edição Digital", campus: "Juazeiro do Norte", progress: "20/20", status: "Concluído", dates: "02/02 – 27/03/2026", hours: "60 h" },
    { initials: "LB", title: "Libras Básico", campus: "Sobral", progress: "18/35", status: "Em andamento", dates: "17/08 – 30/10/2026", hours: "40 h" },
    { initials: "EI", title: "Empreendedorismo e Inovação", campus: "Crato", progress: "41/50", status: "Fechado", dates: "04/05 – 26/06/2026", hours: "30 h" },
  ];
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [campusFilter, setCampusFilter] = useState("Todos");
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(query.trim().toLowerCase()) &&
    (statusFilter === "Todos" || course.status === statusFilter) &&
    (campusFilter === "Todos" || course.campus === campusFilter),
  );

  return <RoleDashboardLayout role="PROFESSOR" user={user}><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="font-display text-[30px] leading-9 font-semibold sm:text-[36px]">Bom dia, {user.name.split(" ")[0]}</h1><p className="mt-1 text-sm text-ink-2">Cursos de extensão cadastrados</p></div><button className="h-10 rounded-lg bg-accent px-4 text-sm font-semibold text-white">+ Novo curso</button></div><div className="mt-5 flex flex-wrap gap-3"><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 min-w-[240px] flex-1 rounded-lg border border-line-strong bg-surface px-3.5" placeholder="⌕  Buscar por nome" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-lg border border-line-strong bg-surface px-3.5"><option>Todos</option><option>Fechado</option><option>Em análise</option><option>Em andamento</option></select><select value={campusFilter} onChange={(event) => setCampusFilter(event.target.value)} className="h-11 rounded-lg border border-line-strong bg-surface px-3.5"><option>Todos</option>{[...new Set(courses.map((course) => course.campus))].map((campus) => <option key={campus}>{campus}</option>)}</select></div><section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredCourses.map((course) => <CourseCard key={course.initials} course={course} />)}</section></RoleDashboardLayout>;
}

function AlunoHome({ user }: { user: NonNullable<ReturnType<typeof getSessionUser>> }) {
  return <RoleDashboardLayout role="ALUNO" user={user}><h1 className="font-display text-[30px] leading-9 font-semibold sm:text-[36px]">Olá, {user.name.split(" ")[0]}</h1><p className="mt-1 text-sm text-ink-2">{dateLabel()}</p><section className="mt-5 grid gap-4 md:grid-cols-2"><button className="flex min-h-[118px] items-center justify-between rounded-xl bg-accent p-5 text-left text-white"><span><span className="block"><span className="inline-flex scale-125 origin-left"><DeppiIcon name="school" /></span></span><strong className="mt-2 block font-display text-xl">Ver cursos</strong><small>17 cursos com inscrições abertas</small></span><ArrowIcon /></button><button className="flex min-h-[118px] items-center justify-between rounded-xl border-2 border-line-strong bg-surface p-5 text-left"><span><span className="block text-accent"><span className="inline-flex scale-125 origin-left"><DeppiIcon name="assignment" /></span></span><strong className="mt-2 block font-display text-xl">Minhas inscrições</strong><small className="block text-ink-2">1 inscrição · faltam 2 documentos</small></span><ArrowIcon /></button></section><div className="mt-5 flex items-center justify-between"><h2 className="font-display text-lg font-semibold">Cursos em andamento</h2><a className="text-sm text-link underline">Ver todos</a></div><section className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><CourseCard course={{ initials: "PY", title: "Introdução à Programação com Python", campus: "Fortaleza", progress: "31/40", status: "Em andamento", dates: "03/03 – 30/06/2026", hours: "80 h" }} /><CourseCard course={{ initials: "RA", title: "Robótica Educacional com Arduino", campus: "Maracanaú", progress: "25/25", status: "Em andamento", dates: "10/03 – 15/05/2026", hours: "60 h" }} /><CourseCard course={{ initials: "LB", title: "Libras Básico", campus: "Sobral", progress: "18/35", status: "Em andamento", dates: "17/08 – 30/10/2026", hours: "40 h" }} /></section></RoleDashboardLayout>;
}

export function DeppiHomePage() { return <HomeGuard role="DEPPI">{(user) => <DeppiHome user={user} />}</HomeGuard>; }
export function ProfessorHomePage() { return <HomeGuard role="PROFESSOR">{(user) => <ProfessorHome user={user} />}</HomeGuard>; }
export function AlunoHomePage() { return <HomeGuard role="ALUNO">{(user) => <AlunoHome user={user} />}</HomeGuard>; }
