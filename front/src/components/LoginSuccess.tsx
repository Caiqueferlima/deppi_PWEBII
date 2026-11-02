type LoginSuccessProps = {
  onBack: () => void;
};

export default function LoginSuccess({ onBack }: LoginSuccessProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-page p-6">
      <div className="w-full max-w-[380px] rounded-[10px] border border-line bg-surface p-5 text-center">
        <h1 className="font-display text-[26px] leading-[31px] font-semibold text-ink">
          Login realizado!
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          Você foi autenticado com sucesso.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 h-10 rounded-lg border border-line-strong bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-2"
        >
          Voltar ao login
        </button>
      </div>
    </main>
  );
}
