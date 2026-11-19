import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import s from "@/components/site/site.module.css";
import { AccentWord, H1, Intro, Kicker, MX, PX } from "@/components/site/ui";
import { WorkGrid } from "./_components/WorkGrid";

export const metadata: Metadata = {
  title: "Work",
  description: "Ad films, music videos, fashion films, documentaries and the stories we tell for ourselves.",
  alternates: { canonical: "/work" },
};

/** design/boards/Work.dc.html */
export default function WorkPage() {
  return (
    <>
      <section className={`relative pt-[64px] pb-[48px] lg:pt-[120px] lg:pb-[72px] ${PX}`}>
        <Reveal onMount stagger={0.12} delay={0.1} className="flex flex-col gap-[24px] lg:gap-[32px]">
          <RevealItem>
            <Kicker>Chapter 01 — The work</Kicker>
          </RevealItem>
          <RevealItem from={{ y: 60, blur: 8 }} duration={1.1}>
            <H1 className="max-w-[1000px]">
              Six years of saying <AccentWord>yes</AccentWord> to brands.
            </H1>
          </RevealItem>
          <RevealItem>
            <Intro>
              Ad films, music videos, fashion films, documentaries and the stories we tell for ourselves. Pick a format,
              open a film.
            </Intro>
          </RevealItem>
        </Reveal>
      </section>

      <WorkGrid />

      <Reveal
        as="section"
        from={{ y: 60 }}
        className={`mb-[96px] flex flex-col items-start justify-between gap-[28px] rounded-[28px] panel-invert px-[28px] py-[40px] md:flex-row md:items-center lg:mb-[140px] lg:gap-[48px] lg:rounded-[40px] lg:px-[80px] lg:py-[72px] ${MX}`}
      >
        <div className="flex flex-col gap-[14px]">
          <span className={`${s.it} text-[20px] text-[var(--muted-2)] lg:text-[24px]`}>Don’t see your format?</span>
          <span className="text-[30px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[40px] lg:text-[48px]">
            If it can be filmed, we’ll film it.
          </span>
        </div>
        <Link
          href="/start-a-project"
          className={`${s.pill} flex h-[56px] shrink-0 items-center rounded-full bg-[var(--accent)] px-[30px] text-[15px] font-semibold text-[var(--on-accent)] lg:h-[60px]`}
        >
          Start a project
        </Link>
      </Reveal>
    </>
  );
}
