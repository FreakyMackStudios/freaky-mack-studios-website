"use client";

import { useRef } from "react";
import { flushSync } from "react-dom";
import { setTheme, useTheme } from "./store";
import type { Theme } from "./theme";

/**
 * The Light / Dark switch, fixed bottom-right on every page.
 * Going to Light, a white circle grows out of the switch until it covers the page; going to Dark, the
 * light page shrinks back into the switch. Uses the View Transitions API; browsers without it (or with
 * reduced motion) switch instantly.
 */
export function ThemeToggle() {
  const theme = useTheme();
  const ref = useRef<HTMLButtonElement>(null);
  const dark = theme === "dark";

  const toggle = () => {
    const next: Theme = dark ? "light" : "dark";
    const apply = () => flushSync(() => setTheme(next));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("startViewTransition" in document) || reduced || !ref.current) return apply();

    const box = ref.current.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const toLight = next === "light";
    const html = document.documentElement;
    // The circle ends (or starts) exactly hidden behind the switch, which is opaque, so it slips under it
    // smoothly instead of showing through or popping at the last moment.
    const small = `circle(${(box.height / 2).toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
    const big = `circle(${Math.ceil(r)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
    // Plain CSS keyframes with the exact circle, injected for this one transition. They apply from the very
    // first frame the transition layers exist, so the new page is never shown unclipped at the start (the
    // light page popping in at once going to Light, in Safari). The layer's own clip-path is also set to
    // the end state: a clip-path animation runs on the compositor, and in the frame between it finishing
    // and the transition being torn down the fill can drop, which showed the old light page whole (the
    // white flash going to Dark). No CSS variables or script-driven animations on the transition layers,
    // which browsers support unevenly.
    const layer = toLight ? "new" : "old";
    const style = document.createElement("style");
    style.textContent = `
      html::view-transition-${layer}(root) {
        z-index: 2;
        clip-path: ${toLight ? big : small};
        animation: fm-vt ${toLight ? 750 : 650}ms ${toLight ? "cubic-bezier(0.65, 0, 0.35, 1)" : "cubic-bezier(0.55, 0, 0.45, 1)"} both;
      }
      html::view-transition-${toLight ? "old" : "new"}(root) { z-index: 1; }
      @keyframes fm-vt {
        from { clip-path: ${toLight ? small : big}; }
        to { clip-path: ${toLight ? big : small}; }
      }`;
    // A quick second click starts a new transition before this one is torn down: only the latest one's
    // style stays, and only the latest one clears the flag.
    document.querySelectorAll("style[data-vt-style]").forEach((el) => el.remove());
    style.dataset.vtStyle = "";
    document.head.appendChild(style);
    const id = String(Date.now());
    html.dataset.vt = id;
    const t = document.startViewTransition(apply);
    t.finished.finally(() => {
      style.remove();
      if (html.dataset.vt === id) delete html.dataset.vt;
    });
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      title={dark ? "Switch to light" : "Switch to dark"}
      onClick={toggle}
      data-theme-toggle
      className={`fixed right-4 bottom-4 z-[1000] flex h-[44px] w-[84px] items-center rounded-full border p-[4px] shadow-[0_8px_30px_rgba(0,0,0,0.22)] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)] sm:right-6 sm:bottom-6 ${
        dark ? "border-white/15 bg-[#161616]" : "border-black/10 bg-white"
      }`}
    >
      {/* The knob slides under the active icon. */}
      <span
        aria-hidden="true"
        className={`absolute top-[4px] left-[4px] h-[34px] w-[38px] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.5,1)] ${
          dark ? "translate-x-[38px] bg-white" : "translate-x-0 bg-[#0a0a0a]"
        }`}
      />
      <span
        aria-hidden="true"
        className={`relative flex h-[34px] w-[38px] items-center justify-center transition-[color,transform] duration-500 ${
          dark ? "rotate-[-90deg] text-white/55" : "rotate-0 text-white"
        }`}
      >
        <SunIcon />
      </span>
      <span
        aria-hidden="true"
        className={`relative flex h-[34px] w-[38px] items-center justify-center transition-[color,transform] duration-500 ${
          dark ? "rotate-0 text-[#0a0a0a]" : "rotate-[30deg] text-black/45"
        }`}
      >
        <MoonIcon />
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="12" y1="2.5" x2="12" y2="4.8" transform={`rotate(${a} 12 12)`} />
      ))}
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7A9.6 9.6 0 1 0 21.2 15.4a.6.6 0 0 0-.7-.8Z" />
    </svg>
  );
}
