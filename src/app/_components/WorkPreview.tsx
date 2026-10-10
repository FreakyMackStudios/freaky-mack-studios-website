"use client";

import Link from "next/link";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { useState } from "react";
import { PROJECTS as ALL_PROJECTS, projectHref } from "@/content/projects";
import s from "../home.module.css";
import { CHAPTER, H2, PB, PX } from "@/shared/ui";

/** The first six films on /work. */
const PROJECTS = ALL_PROJECTS.slice(0, 6).map((p) => ({
  title: p.title,
  meta: [p.who, p.category].filter(Boolean).join(" · "),
  href: projectHref(p.slug),
  bg: p.bg,
}));

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
              <RevealItem
                as="li"
                from={{ y: 28 }}
                key={i}
                onMouseEnter={() => setHovered(i)}
                className={`${s.row} border-b border-[var(--line)] ${active ? "pl-[20px] text-[var(--ink)]" : "pl-0 text-[var(--dim)]"}`}
              >
                <Link
                  href={p.href}
                  onFocus={() => setHovered(i)}
                  onClick={() => setHovered(i)}
                  aria-current={active ? "true" : undefined}
                  className="flex flex-wrap items-baseline justify-between gap-x-[24px] gap-y-[4px] py-[20px] text-inherit lg:py-[26px]"
                >
                  <span className="flex items-baseline gap-[14px] lg:gap-[18px]">
                    <span className={`${s.it} text-[16px] text-[var(--muted-2)] lg:text-[18px]`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[24px] font-semibold tracking-[-0.02em] lg:text-[34px]">{p.title}</span>
                  </span>
                  <span className="text-[13px] whitespace-nowrap text-[var(--muted)] lg:text-[14px]">{p.meta}</span>
                </Link>
              </RevealItem>
            );
          })}
        </Reveal>
        <Reveal
          from={{ x: 80, y: 0 }}
          duration={1.1}
          delay={0.15}
          className="relative order-first flex flex-col gap-[18px] lg:order-none lg:col-span-5 lg:col-start-8"
        >
          <div
            className="relative h-[340px] overflow-hidden rounded-[24px] shadow-[0_30px_70px_rgba(0,0,0,0.14)] transition-[background] duration-500 [transform:rotate(2deg)] md:h-[460px] lg:h-[560px]"
            style={{ background: preview.bg }}
            aria-live="polite"
          >
            <div className="absolute inset-0 flex items-center justify-center text-[12px] tracking-[0.2em] text-white uppercase">
              [ STILL — {preview.title} ]
            </div>
            <div className="absolute top-[24px] left-[24px] rounded-full bg-[var(--accent)] px-[16px] py-[8px] text-[13px] font-semibold text-[var(--on-accent)]">
              {preview.meta}
            </div>
          </div>
          <div className="flex items-baseline justify-between px-[8px]">
            <span className={`${s.it} text-[22px] lg:text-[24px]`}>{preview.title}</span>
            <Link href={preview.href} className={`${s.link} border-b border-[var(--ink)] pb-[3px] text-[14px] font-semibold`}>
              Open project →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
