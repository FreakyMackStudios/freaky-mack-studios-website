"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASE, Reveal, RevealItem } from "@/components/motion/Reveal";
import { useState } from "react";
import { Still } from "@/components/site/Still";
import { PROJECTS as ALL_PROJECTS, projectHref } from "@/content/projects";
import s from "../home.module.css";
import { CHAPTER, H2, PB, PX } from "@/shared/ui";

/** The first six films on /work. */
const PROJECTS = ALL_PROJECTS.slice(0, 6).map((p) => ({
  title: p.title,
  meta: [p.who, p.category].filter(Boolean).join(" · "),
  href: projectHref(p.slug),
  bg: p.bg,
  still: p.stills[0],
}));

/** The preview card's shape: the film's own (a tall film is shown whole inside a 4:5 card). */
const ratio = (s?: { width: number; height: number }) => (s ? Math.max(0.8, s.width / s.height) : 16 / 9);

/** Chapter 01: hover (or focus / tap) a title to swap the tilted preview. */
export function WorkPreview() {
  const [hovered, setHovered] = useState(0);
  const preview = PROJECTS[hovered] ?? PROJECTS[0];
  return (
    <section id="ch1" className={`flex shrink-0 flex-col gap-[48px] pt-[24px] lg:gap-[96px] lg:pt-[40px] ${PB} ${PX}`}>
      <Reveal className="flex max-w-[900px] flex-col gap-[20px]">
        <div className={`${s.it} ${CHAPTER}`}>Chapter 01 — Six years of saying yes to brands</div>
        <h2 className={`${H2} text-balance`}>Hover a title. Meet the film.</h2>
      </Reveal>
      <div className="grid grid-cols-1 items-start gap-y-[56px] lg:grid-cols-12 lg:gap-x-[32px]">
        <Reveal as="ul" stagger={0.08} amount={0.15} className="m-0 flex list-none flex-col border-t border-[var(--ink)] p-0 lg:col-span-6 lg:col-start-1">
          {PROJECTS.map((p, i) => {
            const active = hovered === i;
            return (
              <RevealItem as="li" from={{ y: 28 }} key={i} onMouseEnter={() => setHovered(i)} className="border-b border-[var(--line)]">
                <Link
                  href={p.href}
                  onFocus={() => setHovered(i)}
                  onClick={() => setHovered(i)}
                  aria-current={active ? "true" : undefined}
                  className="block py-[20px] text-inherit lg:py-[26px]"
                >
                  {/* The active row glides right and brightens. Only transform and colour animate, so nothing
                      reflows, and every title is sized to stay on one line. */}
                  <span
                    className={`${s.workRow} flex items-baseline gap-[14px] lg:gap-[18px] ${active ? "translate-x-[20px] text-[var(--ink)]" : "translate-x-0 text-[var(--dim)]"}`}
                  >
                    <span className={`${s.it} shrink-0 text-[16px] text-[var(--muted-2)] lg:text-[18px]`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex min-w-0 flex-col gap-[4px]">
                      <span className="truncate text-[clamp(17px,4.8vw,26px)] leading-[1.15] font-semibold tracking-[-0.02em] lg:text-[clamp(22px,2.1vw,31px)]">
                        {p.title}
                      </span>
                      <span className="truncate text-[13px] text-[var(--muted)] lg:text-[14px]">{p.meta}</span>
                    </span>
                  </span>
                </Link>
              </RevealItem>
            );
          })}
        </Reveal>
        <Reveal
          from={{ x: 80, y: 0 }}
          duration={1.1}
          delay={0.15}
          className="relative order-first flex flex-col gap-[18px] lg:order-none lg:col-span-6 lg:col-start-7 lg:self-center"
        >
          {/* All six previews are stacked; the active one cross-fades in, so a swap never cuts. */}
          {/* The card takes the hovered film's own shape (easing between shapes), so no frame is cropped. */}
          <motion.div
            className="relative w-full overflow-hidden rounded-[24px] shadow-[0_30px_70px_rgba(0,0,0,0.14)] [transform:rotate(2deg)]"
            initial={false}
            animate={{ aspectRatio: ratio(preview.still) }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ aspectRatio: ratio(PROJECTS[0].still) }}
            aria-live="polite"
          >
            {PROJECTS.map((p, i) => (
              <div
                key={i}
                aria-hidden={hovered !== i}
                className={`${s.workPreview} absolute inset-0 ${hovered === i ? "opacity-100" : "scale-[1.04] opacity-0"}`}
                style={{ background: p.bg }}
              >
                {p.still ? (
                  <Still still={p.still} fit="contain" sizes="(min-width: 1024px) 40vw, 100vw" className="absolute! inset-0" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center px-[24px] text-center text-[12px] tracking-[0.2em] text-white uppercase">
                    [ STILL — {p.title} ]
                  </div>
                )}
                <div className="absolute top-[24px] left-[24px] rounded-full bg-[var(--accent)] px-[16px] py-[8px] text-[13px] font-semibold text-[var(--on-accent)]">
                  {p.meta}
                </div>
              </div>
            ))}
          </motion.div>
          <div className="flex items-baseline justify-between gap-[16px] px-[8px]">
            <span className="grid min-w-0">
              {PROJECTS.map((p, i) => (
                <span
                  key={i}
                  aria-hidden={hovered !== i}
                  className={`${s.it} ${s.workCaption} text-[19px] leading-[1.15] [grid-area:1/1] sm:text-[22px] lg:text-[24px] ${hovered === i ? "translate-y-0 opacity-100" : "translate-y-[8px] opacity-0"}`}
                >
                  {p.title}
                </span>
              ))}
            </span>
            <Link href={preview.href} className={`${s.link} shrink-0 border-b border-[var(--ink)] pb-[3px] text-[14px] font-semibold`}>
              Open project →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
