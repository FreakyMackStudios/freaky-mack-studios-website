"use client";

import Link from "next/link";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { useState } from "react";
import { Still as StillImage } from "@/components/site/Still";
import type { Still } from "@/content/stills";
import { PROJECTS as ALL_PROJECTS, projectHref } from "@/content/projects";
import s from "../home.module.css";
import { CHAPTER, H2, PB, PX } from "@/shared/ui";

/** The first six films on /work. */
const PROJECTS = ALL_PROJECTS.slice(0, 6).map((p) => ({
  title: p.title,
  meta: [p.who, p.category].filter(Boolean).join(" · "),
  href: projectHref(p.slug),
  stills: pickThree(p.stills),
}));

/** Three frames spread across the film (its cover, then one from each later third), so they differ. */
function pickThree<T>(all: T[]): T[] {
  const n = all.length;
  if (n <= 3) return all;
  const idx = [0, Math.round(n / 3), Math.round((2 * n) / 3)].map((i) => Math.min(i, n - 1));
  return [...new Set(idx)].map((i) => all[i]);
}

const GAP = 2; // % of the row's width, between frames (horizontal and vertical alike)
const ratio = (st: Still) => st.width / st.height;

/**
 * The mosaic under the list: the cover large on the left, two frames stacked on the right. Widths are
 * solved from each frame's own shape so the right column ends exactly level with the cover: nothing is
 * cropped and nothing is left hanging. Vertical films (or fewer than three frames) sit in one even row.
 */
/** Widths (in %) for one even row: every frame the same height, widths in proportion to their shapes. */
const rowWidths = (stills: Still[], gap = GAP) => {
  const sum = stills.reduce((t, st) => t + ratio(st), 0);
  const free = 100 - gap * (stills.length - 1);
  return stills.map((st) => (free * ratio(st)) / sum);
};

function mosaic(stills: Still[]) {
  const [a, b, c] = stills;
  if (!a || !b || !c || stills.some((st) => st.height > st.width)) {
    return { kind: "row" as const, widths: rowWidths(stills) };
  }
  // Cover width W and right column width w, with W / r1 = w / r2 + GAP + w / r3 and W + GAP + w = 100.
  const r1 = ratio(a);
  const w = (100 - GAP - r1 * GAP) / (r1 * (1 / ratio(b) + 1 / ratio(c)) + 1);
  return { kind: "split" as const, cover: 100 - GAP - w, side: w };
}

/**
 * Chapter 01. Tablets and up: the titles on top; hover (or focus) one to bring its frames up underneath.
 * Phones: the titles are dropdowns; the open one shows a row of two of its frames.
 */
export function WorkPreview() {
  const [hovered, setHovered] = useState(0);
  return (
    <section id="ch1" className={`flex shrink-0 flex-col gap-[40px] pt-[24px] lg:gap-[64px] lg:pt-[40px] ${PB} ${PX}`}>
      <Reveal className="flex max-w-[900px] flex-col gap-[20px]">
        <div className={`${s.it} ${CHAPTER}`}>Chapter 01 — Six years of saying yes to brands</div>
        <h2 className={`${H2} text-balance`}>
          <span className="md:hidden">Tap</span>
          <span className="hidden md:inline">Hover</span> a title. Meet the film.
        </h2>
      </Reveal>

      <Reveal as="ul" stagger={0.06} amount={0.15} className="m-0 grid list-none grid-cols-1 gap-x-[32px] border-t border-[var(--ink)] p-0 md:grid-cols-2 lg:gap-x-[48px]">
        {PROJECTS.map((p, i) => {
          const active = hovered === i;
          return (
            <RevealItem as="li" from={{ y: 28 }} key={i} onMouseEnter={() => setHovered(i)} className="min-w-0 border-b border-[var(--line)]">
              <Link
                href={p.href}
                onFocus={() => setHovered(i)}
                onClick={() => setHovered(i)}
                aria-current={active ? "true" : undefined}
                className="hidden py-[18px] text-inherit md:block lg:py-[24px]"
              >
                {/* The active title glides right and brightens. Only transform and colour animate, so nothing
                    reflows, and every title is sized to stay on one line. */}
                <span
                  className={`${s.workRow} flex items-baseline gap-[14px] lg:gap-[18px] ${active ? "translate-x-[20px] text-[var(--ink)]" : "translate-x-0 text-[var(--dim)]"}`}
                >
                  <span className={`${s.it} shrink-0 text-[16px] text-[var(--muted-2)] lg:text-[18px]`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex min-w-0 flex-col gap-[4px]">
                    <span className="truncate text-[clamp(17px,4.8vw,26px)] leading-[1.15] font-semibold tracking-[-0.02em] md:text-[clamp(17px,2.1vw,30px)]">
                      {p.title}
                    </span>
                    <span className="truncate text-[13px] text-[var(--muted)] lg:text-[14px]">{p.meta}</span>
                  </span>
                </span>
              </Link>
              {/* Phones: each film is a dropdown. Tapping it opens one row of two frames and closes the one before. */}
              <button
                type="button"
                onClick={() => setHovered(i)}
                aria-expanded={active}
                aria-controls={`ch1-panel-${i}`}
                className="block w-full border-0 bg-transparent p-0 py-[18px] text-left text-inherit md:hidden"
              >
                <span
                  className={`${s.workRow} flex items-baseline gap-[14px] lg:gap-[18px] ${active ? "translate-x-[20px] text-[var(--ink)]" : "translate-x-0 text-[var(--dim)]"}`}
                >
                  <span className={`${s.it} shrink-0 text-[16px] text-[var(--muted-2)] lg:text-[18px]`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex min-w-0 flex-col gap-[4px]">
                    <span className="truncate text-[clamp(17px,4.8vw,26px)] leading-[1.15] font-semibold tracking-[-0.02em] md:text-[clamp(17px,2.1vw,30px)]">
                      {p.title}
                    </span>
                    <span className="truncate text-[13px] text-[var(--muted)] lg:text-[14px]">{p.meta}</span>
                  </span>
                </span>
              </button>
              <div
                id={`ch1-panel-${i}`}
                inert={!active}
                className={`${s.accordion} grid md:hidden ${active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="flex items-start justify-between pt-[4px] pb-[14px]">
                    {rowWidths(p.stills.slice(0, 2), 3).map((w, j) => (
                      <div key={p.stills[j].src} style={{ width: `${w}%` }}>
                        <StillImage still={p.stills[j]} sizes="50vw" className="rounded-[14px]" />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pb-[18px]">
                    <Link href={p.href} className={`${s.link} border-b border-[var(--ink)] pb-[3px] text-[14px] font-semibold`}>
                      Open project →
                    </Link>
                  </div>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </Reveal>

      {/* All six mosaics share one grid cell; the active one's frames drift in one after another, so a swap
          cross-fades instead of cutting. Each film's caption sits right under its own frames. */}
      <Reveal from={{ y: 60 }} duration={1} className="hidden items-start md:grid" aria-live="polite">
        {PROJECTS.map((p, i) => {
          const on = hovered === i;
          const m = mosaic(p.stills);
          const photo = (st: Still, j: number, width: number, extra = "") => (
            <div
              key={st.src}
              className={`${s.collagePhoto} relative shrink-0 ${extra}`}
              style={{
                width: `${width}%`,
                transform: on ? `rotate(${[-0.8, 0.9, -0.6][j]}deg)` : `translateY(18px) rotate(${[-1.6, 1.8, -1.2][j]}deg) scale(0.98)`,
                transitionDelay: on ? `${j * 0.08}s` : "0s",
              }}
            >
              <StillImage still={st} sizes={j === 0 ? "(min-width: 1024px) 60vw, 70vw" : "(min-width: 1024px) 30vw, 40vw"} className="rounded-[16px] shadow-[0_24px_60px_rgba(0,0,0,0.3)] lg:rounded-[24px]">
                {j === 0 && (
                  <span className="absolute top-[12px] left-[12px] rounded-full bg-[var(--accent)] px-[14px] py-[7px] text-[12px] font-semibold text-[var(--on-accent)] lg:top-[24px] lg:left-[24px] lg:px-[16px] lg:py-[8px] lg:text-[13px]">
                    {p.meta}
                  </span>
                )}
              </StillImage>
            </div>
          );
          return (
            <div key={i} aria-hidden={!on} className={`${s.workPreview} [grid-area:1/1] ${on ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              {m.kind === "split" ? (
                <div className="flex items-start justify-between">
                  {photo(p.stills[0], 0, m.cover)}
                  <div className="flex flex-col" style={{ width: `${m.side}%` }}>
                    {/* Vertical margins in % follow the row's width, so the gap matches the horizontal one. */}
                    {photo(p.stills[1], 1, 100)}
                    <div style={{ height: 0, paddingTop: `${(GAP * 100) / m.side}%` }} />
                    {photo(p.stills[2], 2, 100)}
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">{p.stills.map((st, j) => photo(st, j, m.widths[j]))}</div>
              )}
              <div className={`${s.workCaption} mt-[20px] flex items-baseline justify-between gap-[16px] px-[4px] lg:mt-[28px] ${on ? "translate-y-0" : "translate-y-[8px]"}`}>
                <span className={`${s.it} min-w-0 text-[19px] leading-[1.15] sm:text-[22px] lg:text-[26px]`}>{p.title}</span>
                <Link href={p.href} tabIndex={on ? undefined : -1} className={`${s.link} shrink-0 border-b border-[var(--ink)] pb-[3px] text-[14px] font-semibold`}>
                  Open project →
                </Link>
              </div>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
