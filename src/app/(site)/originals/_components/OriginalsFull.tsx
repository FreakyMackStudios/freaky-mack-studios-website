import Link from "next/link";
import { InverseSlab, pillAccent } from "@/components/site/blocks";
import { DraggableMark } from "@/components/motion/DraggableMark";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import s from "@/components/site/site.module.css";
import { AccentWord, H1, H2, Intro, Kicker, Label, PX } from "@/components/site/ui";
import { SLATE } from "@/content/originals";
import { Podcast } from "./Podcast";

/**
 * design/boards/Originals.dc.html — the full Originals page (hero, podcast, slate, pitch slab).
 * Under construction: parked while /originals shows "Coming soon". It comes back when ORIGINALS_LIVE is
 * switched on (src/shared/config.ts).
 */
export function OriginalsFull() {
  return (
    <>
      <section className={`relative pt-[64px] pb-[56px] lg:pt-[120px] lg:pb-[96px] ${PX}`}>
        <DraggableMark className="absolute top-[24px] right-[20px] h-[56px] w-[84px] lg:top-[120px] lg:right-[160px] lg:h-[100px] lg:w-[150px]" imgClassName={s.blob} />
        <Reveal onMount stagger={0.12} delay={0.1} className="flex flex-col gap-[24px] lg:gap-[32px]">
          <RevealItem>
            <Kicker>Chapter 03 — Originals</Kicker>
          </RevealItem>
          <RevealItem from={{ y: 60, blur: 8 }} duration={1.1}>
            <H1 className="max-w-[1000px]">
              Films of our <AccentWord>own</AccentWord>.
            </H1>
          </RevealItem>
          <RevealItem>
            <Intro className="max-w-[680px]">
              Between briefs we make our own — short films, web series, documentaries and a podcast. A home for
              filmmakers, creators and ideas that deserve to become films.
            </Intro>
          </RevealItem>
        </Reveal>
      </section>

      <Podcast />

      <section aria-label="The slate" className={`flex flex-col gap-[40px] pb-[96px] lg:gap-[56px] lg:pb-[180px] ${PX}`}>
        <Reveal className="flex flex-col gap-[16px]">
          <Label>On the slate</Label>
          <h2 className={H2}>What we’re making for ourselves.</h2>
        </Reveal>
        {/* Posters rise one after another; each keeps its tilt inside the animated item. */}
        <Reveal stagger={0.14} amount={0.2} className="grid grid-cols-1 items-start gap-[48px] md:grid-cols-3 md:gap-[24px] lg:gap-[32px]">
          {SLATE.map((p) => (
            <RevealItem key={p.kind} from={{ y: 90 }} className={`flex flex-col ${p.lift ? "md:mt-[56px]" : ""}`}>
            <Link
              href={p.href}
              className={`${s.card} flex flex-col gap-[18px]`}
              style={{ transform: `rotate(${p.tilt}deg)` }}
            >
              <div
                className="relative flex h-[360px] items-center justify-center rounded-[24px] text-[12px] tracking-[0.2em] text-white/80 uppercase lg:h-[420px]"
                style={{ background: p.bg }}
              >
                [ Poster ]
                <span className="absolute top-[18px] left-[18px] rounded-full bg-white px-[14px] py-[6px] text-[13px] font-semibold tracking-normal text-[#0a0a0a] normal-case [transform:rotate(-4deg)]">
                  {p.kind}
                </span>
                <span className="absolute right-[18px] bottom-[18px] rounded-full bg-[var(--accent)] px-[14px] py-[6px] text-[12px] font-semibold tracking-normal text-[var(--on-accent)] normal-case">
                  {p.status}
                </span>
              </div>
              <span className="text-[22px] font-semibold lg:text-[24px]">{p.title}</span>
              <span className="text-[15px] leading-[1.5] text-[var(--muted)]">{p.logline}</span>
            </Link>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      <InverseSlab
        ariaLabel="Pitch us"
        maxWidth="max-w-[800px]"
        label="Filmmaker? Creator? Got an idea?"
        title="Some ideas deserve to become films. Pitch us yours."
        markClassName="right-[-60px] bottom-[-60px] h-[180px] w-[270px] [transform:rotate(-12deg)] lg:right-[260px] lg:bottom-[-80px] lg:h-[279px] lg:w-[420px]"
        action={
          <Link href="/start-a-project" className={pillAccent()}>
            Pitch an idea
          </Link>
        }
      />
    </>
  );
}
