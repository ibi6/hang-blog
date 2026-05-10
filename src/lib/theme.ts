/**
 * Feature: personal-portfolio-blog
 * Theme resolution helpers - pure logic layer for ThemeContext.
 */
import type { Theme } from "../types/theme";

const STORAGE_KEY = "theme";

/**
 * Resolve the initial theme deterministically from persisted preference and
 * the user's OS-level color-scheme preference.
 *
 * - If `stored === "light"` returns "light".
 * - If `stored === "dark"` returns "dark".
 * - Otherwise falls back to `prefersDark ? "dark" : "light"`.
 */
export function resolveInitialTheme(
  stored: string | null,
  prefersDark: boolean,
): Theme {
  if (stored === "light") return "light";
  if (stored === "dark") return "dark";
  return prefersDark ? "dark" : "light";
}

/**
 * Safely read the stored theme value. Returns null if localStorage is
 * unavailable (e.g. Safari private mode, quota exceeded, SSR).
 */
export function readStoredTheme(): string | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Safely persist the given theme. Silently no-ops on failure.
 */
export function writeStoredTheme(t: Theme): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    /* ignore - storage unavailable */
  }
}
