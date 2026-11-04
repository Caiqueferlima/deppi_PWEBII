import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import ThemeToggle from "../components/ThemeToggle";
import {
  createInstitution,
  deleteInstitution,
  listInstitutions,
  updateInstitution,
} from "../services/instituicoesService";
import type { Institution, InstitutionInput } from "../types/instituicao";

type Modal = "create" | "edit" | "delete" | null;

const emptyForm: InstitutionInput = { nome: "", campus: "", cidade: "", cnpj: "" };

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function ActionIcon({ kind }: { kind: "edit" | "delete" | "plus" | "search" | "close" | "menu" | "home" | "school" | "building" | "users" | "chart" | "user" }) {
  const paths = {
    edit: "M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3ZM14 8l2 2",
    delete: "M5 7h14M10 11v6M14 11v6M9 7V4h6v3m-9 0 1 13h10l1-13",
    plus: "M12 5v14M5 12h14",
    search: "m21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z",
    close: "M6 6l12 12M18 6 6 18",
    menu: "M4 7h16M4 12h16M4 17h16",
    home: "M3 10.5 12 3l9 7.5M5 9v11h14V9M9 20v-6h6v6",
    school: "M3 9.5 12 5l9 4.5-9 4.5-9-4.5ZM6 12v5.5c3.5 2 8.5 2 12 0V12M21 10v6",
    building: "M4 21V5l8-2v18M12 21h8V9l-8-2M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2M15 20h2",
    users: "M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 11a3 3 0 1 0 0-6M17 14.5h1.5a3.5 3.5 0 0 1 3.5 3.5V20",
    chart: "M4 19V5M4 19h17M8 16v-4M12 16V8M16 16v-7M20 16v-4",
    user: "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  };
  return (
    <svg aria-hidden="true" className="size-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[kind]} />
    </svg>
  );
}

function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-black/30 p-5" role="presentation">
      <div className="w-full max-w-[500px] rounded-xl border border-line bg-surface shadow-[0_24px_64px_rgba(0,0,0,0.2)]" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 id="modal-title" className="font-display text-xl font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2" aria-label="Fechar">
            <ActionIcon kind="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InstitutionForm({
  initialValue,
  submitLabel,
  onSubmit,
  onCancel,
  submitting,
  error,
}: {
  initialValue: InstitutionInput;
  submitLabel: string;
  onSubmit: (data: InstitutionInput) => void;
  onCancel: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState(initialValue);
  const inputClass = "h-11 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-sm outline-none focus:border-link focus:ring-[3px] focus:ring-link/20";

  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ nome: form.nome.trim(), campus: form.campus.trim(), cidade: form.cidade.trim(), cnpj: form.cnpj.replace(/\D/g, "") });
  }

  return (
    <form onSubmit={submit}>
      <div className="space-y-4 px-6 py-6">
        {error && <p role="alert" className="rounded-lg border border-danger/25 bg-danger/8 px-3 py-2 text-sm text-danger">{error}</p>}
        <label className="block text-[13px] font-medium">
          Nome
          <input required minLength={2} className={`${inputClass} mt-1.5`} value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[13px] font-medium">
            Campus
            <input required minLength={2} className={`${inputClass} mt-1.5`} value={form.campus} onChange={(event) => setForm({ ...form, campus: event.target.value })} />
          </label>
          <label className="block text-[13px] font-medium">
            Cidade
            <input required minLength={2} className={`${inputClass} mt-1.5`} value={form.cidade} onChange={(event) => setForm({ ...form, cidade: event.target.value })} />
          </label>
        </div>
        <label className="block text-[13px] font-medium">
          CNPJ
          <input required pattern="\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}" maxLength={18} placeholder="00.000.000/0000-00" className={`${inputClass} mt-1.5`} value={formatCnpj(form.cnpj)} onChange={(event) => setForm({ ...form, cnpj: event.target.value })} />
        </label>
      </div>
      <div className="flex justify-end gap-2 border-t border-line px-6 py-4">
        <button type="button" onClick={onCancel} className="h-10 rounded-lg border border-line-strong px-4 text-sm font-medium hover:bg-surface-2">Cancelar</button>
        <button disabled={submitting} type="submit" className="h-10 rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-60">{submitting ? "Salvando..." : submitLabel}</button>
      </div>
    </form>
  );
}

export default function InstitutionsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<Modal>(null);
  const [selected, setSelected] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadInstitutions() {
    setLoading(true);
    try {
      setInstitutions(await listInstitutions());
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível carregar as instituições.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // The effect synchronizes the initial list with the API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadInstitutions();
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return institutions;
    return institutions.filter((institution) => [institution.nome, institution.campus, institution.cidade, institution.cnpj ?? ""].some((value) => value.toLowerCase().includes(normalized)));
  }, [institutions, query]);

  function openCreate() {
    setSelected(null);
    setError(null);
    setModal("create");
  }

  function openEdit(institution: Institution) {
    setSelected(institution);
    setError(null);
    setModal("edit");
  }

  async function handleSave(data: InstitutionInput) {
    setSubmitting(true);
    try {
      if (modal === "edit" && selected) {
        await updateInstitution(selected.id, data);
      } else {
        await createInstitution(data);
      }
      setModal(null);
      await loadInstitutions();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível salvar a instituição.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    setSubmitting(true);
    try {
      await deleteInstitution(selected.id);
      setModal(null);
      await loadInstitutions();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível excluir a instituição.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-page text-ink">
      <div className={`shrink-0 overflow-hidden transition-[width] duration-300 ${isSidebarOpen ? "w-[260px]" : "w-0"}`}>
        <aside className="h-full w-[260px] border-r border-line bg-sidebar px-3 py-6">
          <div className="px-3"><BrandLogo /></div>
          <nav className="mt-10 space-y-1" aria-label="Navegação principal">
            {([
              ["Início", "home", "/inicio"],
              ["Cursos", "school", "#"],
              ["Instituições", "building", "/instituicoes"],
              ["Usuários", "users", "#"],
              ["Relatórios", "chart", "#"],
              ["Perfil", "user", "#"],
            ] as const).map(([label, icon, href]) => (
              <Link key={label} to={href} onClick={() => setIsSidebarOpen(false)} className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm ${label === "Instituições" ? "bg-[#f0dfd4] font-medium text-accent" : "text-ink-2 hover:bg-surface-2"}`}>
                <ActionIcon kind={icon} />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
      <main className="min-w-0 flex-1">
        <header className="flex h-[72px] items-center justify-between border-b border-line bg-surface px-6 sm:px-10">
          <div className="flex items-center gap-3 text-sm text-ink-2">
            <button type="button" className="rounded-md p-1.5 hover:bg-surface-2" aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={isSidebarOpen} onClick={() => setIsSidebarOpen((open) => !open)}>
              <ActionIcon kind="menu" />
            </button>
            <span>Instituições</span>
          </div>
          <div className="flex items-center gap-3"><ThemeToggle /><div className="hidden text-right sm:block"><p className="text-sm font-medium">Administrador</p><p className="text-xs text-ink-3">ADMIN</p></div><div className="grid size-9 place-items-center rounded-full bg-accent text-xs font-semibold text-white">AD</div></div>
        </header>
        <div className="w-full px-5 py-7 sm:px-8 sm:py-9">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><h1 className="font-display text-[30px] leading-9 font-semibold sm:text-[36px]">Instituições</h1><p className="mt-1 text-base text-ink-2">{institutions.length} instituições cadastradas</p></div>
            <button type="button" onClick={openCreate} className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-accent px-5 text-sm font-semibold text-white hover:bg-accent/90 sm:self-auto"><ActionIcon kind="plus" /> Nova instituição</button>
          </div>
          <div className="relative mt-8">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"><ActionIcon kind="search" /></span>
            <input aria-label="Buscar instituições" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, sigla ou endereço" className="h-12 w-full rounded-lg border border-line-strong bg-surface pl-10 pr-4 text-base outline-none focus:border-link focus:ring-[3px] focus:ring-link/20" />
          </div>
          {error && !modal && <p role="alert" className="mt-4 rounded-lg border border-danger/25 bg-danger/8 px-3 py-2 text-sm text-danger">{error}</p>}
          <div className="mt-5 overflow-hidden rounded-xl border border-line bg-surface">
            <div className="hidden grid-cols-[1.3fr_0.8fr_0.9fr_1.2fr_0.4fr] gap-4 border-b border-line bg-sidebar px-5 py-4 text-sm font-medium text-ink-2 sm:grid"><span>Nome</span><span>Campus</span><span>Cidade</span><span>CNPJ</span><span /></div>
            {loading ? <p className="px-5 py-10 text-center text-sm text-ink-2">Carregando instituições...</p> : filtered.length === 0 ? <p className="px-5 py-10 text-center text-sm text-ink-2">Nenhuma instituição encontrada.</p> : filtered.map((institution) => (
              <div key={institution.id} className="grid gap-3 border-b border-line px-5 py-5 last:border-b-0 sm:grid-cols-[1.3fr_0.8fr_0.9fr_1.2fr_0.4fr] sm:items-center sm:gap-4">
                <div><p className="text-base font-medium">{institution.nome}</p></div>
                <span className="text-base text-ink-2">{institution.campus}</span>
                <span className="text-base text-ink-2">{institution.cidade}</span>
                <span className="text-base text-ink-2">{institution.cnpj ? formatCnpj(institution.cnpj) : "—"}</span>
                <div className="flex gap-1 sm:justify-end"><button type="button" onClick={() => openEdit(institution)} className="rounded-md p-2 text-ink-2 hover:bg-surface-2 hover:text-link" aria-label={`Editar ${institution.nome}`}><ActionIcon kind="edit" /></button><button type="button" onClick={() => { setSelected(institution); setError(null); setModal("delete"); }} className="rounded-md p-2 text-danger hover:bg-danger/8" aria-label={`Excluir ${institution.nome}`}><ActionIcon kind="delete" /></button></div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {modal === "create" && <ModalShell title="Nova instituição" onClose={() => setModal(null)}><InstitutionForm initialValue={emptyForm} submitLabel="Cadastrar instituição" onSubmit={handleSave} onCancel={() => setModal(null)} submitting={submitting} error={error} /></ModalShell>}
      {modal === "edit" && selected && <ModalShell title="Editar instituição" onClose={() => setModal(null)}><InstitutionForm initialValue={{ nome: selected.nome, campus: selected.campus, cidade: selected.cidade, cnpj: selected.cnpj ?? "" }} submitLabel="Salvar alterações" onSubmit={handleSave} onCancel={() => setModal(null)} submitting={submitting} error={error} /></ModalShell>}
      {modal === "delete" && selected && <ModalShell title="Excluir instituição" onClose={() => setModal(null)}><div className="px-6 py-6"><p className="text-sm leading-6 text-ink-2"><strong className="text-ink">{selected.nome} · Campus {selected.campus}</strong> será removida. Esta ação não pode ser desfeita.</p>{error && <p role="alert" className="mt-4 rounded-lg border border-danger/25 bg-danger/8 px-3 py-2 text-sm text-danger">{error}</p>}</div><div className="flex justify-end gap-2 border-t border-line px-6 py-4"><button type="button" onClick={() => setModal(null)} className="h-10 rounded-lg border border-line-strong px-4 text-sm font-medium hover:bg-surface-2">Voltar</button><button disabled={submitting} type="button" onClick={() => void handleDelete()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-danger px-4 text-sm font-semibold text-white hover:bg-danger/90 disabled:opacity-60"><ActionIcon kind="delete" />{submitting ? "Excluindo..." : "Excluir instituição"}</button></div></ModalShell>}
    </div>
  );
}
