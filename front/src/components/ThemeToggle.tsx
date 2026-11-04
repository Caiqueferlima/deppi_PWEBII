import { useTheme } from "./ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const path =
    theme === "dark"
      ? "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
      : "M21 12.8A8.5 8.5 0 1 1 11.2 3a6.7 6.7 0 0 0 9.8 9.8Z";

  return (
    <button
      type="button"
      className="rounded-md p-2 text-ink-2 hover:bg-surface-2"
      aria-label={theme === "dark" ? "Ativar modo diurno" : "Ativar modo noturno"}
      onClick={toggleTheme}
    >
      <svg aria-hidden="true" className="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
      </svg>
    </button>
  );
}
