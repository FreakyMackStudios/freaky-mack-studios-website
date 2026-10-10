"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { EASE, Reveal, RevealItem } from "@/components/motion/Reveal";
import { ChipGroup } from "@/components/site/ChipGroup";
import s from "@/components/site/site.module.css";
import { Label, PX } from "@/components/site/ui";
import { Still, isTall } from "@/components/site/Still";
import { FILTERS, PROJECTS, PUBLISHING_SOON, projectHref, whoAndYear, type Project } from "@/content/projects";

const TILTS = [-1.2, 1, -0.6, 1.4];

function Card({ p, i }: { p: Project; i: number }) {
  return (
    <Link
      href={projectHref(p.slug)}
      className={`${s.card} flex flex-col gap-[18px]`}
      style={{ transform: `rotate(${TILTS[i % 4]}deg)` }}
    >
      {/* The cover keeps the film's own shape (16:9, 9:16, 4:3…); vertical films are capped in height. */}
      <Still still={p.stills[0]} maxVh={isTall(p.stills[0]) ? 72 : undefined} sizes="(min-width: 768px) 50vw, 100vw" className="rounded-[24px]">
        <span className="absolute top-[20px] left-[20px] rounded-full bg-[var(--accent)] px-[16px] py-[7px] text-[13px] font-semibold text-[var(--on-accent)] [transform:rotate(-4deg)]">
          {p.category}
        </span>
      </Still>
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
      {PUBLISHING_SOON.length > 0 && <PublishingSoon />}
    </>
  );
}

const SOON_TILT = [-1.5, 1, -0.5, 2, -2, 0.8, -1, 1.6];

/** Films still waiting on their stills or their write-up: listed by name only, not linked. */
function PublishingSoon() {
  return (
    <section aria-label="Publishing soon" className={`flex flex-col gap-[28px] pb-[96px] lg:gap-[36px] lg:pb-[140px] ${PX}`}>
      <Reveal className="flex flex-col gap-[12px]">
        <Label>Publishing soon</Label>
        <p className="m-0 max-w-[640px] text-[17px] leading-[1.6] text-[var(--ink-2)] lg:text-[18px]">
          More of our films are on their way to this page.
        </p>
      </Reveal>
      <Reveal as="ul" stagger={0.04} amount={0.2} className="m-0 flex list-none flex-wrap gap-[12px] p-0 lg:gap-[14px]">
        {PUBLISHING_SOON.map((p, i) => (
          <RevealItem as="li" key={p.slug} from={{ y: 20 }} duration={0.5} className="flex">
            <span
              className="rounded-full border border-dashed border-[var(--ink)] px-[18px] py-[10px] text-[15px] font-medium lg:px-[22px] lg:py-[12px] lg:text-[17px]"
              style={{ transform: `rotate(${SOON_TILT[i % SOON_TILT.length]}deg)` }}
            >
              {p.title}
            </span>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
