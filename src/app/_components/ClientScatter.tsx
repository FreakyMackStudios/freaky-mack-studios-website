"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { Still } from "@/components/site/Still";
import { BRANDS } from "@/content/brands";
import { PROJECTS } from "@/content/projects";
import s from "../home.module.css";
import { PB, PX } from "@/shared/ui";

const TILTS = [-6, 4, -3, 7, -8, 3, -2, 5, -4, 6, -5, 2];
const DROPS = [0, 18, -6, 12, 4, -10, 16, 2, -4, 10, -8, 14]; // a little vertical scatter, in px
const BY_SLUG = new Map(PROJECTS.map((p) => [p.slug, p]));

/**
 * "…and the brands that trusted us with the yes". Tablets and up: every brand, and those with a published
 * film open a card on hover, focus or click, with the film's cover and a link to it on YouTube.
 * Phones: just the ten major brands, as plain tags.
 */
export function ClientScatter() {
  const [open, setOpen] = useState<number | null>(null);
  const closing = useRef<number | undefined>(undefined);
  const root = useRef<HTMLDivElement>(null);

  // The cards are for tablets and up; phones get plain tags.
  const show = (i: number) => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    window.clearTimeout(closing.current);
    setOpen(i);
  };
  // A short grace period lets the pointer cross from the tag to its card.
  const hide = () => {
    window.clearTimeout(closing.current);
    closing.current = window.setTimeout(() => setOpen(null), 140);
  };

  // Tap elsewhere or press Escape to close.
  useEffect(() => {
    if (open === null) return;
    const away = (e: PointerEvent) => {
      if (!(e.target instanceof Node) || !root.current?.querySelector(`[data-brand="${open}"]`)?.contains(e.target)) setOpen(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <section aria-label="Clients" className={`flex shrink-0 flex-col items-center gap-[32px] lg:gap-[48px] ${PB} ${PX}`}>
      <Reveal className={`${s.it} text-center text-[20px] text-[var(--muted-2)] lg:text-[26px]`}>
        …and the brands that trusted us with the yes
      </Reveal>
      <div ref={root} className="w-full max-w-[1200px]">
        <Reveal stagger={0.04} delay={0.1} amount={0.2} className="flex flex-wrap items-center justify-center gap-x-[12px] gap-y-[20px] lg:gap-x-[18px] lg:gap-y-[28px]">
          {BRANDS.map((b, i) => {
            const film = b.project ? BY_SLUG.get(b.project) : undefined;
            const tilt = TILTS[i % TILTS.length];
            const tag = `${s.tag} relative block rounded-full border px-[16px] py-[9px] text-[15px] whitespace-nowrap lg:px-[24px] lg:py-[13px] lg:text-[20px] ${
              b.accent
                ? "border-[var(--accent)] bg-[var(--accent)] font-semibold text-[var(--on-accent)]"
                : "border-[var(--ink)] bg-[var(--pill-bg)] font-semibold"
            }`;
            return (
              // The wrapper pops in and carries the scatter; the tag inside keeps its tilt and hover.
              <RevealItem
                as="span"
                key={b.name}
                from={{ y: 40, scale: 0.6, rotate: tilt * 3 }}
                data-brand={i}
                className={`relative ${b.major ? "inline-flex" : "hidden md:inline-flex"} ${open === i ? "z-20" : "z-0"}`}
                style={{ top: `${DROPS[i % DROPS.length]}px` }}
                onMouseEnter={film ? () => show(i) : undefined}
                onMouseLeave={film ? hide : undefined}
              >
                {film ? (
                  <>
                    {/* Phones: a plain tag. */}
                    <span className={`${tag} md:hidden`} style={{ transform: `rotate(${tilt}deg)` }}>
                      {b.name}
                    </span>
                    <button
                      type="button"
                      className={`${tag} hidden cursor-pointer md:block`}
                      style={{ transform: `rotate(${tilt}deg)` }}
                      aria-expanded={open === i}
                      aria-controls={`brand-card-${i}`}
                      // Opens (focus and click both fire on a tap, so it never toggles shut); tap away or Escape closes.
                      onClick={() => show(i)}
                      onFocus={() => show(i)}
                    >
                      {b.name}
                    </button>
                    <BrandCard id={`brand-card-${i}`} open={open === i} film={film} brand={b.name} onFocus={() => show(i)} />
                  </>
                ) : (
                  <span className={tag} style={{ transform: `rotate(${tilt}deg)` }}>
                    {b.name}
                  </span>
                )}
              </RevealItem>
            );
          })}
          <RevealItem as="span" from={{ y: 40, scale: 0.6 }} className="inline-flex">
            <span
              className={`${s.tag} block rounded-full border border-dashed border-[var(--ink)] bg-[var(--pill-bg)] px-[16px] py-[9px] text-[15px] font-medium text-[var(--muted)] lg:px-[24px] lg:py-[13px] lg:text-[20px]`}
              style={{ transform: "rotate(5deg)" }}
            >
              + many more
            </span>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}

/** The card above a brand: its film's cover, title and a link to the film on YouTube. Kept inside the window. */
function BrandCard({
  id,
  open,
  film,
  brand,
  onFocus,
}: {
  id: string;
  open: boolean;
  film: (typeof PROJECTS)[number];
  brand: string;
  onFocus: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const [below, setBelow] = useState(false);
  useLayoutEffect(() => {
    if (!open || !ref.current) return;
    // Measure where the centred card would sit (without the current shift) and nudge it inside the window.
    const r = ref.current.getBoundingClientRect();
    // No room above the tag (near the top of the window): open it below instead.
    const tag = ref.current.parentElement?.getBoundingClientRect();
    if (tag) setBelow(tag.top - r.height < 8);
    const left = r.left - shift;
    const right = r.right - shift;
    const pad = 12;
    const next = left < pad ? pad - left : right > window.innerWidth - pad ? window.innerWidth - pad - right : 0;
    if (Math.abs(next - shift) > 1) setShift(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const cover = film.stills[0];
  return (
    <div
      ref={ref}
      id={id}
      inert={!open}
      className={`${s.brandCard} absolute left-1/2 w-[min(280px,80vw)] max-md:hidden ${below ? "top-full pt-[14px]" : "bottom-full pb-[14px]"} ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      style={{ transform: `translateX(calc(-50% + ${shift}px)) translateY(${open ? 0 : below ? -10 : 10}px) scale(${open ? 1 : 0.96})` }}
    >
      <a
        href={film.youtube}
        target="_blank"
        rel="noopener noreferrer"
        onFocus={onFocus}
        aria-label={`Watch ${film.title} (${brand}) on YouTube`}
        className="group block overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
      >
        <div className="relative">
          {cover && <Still still={cover} sizes="280px" />}
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 flex h-[48px] w-[48px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent)] transition-transform duration-300 group-hover:scale-110"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        <span className="flex items-baseline justify-between gap-[12px] px-[14px] py-[12px]">
          <span className="min-w-0 truncate text-[14px] font-semibold">{film.title}</span>
          <span className="shrink-0 text-[12px] text-[var(--muted)]">YouTube ↗</span>
        </span>
      </a>
    </div>
  );
}
