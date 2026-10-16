"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { TESTIMONIALS, byline, type Testimonial } from "@/content/testimonials";
import s from "../home.module.css";
import { CHAPTER, PB, PX } from "@/shared/ui";

/** The three card looks, in turn: light, dark and accent. Each card keeps a slight tilt, alternating. */
const LOOKS = [
  { card: "bg-[var(--surface)]", mark: "text-[var(--accent-text)]", muted: "text-[var(--muted)]", avatar: "bg-[var(--surface-3)]", rule: "border-[var(--line)]" },
  { card: "bg-[var(--inv-bg)] text-[var(--inv-ink)]", mark: "text-[var(--accent)]", muted: "text-[var(--inv-muted)]", avatar: "bg-[var(--inv-avatar)] text-[var(--inv-ink)]", rule: "border-current/15" },
  { card: "bg-[var(--accent)] text-[var(--on-accent)]", mark: "text-[var(--on-accent)]", muted: "text-[var(--on-accent)]/80", avatar: "bg-[var(--on-accent)] text-[var(--accent)]", rule: "border-current/25" },
] as const;
const TILTS = [-1, 0.8, -0.6, 1, -0.8, 0.6, -1, 0.8];

const initials = (name: string) =>
  name
    .replace(/ Team$/, "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/**
 * "…and what they said afterwards". Every quote sits in a card of exactly the same size (the row is one
 * grid line, so the cards share the tallest one's height), scrolled sideways: three in view on wide screens,
 * two on laptops and tablets, one and a peek on phones. Arrows step one card; the counter follows the scroll.
 */
export function Testimonials() {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const total = TESTIMONIALS.length;

  // The first card fully in view sets the counter; the arrows switch off at either end.
  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const left = el.getBoundingClientRect().left;
    const first = items.findIndex((li) => li.getBoundingClientRect().left >= left - 4);
    setIndex(Math.max(0, first));
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const target = items[Math.min(total - 1, Math.max(0, index + dir))];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: target.offsetLeft - items[0].offsetLeft, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section aria-label="What clients say" className={`flex shrink-0 flex-col gap-[28px] lg:gap-[40px] ${PB}`}>
      <Reveal className={`flex items-end justify-between gap-[24px] ${PX}`}>
        <div className={`${s.it} ${CHAPTER}`}>…and what they said afterwards</div>
        <div className="flex shrink-0 items-center gap-[14px]">
          <span className="hidden text-[14px] text-[var(--muted)] tabular-nums sm:inline">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <Arrow dir={-1} disabled={index === 0} onClick={() => step(-1)} />
          <Arrow dir={1} disabled={atEnd} onClick={() => step(1)} />
        </div>
      </Reveal>

      <Reveal from={{ y: 60 }} duration={0.9}>
        <ul
          ref={track}
          tabIndex={0}
          aria-label="Testimonials, scroll sideways"
          className={`${s.noBar} m-0 grid list-none snap-x snap-mandatory auto-cols-[84%] grid-flow-col gap-[20px] overflow-x-auto overscroll-x-contain py-[24px] sm:auto-cols-[calc((100%-24px)/2)] sm:gap-[24px] lg:auto-cols-[calc((100%-32px)/2)] lg:gap-[32px] xl:auto-cols-[calc((100%-64px)/3)] focus-visible:outline-offset-[-2px] ${PX} scroll-px-5 md:scroll-px-10 lg:scroll-px-[96px]`}
        >
          {TESTIMONIALS.map((t, i) => (
            <li key={t.name} className="flex snap-start" aria-label={`${i + 1} of ${total}`}>
              <Card t={t} look={LOOKS[i % LOOKS.length]} tilt={TILTS[i % TILTS.length]} />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function Arrow({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? "Next testimonial" : "Previous testimonial"}
      className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-[var(--ink)] text-[var(--ink)] transition-[background,color,opacity] duration-300 enabled:hover:bg-[var(--ink)] enabled:hover:text-[var(--ground)] disabled:cursor-default disabled:opacity-30"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir === 1 ? "M5 12h14m-6-6 6 6-6 6" : "M19 12H5m6-6-6 6 6 6"} />
      </svg>
    </button>
  );
}

function Card({ t, look, tilt }: { t: Testimonial; look: (typeof LOOKS)[number]; tilt: number }) {
  const sub = byline(t);
  return (
    <figure
      className={`${s.quoteCard} m-0 flex w-full flex-col rounded-[28px] p-[28px] lg:p-[36px] ${look.card}`}
      style={{ ["--tilt" as string]: `${tilt}deg` }}
    >
      <span aria-hidden="true" className={`${s.serif} block h-[44px] text-[88px] leading-[0.9] ${look.mark}`}>
        “
      </span>
      <blockquote className={`${s.serif} m-0 mt-[18px] flex-1 text-[21px] leading-[1.3] tracking-[-0.005em] text-pretty lg:text-[23px]`}>
        {t.quote}
      </blockquote>
      <figcaption className={`mt-[28px] flex items-center gap-[14px] border-t pt-[22px] ${look.rule}`}>
        <span
          className={`relative flex h-[56px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-full text-[17px] font-bold tracking-[0.02em] ${look.avatar}`}
        >
          {t.photo ? (
            <Image src={t.photo.src} alt={t.photo.alt} fill sizes="56px" className="object-cover" />
          ) : (
            <span aria-hidden="true">{initials(t.name)}</span>
          )}
        </span>
        <span className="flex min-w-0 flex-col gap-[3px]">
          <span className="text-[16px] font-semibold">{t.name}</span>
          {sub && <span className={`text-[13px] ${look.muted}`}>{sub}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
