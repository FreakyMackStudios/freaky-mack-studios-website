"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { EASE, Reveal } from "@/components/motion/Reveal";
import { ChipGroup } from "@/components/site/ChipGroup";
import s from "@/components/site/site.module.css";
import { PX } from "@/components/site/ui";
import { FILTERS, PROJECTS, projectHref, whoAndYear, type Project } from "@/content/projects";

const TILTS = [-1.2, 1, -0.6, 1.4];

function Card({ p, i }: { p: Project; i: number }) {
  return (
    <Link
      href={projectHref(p.slug)}
      className={`${s.card} flex flex-col gap-[18px]`}
      style={{ transform: `rotate(${TILTS[i % 4]}deg)` }}
    >
      <div className="relative h-[300px] overflow-hidden rounded-[24px] md:h-[380px] lg:h-[460px]" style={{ background: p.bg }}>
        <div className="absolute inset-0 flex items-center justify-center text-[12px] tracking-[0.2em] text-white/80 uppercase">
          [ STILL ]
        </div>
        <span className="absolute top-[20px] left-[20px] rounded-full bg-[var(--accent)] px-[16px] py-[7px] text-[13px] font-semibold text-[var(--on-accent)] [transform:rotate(-4deg)]">
          {p.category}
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-[24px] px-[6px]">
        <span className="text-[22px] font-semibold tracking-[-0.02em] lg:text-[28px]">{p.title}</span>
        <span className="max-w-[48%] text-right text-[13px] text-[var(--muted)] lg:max-w-[45%] lg:text-[14px]">{whoAndYear(p)}</span>
      </div>
    </Link>
  );
}

/**
 * One column of cards. Each card rises in when it first scrolls into view; when the filter changes,
 * leaving cards shrink away and the rest glide to their new places (layout="position", so the tilted
 * cards move without being stretched). The wrapper animates; the card inside keeps its tilt and hover.
 */
function Column({ items, shown, className }: { items: Project[]; shown: Project[]; className: string }) {
  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="popLayout">
        {items.map((p) => (
          <motion.div
            key={p.slug}
            layout="position"
            data-reveal="move"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, ease: EASE, layout: { duration: 0.6, ease: EASE } }}
          >
            <Card p={p} i={shown.indexOf(p)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Work board: filter chips (`filter`) re-flow the two staggered, tilted columns. */
export function WorkGrid() {
  const [filter, setFilter] = useState<string>("All");
  const shown = PROJECTS.filter((p) => filter === "All" || p.category === filter);
  const left = shown.filter((_, i) => i % 2 === 0);
  const right = shown.filter((_, i) => i % 2 === 1);
  return (
    <>
      <Reveal as="section" onMount delay={0.45} aria-label="Filter by format" className={`flex flex-col gap-[20px] pb-[56px] lg:pb-[72px] ${PX}`}>
        <ChipGroup label="Filter by format" options={FILTERS} value={filter} onChange={setFilter} size="lg" />
        {/* No visible count; screen readers still hear how many films the filter shows. */}
        <span className="sr-only" aria-live="polite">
          {shown.length} {shown.length === 1 ? "film" : "films"}
        </span>
      </Reveal>
      <section className={`grid grid-cols-1 items-start gap-y-[56px] pb-[96px] md:grid-cols-2 md:gap-x-[32px] lg:gap-x-[48px] lg:pb-[160px] ${PX}`}>
        <Column items={left} shown={shown} className="flex flex-col gap-[56px] lg:gap-[72px]" />
        <Column items={right} shown={shown} className="flex flex-col gap-[56px] md:pt-[100px] lg:gap-[72px] lg:pt-[140px]" />
      </section>
    </>
  );
}
