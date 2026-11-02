import { useState, type SubmitEvent } from "react";
import { login } from "../services/authService";
import type { LoginCredentials, LoginResponse } from "../types/auth";
import AlertIcon from "../components/AlertIcon";
import BrandLogo from "../components/BrandLogo";
import LoginSuccess from "../components/LoginSuccess";
import PasswordField from "../components/PasswordField";

const inputClass =
  "h-11 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-sm text-ink " +
  "outline-none transition-shadow placeholder:text-ink-3 " +
  "focus:border-link focus:ring-[3px] focus:ring-link/20 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [session, setSession] = useState<LoginResponse | null>(null);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const credentials: LoginCredentials = {
        email: email.trim(),
        senha: password,
      };

      const result = await login(credentials);
      setSession(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (session) {
    return <LoginSuccess onBack={() => setSession(null)} />;
  }

  return (
    <main className="grid min-h-screen bg-page lg:grid-cols-2">
      {/* Painel de capa */}
      <aside className="bg-stripes relative hidden flex-col justify-between border-r border-line p-12 lg:flex">
        <BrandLogo />

        <p className="pointer-events-none absolute inset-0 grid place-items-center font-mono text-xs text-ink-3">
          [ foto do campus / alunos em aula ]
        </p>

        <div className="relative max-w-[460px]">
          <h2 className="font-display text-[40px] leading-[44px] font-semibold text-ink">
            Cursos de extensão do IFCE, num só lugar.
          </h2>
          <p className="mt-3 text-[15px] leading-6 text-ink-2">
            Inscreva-se, envie seus documentos e acompanhe a análise da sua
            inscrição.
          </p>
        </div>
      </aside>

      {/* Formulário */}
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 lg:hidden">
            <BrandLogo />
          </div>

          <h1 className="font-display text-[26px] leading-[31px] font-semibold text-ink">
            Entrar
          </h1>
          <p className="mt-1.5 text-sm text-ink-2">
            Use seu e-mail institucional.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2.5 rounded-lg border border-danger/25 bg-danger/8 px-3.5 py-3 text-[13px] text-danger"
              >
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-ink">
                E-mail institucional
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[13px] font-medium text-ink"
              >
                Senha
              </label>
              <PasswordField
                value={password}
                onChange={setPassword}
                disabled={loading}
                inputClassName={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-accent text-[15px] font-semibold text-white transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-link/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4 text-xs text-ink-3">
            <span className="h-px flex-1 bg-line" />
            ou
            <span className="h-px flex-1 bg-line" />
          </div>

          <p className="text-center text-[13.5px] text-ink-2">
            Ainda não tem conta?{" "}
            <a
              href="/cadastro"
              className="font-medium text-link underline underline-offset-2 transition-colors hover:text-link-hover"
            >
              Crie sua conta
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}