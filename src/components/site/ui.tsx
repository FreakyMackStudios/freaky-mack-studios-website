import type { ReactNode } from "react";
import s from "./site.module.css";

/** Layout constants from CLAUDE.md: 96px side padding at 1440, fluid below. */
export const PX = "px-5 md:px-10 lg:px-[96px]";
export const MX = "mx-4 md:mx-10 lg:mx-[96px]";
/** Section spacing: 180px between chapters at 1440 (boards), 96px on phones. */
export const PB = "pb-[96px] lg:pb-[180px]";
export const H2 = "m-0 font-extrabold tracking-[-0.03em] text-[36px] md:text-[48px] lg:text-[64px] leading-[1.04] text-balance";
export const LINK_ROW = `${s.link} self-start border-b border-[var(--ink)] pb-[4px]`;

/** Hero kicker: "Chapter 01 — The work" (italic serif, uppercase, tracked). */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${s.it} text-[17px] tracking-[0.08em] text-[var(--muted-2)] uppercase lg:text-[22px] ${className}`}>
      {children}
    </div>
  );
}

/** Section label: "Credits", "The story so far"… (italic serif, 26px at 1440). */
export function Label({
  children,
  className = "",
  size = "text-[20px] lg:text-[26px]",
  color = "text-[var(--muted-2)]",
}: {
  children: ReactNode;
  className?: string;
  size?: string;
  color?: string;
}) {
  return <span className={`${s.it} ${size} ${color} ${className}`}>{children}</span>;
}

/** Page H1: Plus Jakarta 800, uppercase, 88px at 1440 (96px on some boards). */
export function H1({
  children,
  className = "",
  big = false,
  balance = true,
  tracking = "tracking-[-0.03em]",
}: {
  children: ReactNode;
  className?: string;
  big?: boolean;
  balance?: boolean;
  tracking?: string;
}) {
  return (
    <h1
      className={`m-0 leading-[0.98] font-extrabold uppercase ${tracking} ${balance ? "text-balance" : ""} ${
        big ? "text-[clamp(40px,6.667vw,96px)]" : "text-[clamp(40px,6.111vw,88px)]"
      } ${className}`}
    >
      {children}
    </h1>
  );
}

/** The Instrument Serif italic accent word inside a headline ("yes", "appetite", "own"…). */
export function AccentWord({
  children,
  big = false,
  size,
  className = "",
}: {
  children: ReactNode;
  big?: boolean;
  /** Replaces the default size classes (e.g. to scale with a resized headline). */
  size?: string;
  className?: string;
}) {
  return (
    <span
      className={`${s.it} font-normal tracking-[0.01em] text-[var(--accent-text)] ${
        size ?? (big ? "text-[clamp(44px,7.222vw,104px)]" : "text-[clamp(44px,6.667vw,96px)]")
      } ${className}`}
    >
      {children}
    </span>
  );
}

/** Uppercase intro paragraph under a hero headline. */
export function Intro({ children, className = "max-w-[640px]" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`m-0 text-[14px] leading-[1.7] tracking-[0.06em] text-[var(--ink-2)] uppercase lg:text-[16px] ${className}`}>
      {children}
    </p>
  );
}

/** Grey/gradient block standing in for an image or video that hasn't been supplied yet. */
export function Placeholder({ children, className = "", dim = false }: { children: ReactNode; className?: string; dim?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center text-center text-[12px] tracking-[0.2em] uppercase ${dim ? "text-[var(--muted)]" : "text-white/80"} ${className}`}
    >
      {children}
    </div>
  );
}

export function PlayIcon({ size, className = "" }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M3 1.5v9l7-4.5z" />
    </svg>
  );
}


/** Four-bar equaliser for "now playing" states (inherits the text colour). */
export function Eq({ height }: { height: number }) {
  return (
    <span className={`${s.eq} flex items-end gap-[3px]`} style={{ height }} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="block w-[3px] bg-current" style={{ height }} />
      ))}
    </span>
  );
}
