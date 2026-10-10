/**
 * The site's look. The accent is final (Cobalt); visitors can switch between Light and Dark.
 * The accent lives in CSS variables (--accent, --on-accent, --accent-text) so it can still be swapped in one place.
 */
export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export const ACCENT = {
  accent: "#1F3BFF",
  onAccent: "#ffffff",
  // Where the accent is used as *text* on the black page, the fill colour is too dark to read.
  textOnDark: "#4A62FF",
};

export const LIGHT_GROUND = "#ffffff";
export const DARK_GROUND = "#0a0a0a";

// The client's pick: Dark (the boards themselves are drawn in Light).
export const DEFAULT_THEME: Theme = "dark";

// Versioned so a choice saved under an earlier scheme doesn't apply. Bump it when the defaults change.
export const STORAGE_KEY = "fm-theme-v3";

/** The CSS variables a theme resolves to. Used by the head script (before paint) and by the toggle. */
export function resolveTheme(theme: Theme) {
  const dark = theme === "dark";
  return {
    "--accent": ACCENT.accent,
    "--on-accent": ACCENT.onAccent,
    "--accent-text": dark ? ACCENT.textOnDark : ACCENT.accent,
    "--ground": dark ? DARK_GROUND : LIGHT_GROUND,
  };
}
