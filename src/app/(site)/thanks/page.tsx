import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import s from "@/components/site/site.module.css";
import { Label, PX } from "@/components/site/ui";
import { ThanksHero } from "./ThanksHero";

export const metadata: Metadata = {
  title: "Brief received",
  description: "Thanks for telling us your story. We’ll be in touch at the email you gave us.",
  robots: { index: false },
};

/** design/boards/Thanks.dc.html (the footer switches its sign-off to “Cut. Print. Talk soon.” here). */
export default function ThanksPage() {
  return (
    <>
      <ThanksHero />

      <section aria-label="While you wait" className={`flex flex-col gap-[24px] pb-[96px] lg:gap-[32px] lg:pb-[140px] ${PX}`}>
        <Reveal>
          <Label>While you wait</Label>
        </Reveal>
        <Reveal stagger={0.14} amount={0.3} className="grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:gap-[32px]">
          <RevealItem from={{ y: 60 }} className="flex flex-col">
          <Link
            href="/originals#podcast"
            className={`${s.card} flex items-center justify-between gap-[24px] rounded-[28px] bg-[var(--inv-bg)] p-[28px] text-[var(--inv-ink)] [transform:rotate(-1deg)] lg:p-[40px]`}
          >
            <div className="flex flex-col gap-[10px]">
              <span className={`${s.it} text-[20px] text-[var(--inv-muted)]`}>Coming soon</span>
              <span className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">The Freaky Mack Podcast</span>
            </div>
            <span aria-hidden="true" className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[22px] text-[var(--on-accent)]">
              →
            </span>
          </Link>
          </RevealItem>
          <RevealItem from={{ y: 60 }} className="flex flex-col">
          <Link
            href="/studio"
            className={`${s.card} flex items-center justify-between gap-[24px] rounded-[28px] bg-[var(--surface)] p-[28px] [transform:rotate(1deg)] lg:p-[40px]`}
          >
            <div className="flex flex-col gap-[10px]">
              <span className={`${s.it} text-[20px] text-[var(--muted-2)]`}>Read</span>
              <span className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">The studio story</span>
            </div>
            <span className="text-[32px]" aria-hidden="true">→</span>
          </Link>
          </RevealItem>
        </Reveal>
      </section>
    </>
  );
}
