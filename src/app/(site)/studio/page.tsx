import type { Metadata } from "next";
import { Mark } from "@/components/site/Logo";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { ScrollIn } from "@/components/motion/ScrollIn";
import { YourTurnCta } from "@/components/site/blocks";
import s from "@/components/site/site.module.css";
import { AccentWord, H1, H2, Intro, Kicker, Label, MX, PX } from "@/components/site/ui";
import { BELIEFS, PROCESS, SERVICES, TIMELINE } from "@/content/studio";
import { SET_REEL } from "@/content/bts";
import { SetReel } from "@/components/site/SetReel";
import { BackgroundLoop } from "@/components/site/BackgroundLoop";
import type { CSSProperties } from "react";
import { ClientScatter } from "@/app/_components/ClientScatter";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "A film production house built on six years of advertising filmmaking — now a studio for commercial, narrative and digital stories.",
  alternates: { canonical: "/studio" },
};

const SECTION = `pb-[96px] lg:pb-[180px] ${PX}`;

/**
 * The silent loops behind the hero (no sound, end credits trimmed off). Wide screens: the landscape BTS cut
 * from the Monte Carlo / Rock.it shoot (first 42.5s). Phones: the vertical BTS cut from the Zykaz shoot
 * (first 41.9s), made for a phone's shape.
 */
const STUDIO_LOOP = {
  wide: { webm: "/studio/studio-bts-loop.webm", mp4: "/studio/studio-bts-loop.mp4", poster: "/studio/studio-bts-poster.webp" },
  tall: { webm: "/studio/studio-bts-loop-mobile.webm", mp4: "/studio/studio-bts-loop-mobile.mp4", poster: "/studio/studio-bts-poster-mobile.webp" },
};
/** Light text over the darkened video, whatever the theme. */
const HERO_ON_VIDEO = {
  "--ink": "#ffffff",
  "--ink-2": "#e8e8e4",
  "--muted": "#cfcfcb",
  "--muted-2": "#cfcfcb",
  "--accent-text": "#6f83ff",
  color: "#ffffff",
} as CSSProperties;


const TONE = {
  surface: { card: "bg-[var(--surface)]", label: "text-[var(--muted-2)]" },
  inverse: { card: "bg-[var(--inv-bg)] text-[var(--inv-ink)]", label: "text-[var(--inv-muted)]" },
  accent: { card: "bg-[var(--accent)] text-[var(--on-accent)]", label: "" },
} as const;

/** design/boards/Studio.dc.html */
export default function StudioPage() {
  return (
    <>
      {/* The hero plays over a silent behind-the-scenes loop (landscape on wide screens, vertical on phones),
          darkened so the words stay readable; the text inside takes light colours in both themes. */}
      <section
        aria-label="The studio"
        className={`relative isolate mt-[8px] mb-[72px] flex min-h-[560px] flex-col justify-end overflow-hidden rounded-[24px] bg-[#0a0a0a] lg:mb-[140px] lg:min-h-[680px] lg:rounded-[32px] ${MX}`}
        style={HERO_ON_VIDEO}
      >
        <BackgroundLoop wide={STUDIO_LOOP.wide} tall={STUDIO_LOOP.tall} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,10,10,0.45)_0%,rgba(10,10,10,0.62)_45%,rgba(10,10,10,0.86)_100%)]" />
      <Reveal
        onMount
        stagger={0.12}
        delay={0.1}
        className="flex flex-col gap-[24px] px-5 pt-[96px] pb-[40px] md:px-10 lg:gap-[32px] lg:px-[48px] lg:pt-[140px] lg:pb-[64px]"
      >
        <RevealItem>
          <Kicker>Chapter 02 — The studio</Kicker>
        </RevealItem>
        {/* Two lines from tablet up, one sentence each. "Advertising taught us precision." is 17.7em wide,
            so the size tracks the text width inside the video card (1152px at 1440 → 63px) instead of the board's 88px. */}
        <RevealItem from={{ y: 60, blur: 8 }} duration={1.1}>
        <H1
          balance={false}
          className="md:text-[min(68px,calc((100vw-160px)/18.2))] lg:text-[min(68px,calc((100vw-288px)/18.2))]"
        >
          <span className="md:whitespace-nowrap">Advertising taught us precision.</span>
          <br />
          <span className="md:whitespace-nowrap">
            Cinema gave us the{" "}
            <AccentWord size="text-[clamp(44px,6.667vw,96px)] md:text-[1.09em]">appetite</AccentWord>.
          </span>
        </H1>
        </RevealItem>
        <RevealItem>
          <Intro className="max-w-[760px]">
            A film production house built on six years of advertising filmmaking — now a studio for commercial,
            narrative and digital stories.
          </Intro>
        </RevealItem>
      </Reveal>
      </section>

      <section className={`grid grid-cols-1 gap-y-[24px] lg:grid-cols-12 lg:gap-x-[32px] ${SECTION}`}>
        <Reveal className="lg:col-span-3">
          <Label>The story so far</Label>
        </Reveal>
        <Reveal stagger={0.14} className="flex flex-col gap-[24px] lg:col-span-8 lg:col-start-5 lg:gap-[28px]">
          <RevealItem as="p" className="m-0 text-[26px] leading-[1.2] font-extrabold tracking-[-0.02em] text-pretty md:text-[32px] lg:text-[38px]">
            Freaky Mack Studios is built on six years of advertising filmmaking at Freaky Mack — now a larger creative
            studio focused on storytelling across commercial, narrative and digital formats.
          </RevealItem>
          <RevealItem as="p" className="m-0 text-[18px] leading-[1.65] text-[var(--ink-2)] lg:text-[20px]">
            We’ve made films for McDonald’s, Google, Adidas Originals, Mercedes-Benz, Fila, PC Jewellers, Times of India
            and many more — bringing strong visual storytelling, production discipline and a filmmaker-led creative
            approach.
          </RevealItem>
          <RevealItem as="p" className="m-0 text-[18px] leading-[1.65] text-[var(--ink-2)] lg:text-[20px]">
            Today we develop and produce commercial and fashion films, music videos, documentaries, digital series and
            original narratives. We combine the precision of advertising filmmaking with the creative ambition of
            independent cinema — building a slate of our own work alongside films for brands and cultural platforms.
          </RevealItem>
        </Reveal>
      </section>

      {/* More from set: the crew at the camera, drifting left to right across the full width. */}
      <section aria-label="More from set" className="flex flex-col gap-[24px] pb-[120px] lg:gap-[40px] lg:pb-[200px]">
        <Reveal className={PX}>
          <Label>More from set</Label>
        </Reveal>
        <Reveal from={{ y: 50 }} amount={0.2}>
          <SetReel stills={SET_REEL} label="Photos from set" />
        </Reveal>
      </section>

      <section aria-label="Timeline" className={`flex flex-col gap-[40px] lg:gap-[56px] ${SECTION}`}>
        <Reveal className="flex flex-col gap-[16px]">
          <Label>Told in chapters</Label>
          <h2 className={H2}>From agency to studio.</h2>
        </Reveal>
        {/* The chapters rise one after another, like a staircase; each card keeps its tilt inside the animated item. */}
        <Reveal as="ol" stagger={0.12} amount={0.2} className="m-0 grid list-none grid-cols-1 items-end gap-[24px] p-0 md:grid-cols-2 xl:grid-cols-4">
          {TIMELINE.map((t) => (
            <RevealItem as="li" key={t.label} from={{ y: 90 }} className="flex flex-col">
            <div
              className={`${s.card} ${TONE[t.tone].card} flex min-h-[220px] flex-col justify-between gap-[40px] rounded-[24px] p-[28px] xl:h-[var(--h)] xl:min-h-0`}
              style={{ transform: `rotate(${t.tilt}deg)`, ["--h" as string]: `${t.h}px` }}
            >
              <span className={`${s.it} text-[20px] ${TONE[t.tone].label}`}>{t.label}</span>
              <span className="text-[20px] leading-[1.35] font-semibold">{t.text}</span>
            </div>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      <ScrollIn scale={0.9} y={0} endAt="start 35%">
      <section
        aria-label="What we believe"
        className={`relative mb-[96px] flex flex-col gap-[40px] overflow-hidden rounded-[28px] bg-[var(--inv-bg)] px-[28px] py-[56px] text-[var(--inv-ink)] lg:mb-[180px] lg:gap-[64px] lg:rounded-[40px] lg:p-[96px] ${MX}`}
      >
        <Mark className="pointer-events-none absolute top-[-40px] right-[-60px] h-[200px] w-[300px] opacity-10 [transform:rotate(12deg)] lg:h-[305px] lg:w-[460px]" />
        <Reveal className="relative">
          <Label color="text-[var(--inv-muted)]">What we believe</Label>
        </Reveal>
        <Reveal stagger={0.14} delay={0.1} className="relative grid grid-cols-1 gap-[40px] md:grid-cols-3 lg:gap-[48px]">
          {BELIEFS.map((b) => (
            <RevealItem key={b.no} from={{ y: 50 }} className="flex flex-col gap-[16px]">
              <span className={`${s.it} text-[20px] text-[var(--inv-muted)]`}>{b.no}</span>
              <span className="text-[36px] font-extrabold tracking-[-0.03em] lg:text-[44px]">{b.title}</span>
              <span className="text-[17px] leading-[1.6] text-[var(--inv-soft)]">{b.text}</span>
            </RevealItem>
          ))}
        </Reveal>
      </section>
      </ScrollIn>

      <section aria-label="What we make" className={`flex flex-col gap-[40px] lg:gap-[56px] ${SECTION}`}>
        <Reveal className="flex flex-col gap-[16px]">
          <Label>What we make</Label>
          <h2 className={H2}>Eight ways a brief becomes a film.</h2>
        </Reveal>
        {/* Heading on top, the eight services below in two even columns (01–04, then 05–08). */}
        <Reveal
          as="ol"
          stagger={0.06}
          amount={0.15}
          className="m-0 grid list-none grid-cols-1 gap-x-[32px] border-t border-[var(--ink)] p-0 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-4 lg:gap-x-[48px]"
        >
          {SERVICES.map((sv, i) => (
            <RevealItem
              as="li"
              from={{ y: 40 }}
              duration={0.7}
              key={sv.name}
              className={`${s.row} grid grid-cols-[36px_1fr] items-baseline gap-x-[12px] gap-y-[6px] border-b border-[var(--line)] py-[20px] md:grid-cols-[48px_1fr_1.3fr] md:gap-[16px] lg:grid-cols-[48px_1fr] lg:gap-y-[6px] lg:py-[24px]`}
            >
              <span className={`${s.it} text-[18px] text-[var(--muted-2)]`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[21px] font-semibold lg:text-[24px]">{sv.name}</span>
              <span className="col-start-2 text-[15px] text-[var(--muted)] md:col-start-auto lg:col-start-2">{sv.text}</span>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      <section aria-label="How we work" className={`flex flex-col gap-[40px] lg:gap-[56px] ${SECTION}`}>
        <Reveal className="flex flex-col gap-[16px]">
          <Label>How we work</Label>
          <h2 className={H2}>One team, brief to final cut.</h2>
        </Reveal>
        <Reveal as="ol" stagger={0.14} amount={0.2} className="m-0 grid list-none grid-cols-1 items-start gap-[24px] p-0 md:grid-cols-3 lg:gap-[32px]">
          {PROCESS.map((p) => (
            <RevealItem as="li" key={p.no} from={{ y: 80 }} className={p.lift ? "md:mt-[40px]" : ""}>
            <div
              className={`${s.card} flex flex-col gap-[20px] rounded-[28px] border border-[var(--ink)] p-[28px] lg:p-[36px]`}
              style={{ transform: `rotate(${p.tilt}deg)` }}
            >
              <span className="text-[48px] font-extrabold tracking-[-0.04em] text-[var(--accent-text)] lg:text-[56px]">{p.no}</span>
              <span className="text-[22px] font-bold lg:text-[24px]">{p.title}</span>
              <span className="text-[16px] leading-[1.6] text-[var(--ink-2)]">{p.text}</span>
            </div>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      <ClientScatter label="Films made for" className={SECTION} />

      <YourTurnCta />
    </>
  );
}
