import Link from "next/link";
import { BTN_ACCENT, BTN_OUTLINE } from "@/components/site/buttons";
import { DraggableMark } from "@/components/motion/DraggableMark";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import s from "@/components/site/site.module.css";
import { AccentWord, H1, Intro, Kicker, PX } from "@/components/site/ui";

/** What /originals shows while the full page is under construction (src/shared/config.ts: ORIGINALS_LIVE). */
export function ComingSoon() {
  return (
    <Reveal
      as="section"
      onMount
      stagger={0.12}
      delay={0.25}
      className={`relative flex min-h-[70vh] flex-col items-center justify-center gap-[24px] overflow-hidden pt-[96px] pb-[96px] text-center lg:gap-[32px] lg:pt-[140px] lg:pb-[160px] ${PX}`}
    >
      {/* A ghost "03" (the Originals chapter) settles in behind the text. */}
      <RevealItem
        as="span"
        from={{ scale: 0.7, y: 0 }}
        duration={1.4}
        aria-hidden="true"
        className="pointer-events-none absolute top-[40px] left-1/2 -translate-x-1/2 text-[clamp(180px,29.167vw,420px)] leading-none font-extrabold tracking-[-0.06em] text-[var(--ghost)] select-none"
      >
        03
      </RevealItem>
      <DraggableMark className="relative h-[84px] w-[126px] lg:h-[120px] lg:w-[180px]" imgClassName={s.blob} />
      <RevealItem className="relative">
        <Kicker>Chapter 03 — Originals</Kicker>
      </RevealItem>
      <RevealItem from={{ y: 60, blur: 8 }} duration={1.1} className="relative flex flex-col items-center gap-[20px]">
        <span className="rounded-full bg-[var(--accent)] px-[18px] py-[7px] text-[14px] font-semibold text-[var(--on-accent)] [transform:rotate(-3deg)]">
          In the edit
        </span>
        <H1 big className="max-w-[1000px]">
          Coming <AccentWord big>soon</AccentWord>.
        </H1>
      </RevealItem>
      <RevealItem className="relative">
        <Intro className="max-w-[600px]">
          Our own short films, web series, documentaries and The Freaky Mack Podcast are on their way. Check back soon.
        </Intro>
      </RevealItem>
      <RevealItem className="relative mt-[8px] flex flex-wrap justify-center gap-[12px] sm:gap-[16px]">
        <Link href="/work" className={BTN_ACCENT}>See the work</Link>
        <Link href="/start-a-project" className={BTN_OUTLINE}>Start a project</Link>
      </RevealItem>
    </Reveal>
  );
}
