import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { BTN_ACCENT, BTN_OUTLINE } from "@/components/site/buttons";
import { DraggableMark } from "@/components/motion/DraggableMark";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import s from "@/components/site/site.module.css";
import { AccentWord, H1, Intro, Kicker, PX } from "@/components/site/ui";
import { Still } from "@/components/site/Still";
import { OUT_OF_FOCUS } from "@/content/bts";

export const metadata: Metadata = {
  title: "Scene missing",
  robots: { index: false },
};

/** design/boards/NotFound.dc.html — rendered for any unknown URL (404.html in the static export). */
export default function NotFound() {
  return (
    <SiteShell>
      <Reveal
        as="section"
        onMount
        stagger={0.12}
        delay={0.25}
        className={`relative flex flex-col items-center gap-[24px] overflow-hidden pt-[96px] pb-[96px] text-center lg:gap-[32px] lg:pt-[140px] lg:pb-[140px] ${PX}`}
      >
        {/* The ghost "404" settles in behind the text. */}
        <RevealItem
          as="span"
          from={{ scale: 0.7, y: 0 }}
          duration={1.4}
          aria-hidden="true"
          className="pointer-events-none absolute top-[40px] left-1/2 -translate-x-1/2 text-[clamp(180px,29.167vw,420px)] leading-none font-extrabold tracking-[-0.06em] text-[var(--ghost)] select-none"
        >
          404
        </RevealItem>
        <DraggableMark className="relative h-[84px] w-[126px] lg:h-[120px] lg:w-[180px]" imgClassName={s.blob} />
        <RevealItem className="relative">
          <Kicker>Error 404 — scene missing</Kicker>
        </RevealItem>
        <RevealItem from={{ y: 60, blur: 8 }} duration={1.1} className="relative">
          <H1 className="max-w-[1000px]">
            <AccentWord>Cut!</AccentWord> This scene didn’t make the edit.
          </H1>
        </RevealItem>
        <RevealItem className="relative">
          <Intro className="max-w-[560px]">
            The page you’re looking for has moved or never existed. Let’s get you back on set.
          </Intro>
        </RevealItem>
        <RevealItem className="relative mt-[8px] flex flex-wrap justify-center gap-[12px] sm:gap-[16px]">
          <Link href="/" className={BTN_ACCENT}>Back to the start</Link>
          <Link href="/work" className={BTN_OUTLINE}>See the work</Link>
        </RevealItem>
        {/* A take that didn't make the edit either: out of focus, marked NG ("no good"). */}
        <RevealItem from={{ y: 60, rotate: 8 }} className="relative mt-[24px] w-full max-w-[560px] lg:mt-[32px]">
          <div className="[transform:rotate(3deg)]">
            <Still still={OUT_OF_FOCUS} sizes="(min-width: 640px) 560px, 90vw" className="rounded-[20px] shadow-[0_24px_60px_rgba(0,0,0,0.25)]" />
          </div>
          <span
            aria-hidden="true"
            className={`${s.it} absolute -top-[14px] -left-[10px] rounded-full bg-[var(--accent)] px-[16px] py-[5px] text-[18px] text-[var(--on-accent)] [transform:rotate(-6deg)] lg:text-[20px]`}
          >
            NG take
          </span>
        </RevealItem>
      </Reveal>
    </SiteShell>
  );
}
