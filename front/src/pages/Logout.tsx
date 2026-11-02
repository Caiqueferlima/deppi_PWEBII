import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export default function Logout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-page p-6">
      <div
        role="dialog"
        aria-labelledby="logout-title"
        className="w-full max-w-[500px] overflow-hidden rounded-xl border border-line bg-surface shadow-[0_24px_64px_rgba(0,0,0,0.18)]"
      >
        <div className="px-6 pt-[22px] pb-6">
          <h1
            id="logout-title"
            className="font-display text-[19px] leading-6 font-semibold text-ink"
          >
            Sair do sistema
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Tem certeza que deseja encerrar sua sessão?
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-6 py-3.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="h-10 rounded-lg border border-line-strong bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-link/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="h-10 rounded-lg bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-link/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saindo…" : "Sair"}
          </button>
        </div>
      </div>
    </main>
  );
}