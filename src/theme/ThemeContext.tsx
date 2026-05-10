/**
 * Feature: personal-portfolio-blog
 *
 * Theme context and provider.
 *
 * Responsibilities:
 * - Resolve the initial theme from `localStorage` and, as a fallback,
 *   the OS-level `prefers-color-scheme` media query.
 * - Apply the theme as a class (`light` / `dark`) on `<html>` so Tailwind's
 *   `darkMode: "class"` and our CSS variable switches activate.
 * - Persist subsequent theme changes back to `localStorage`.
 */
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Theme } from "../types/theme";
import {
  readStoredTheme,
  resolveInitialTheme,
  writeStoredTheme,
} from "../lib/theme";

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function prefersDarkSafely(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

function applyThemeClass(t: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", t === "dark");
  root.classList.toggle("light", t === "light");
}

export interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [theme, setThemeState] = useState<Theme>(() =>
    resolveInitialTheme(readStoredTheme(), prefersDarkSafely()),
  );

  // Sync `<html>` class and `localStorage` whenever theme changes.
  useEffect(() => {
    applyThemeClass(theme);
    writeStoredTheme(theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(
    () => setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
    [],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
