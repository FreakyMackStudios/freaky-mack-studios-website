"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, STORAGE_KEY, THEMES, resolveTheme, type Theme } from "./theme";

/**
 * The theme lives on <html> (data-theme + CSS variables). The head script sets it before first paint;
 * this store reads and updates it, so the choice survives client-side navigation (the root layout never
 * re-renders <html>) and reloads (localStorage).
 */
const listeners = new Set<() => void>();

const readDom = (): Theme => {
  const t = document.documentElement.getAttribute("data-theme");
  return (THEMES as readonly string[]).includes(t ?? "") ? (t as Theme) : DEFAULT_THEME;
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readDom, () => DEFAULT_THEME);
}

/** Apply a theme: <html> attribute + variables, localStorage. */
export function setTheme(theme: Theme) {
  const r = document.documentElement;
  const vars = resolveTheme(theme);
  r.setAttribute("data-theme", theme);
  for (const [k, v] of Object.entries(vars)) r.style.setProperty(k, v);
  r.style.background = vars["--ground"];
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", vars["--ground"]);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode: the theme still applies to this page */
  }
  listeners.forEach((l) => l());
}
