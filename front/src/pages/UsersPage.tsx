import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import ThemeToggle from "../components/ThemeToggle";
import { grantRole, listRoles, listUsers } from "../services/usuariosService";
import type { Papel, Usuario } from "../types/usuario";

type IconName = "menu" | "home" | "school" | "building" | "users" | "chart" | "user" | "search" | "close" | "shieldPerson";

function Icon({ name, className = "size-[17px]" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, string> = {
    menu: "M4 7h16M4 12h16M4 17h16",
    home: "M3 10.5 12 3l9 7.5M5 9v11h14V9M9 20v-6h6",
    school: "M3 9.5 12 5l9 4.5-9 4.5-9-4.5ZM6 12v5.5c3.5 2 8.5 2 12 0V12M21 10v6",
    building: "M4 21V5l8-2v18M12 21h8V9l-8-2M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2M15 20h2",
    users: "M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 11a3 3 0 1 0 0-6M17 14.5h1.5a3.5 3.5 0 0 1 3.5 3.5V20",
    chart: "M4 19V5M4 19h17M8 16v-4M12 16V8M16 16v-7M20 16v-4",
    user: "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    search: "m21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z",
    close: "M6 6l12 12M18 6 6 18",
    shieldPerson: "M12 3 20 6v5c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Zm0 5.2a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2Zm-3.3 8a3.5 3.5 0 0 1 6.6 0",
  };
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>;
}

const navigation: [string, IconName, string][] = [
  ["Início", "home", "/inicio"], ["Cursos", "school", "#"], ["Instituições", "building", "/instituicoes"],
  ["Usuários", "users", "/usuarios"], ["Relatórios", "chart", "#"], ["Perfil", "user", "#"],
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return (parts[0]?.slice(0, 2) ?? "").toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function roleLabel(name: string) {
  return name;
}

function roleDescription(name: string) {
  if (name === "ADMIN") return "Gerencia instituições, usuários e relatórios.";
  if (name === "DEPPI") return "Analisa inscrições e gerencia cursos e professores.";
  return "Cria e gerencia cursos de extensão.";
}

function roleBadgeClass(name: string) {
  return ["ADMIN", "DEPPI"].includes(name)
    ? "bg-danger-soft text-danger"
    : "bg-surface-2 text-ink-2";
}

function Modal({ user, roles, onClose, onGrant, submitting, error }: {
  user: Usuario; roles: Papel[]; onClose: () => void; onGrant: (roleId: string) => void; submitting: boolean; error: string | null;
}) {
  const availableRoles = roles.filter((role) => role.nome !== "ALUNO" && !user.roles.includes(role.nome));
  const [selectedRole, setSelectedRole] = useState(availableRoles[0]?.id ?? "");
  const selectedRoleName = availableRoles.find((role) => role.id === selectedRole)?.nome;
  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-black/30 p-5" role="presentation">
      <div className="w-full max-w-[640px] rounded-xl border border-line bg-surface shadow-[0_24px_64px_rgba(0,0,0,0.2)]" role="dialog" aria-modal="true" aria-labelledby="role-modal-title">
        <div className="flex items-center justify-between px-8 pt-7">
          <h2 id="role-modal-title" className="font-display text-xl font-semibold">Conceder cargo</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2" aria-label="Fechar"><Icon name="close" /></button>
        </div>
        <div className="space-y-4 px-8 py-4">
          <p className="text-base text-ink-2">Escolha o cargo para <strong className="text-ink">{user.nome}</strong>. Os cargos atuais são mantidos.</p>
          {error && <p role="alert" className="rounded-lg border border-danger/25 bg-danger/8 px-3 py-2 text-sm text-danger">{error}</p>}
          {availableRoles.length ? <div className="space-y-4">{availableRoles.map((role) => <label key={role.id} className={`flex cursor-pointer items-start gap-4 rounded-lg border px-4 py-4 ${selectedRole === role.id ? "border-link bg-danger-soft" : "border-line-strong"}`}><input type="radio" name="role" value={role.id} checked={selectedRole === role.id} onChange={() => setSelectedRole(role.id)} className="mt-1 size-5 accent-accent" /><span><strong className="text-base">{roleLabel(role.nome)}</strong><span className="mt-0.5 block text-base text-ink-2">{roleDescription(role.nome)}</span></span></label>)}</div> : <p className="rounded-lg bg-surface-2 px-3 py-3 text-sm text-ink-2">Este usuário já possui os cargos disponíveis.</p>}
          {availableRoles.length > 0 && <p className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning"><span aria-hidden="true" className="text-lg">△</span>Esta ação não pode ser desfeita pela interface.</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-line px-8 py-4">
          <button type="button" onClick={onClose} className="h-12 rounded-lg border border-line-strong bg-surface px-5 text-base font-medium hover:bg-surface-2">Cancelar</button>
          <button type="button" disabled={!selectedRole || submitting} onClick={() => onGrant(selectedRole)} className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-5 text-base font-semibold text-white hover:bg-accent/90 disabled:opacity-60"><Icon name="shieldPerson" className="size-6" />{submitting ? "Concedendo..." : `Conceder ${roleLabel(selectedRoleName ?? "")}`}</button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Papel[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selected, setSelected] = useState<Usuario | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try { const [userData, roleData] = await Promise.all([listUsers(), listRoles()]); setUsers(userData); setRoles(roleData); setError(null); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível carregar os usuários."); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    // Sincroniza a lista inicial com a API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);
  const filtered = useMemo(() => {
    const value = query.toLowerCase().trim();
    return users.filter((user) => {
      const matchesQuery = !value || [user.nome, user.email, ...user.roles].some((item) => item.toLowerCase().includes(value));
      const matchesRole = !roleFilter || user.roles.includes(roleFilter);
      return matchesQuery && matchesRole;
    });
  }, [users, query, roleFilter]);

  async function handleGrant(roleId: string) {
    if (!selected) return;
    setSubmitting(true);
    try { await grantRole(selected.id, roleId); setSelected(null); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível conceder o cargo."); }
    finally { setSubmitting(false); }
  }

  const pageLink = (label: string, href: string, icon: IconName): ReactNode => <Link key={label} to={href} onClick={() => setSidebarOpen(false)} className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm ${label === "Usuários" ? "bg-accent-soft font-medium text-accent" : "text-ink-2 hover:bg-surface-2"}`}><Icon name={icon} />{label}</Link>;
  return (
    <div className="flex min-h-screen bg-page text-ink">
      <div className={`shrink-0 overflow-hidden transition-[width] duration-300 ${sidebarOpen ? "w-[260px]" : "w-0"}`}><aside className="h-full w-[260px] border-r border-line bg-sidebar px-3 py-6"><div className="px-3"><BrandLogo /></div><nav className="mt-10 space-y-1" aria-label="Navegação principal">{navigation.map(([label, icon, href]) => pageLink(label, href, icon))}</nav></aside></div>
      <main className="min-w-0 flex-1">
        <header className="flex h-[72px] items-center justify-between border-b border-line bg-surface px-6 sm:px-10"><div className="flex items-center gap-3 text-sm text-ink-2"><button type="button" className="rounded-md p-1.5 hover:bg-surface-2" aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setSidebarOpen((open) => !open)}><Icon name="menu" /></button><span>Usuários</span></div><div className="flex items-center gap-3"><ThemeToggle /><div className="hidden text-right sm:block"><p className="text-sm font-medium">Administrador</p><p className="text-xs text-ink-3">ADMIN</p></div><div className="grid size-9 place-items-center rounded-full bg-accent text-xs font-semibold text-white">AD</div></div></header>
        <div className="w-full px-5 py-7 sm:px-8 sm:py-9"><div><h1 className="font-display text-[30px] leading-9 font-semibold sm:text-[36px]">Usuários</h1><p className="mt-1 text-base text-ink-2">{users.length} usuários cadastrados</p></div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"><Icon name="search" /></span><input aria-label="Buscar usuários" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome ou e-mail" className="h-12 w-full rounded-lg border border-line-strong bg-surface pl-10 pr-4 text-base outline-none focus:border-link focus:ring-[3px] focus:ring-link/20" /></div>
            <select aria-label="Filtrar por cargo" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-12 rounded-lg border border-line-strong bg-surface px-4 text-sm outline-none focus:border-link focus:ring-[3px] focus:ring-link/20 sm:w-52">
              <option value="">Todos os cargos</option>
              {roles.filter((role) => role.nome !== "ALUNO").map((role) => <option key={role.id} value={role.nome}>{role.nome}</option>)}
            </select>
          </div>
          {error && !selected && <p role="alert" className="mt-4 rounded-lg border border-danger/25 bg-danger/8 px-3 py-2 text-sm text-danger">{error}</p>}
          <div className="mt-5 overflow-hidden rounded-xl border border-line bg-surface"><div className="hidden grid-cols-[1.4fr_1.3fr_1fr_1fr_1.1fr] gap-4 border-b border-line bg-sidebar px-5 py-4 text-sm font-medium text-ink-2 sm:grid"><span>Usuário</span><span>E-mail</span><span>Cargos</span><span>Criado em</span><span /></div>
            {loading ? <p className="px-5 py-10 text-center text-sm text-ink-2">Carregando usuários...</p> : filtered.length === 0 ? <p className="px-5 py-10 text-center text-sm text-ink-2">Nenhum usuário encontrado.</p> : filtered.map((user) => <div key={user.id} className="grid gap-3 border-b border-line px-5 py-5 last:border-b-0 sm:grid-cols-[1.4fr_1.3fr_1fr_1fr_1.1fr] sm:items-center sm:gap-4"><div className="flex items-center gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent">{getInitials(user.nome)}</div><p className="text-base font-medium">{user.nomeUsual || user.nome}</p></div><span className="break-all text-base text-ink-2">{user.email}</span><div className="flex flex-wrap gap-1.5 font-mono">{user.roles.length ? user.roles.map((role) => <span key={role} className={`rounded-md px-2 py-1 text-xs font-medium ${roleBadgeClass(role)}`}>{roleLabel(role)}</span>) : <span className="text-sm text-ink-3">Sem cargo</span>}</div><span className="font-mono text-sm text-ink-2">{new Intl.DateTimeFormat("pt-BR").format(new Date(user.createdAt))}</span>{!user.roles.includes("ADMIN") && <button type="button" onClick={() => { setSelected(user); setError(null); }} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line-strong bg-surface px-3 text-xs font-semibold text-ink hover:bg-surface-2"><Icon name="shieldPerson" className="size-5" />Conceder cargo</button>}</div>)}
          </div>
        </div>
      </main>
      {selected && <Modal user={selected} roles={roles} onClose={() => setSelected(null)} onGrant={handleGrant} submitting={submitting} error={error} />}
    </div>
  );
}
