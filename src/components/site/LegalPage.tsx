import type { ReactNode } from "react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import s from "./site.module.css";
import { AccentWord, H1, Kicker, PX } from "./ui";

/** When the Privacy policy and Terms were last changed (shown on both). Update it with every change to either. */
export const LEGAL_UPDATED = "20 October 2026";

/** Privacy / Terms layout (design/boards/Privacy.dc.html, Terms.dc.html): hero, pinned "On this page" nav, legal text. */
export function LegalPage({
  lead,
  accent,
  subtitle,
  toc,
  children,
}: {
  lead: string;
  accent: string;
  subtitle: string;
  toc: [id: string, label: string][];
  children: ReactNode;
}) {
  return (
    <>
      <Reveal
        as="section"
        onMount
        stagger={0.12}
        delay={0.1}
        className={`flex flex-col gap-[20px] pt-[64px] pb-[48px] lg:gap-[24px] lg:pt-[120px] lg:pb-[80px] ${PX}`}
      >
        <RevealItem>
          <Kicker>The fine print</Kicker>
        </RevealItem>
        <RevealItem from={{ y: 60, blur: 8 }} duration={1.1}>
          <H1 balance={false}>
            {lead} <AccentWord className="normal-case">{accent}</AccentWord>
          </H1>
        </RevealItem>
        <RevealItem className="flex flex-col items-start gap-[14px] sm:flex-row sm:items-center">
          <span className="shrink-0 rounded-full border border-[var(--ink)] px-[16px] py-[6px] text-[14px] font-semibold [transform:rotate(-2deg)]">
            Last updated {LEGAL_UPDATED}
          </span>
          <span className="text-[16px] text-[var(--muted)]">{subtitle}</span>
        </RevealItem>
      </Reveal>

      <section className={`grid grid-cols-1 items-start gap-y-[24px] pb-[96px] lg:grid-cols-12 lg:gap-x-[32px] lg:pb-[140px] ${PX}`}>
        {/* The TOC animates itself (a wrapper would stop it sticking); the text rises in beside it. */}
        <Reveal
          as="nav"
          onMount
          delay={0.4}
          from={{ x: -40, y: 0 }}
          aria-label="On this page"
          className="flex flex-col gap-[12px] text-[15px] lg:sticky lg:top-[24px] lg:col-span-3 lg:pt-[36px]"
        >
          <span className={`${s.it} mb-[4px] text-[20px] text-[var(--muted-2)]`}>On this page</span>
          <div className="flex flex-wrap gap-x-[18px] gap-y-[10px] lg:flex-col lg:gap-[12px]">
            {toc.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={`${s.link} self-start`}>
                {label}
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal onMount delay={0.5} from={{ y: 50 }} className={`${s.lg} lg:col-span-8 lg:col-start-5`}>
          {children}
        </Reveal>
      </section>
    </>
  );
}
