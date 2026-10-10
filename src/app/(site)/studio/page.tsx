import type { Metadata } from "next";
import { Mark } from "@/components/site/Logo";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { ScrollIn } from "@/components/motion/ScrollIn";
import { YourTurnCta } from "@/components/site/blocks";
import s from "@/components/site/site.module.css";
import { AccentWord, H1, H2, Intro, Kicker, Label, MX, PX } from "@/components/site/ui";
import { BELIEFS, PROCESS, SERVICES, TIMELINE } from "@/content/studio";
import { ClientScatter } from "@/app/_components/ClientScatter";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "A film production house built on six years of advertising filmmaking — now a studio for commercial, narrative and digital stories.",
  alternates: { canonical: "/studio" },
};

const SECTION = `pb-[96px] lg:pb-[180px] ${PX}`;

const TONE = {
  surface: { card: "bg-[var(--surface)]", label: "text-[var(--muted-2)]" },
  inverse: { card: "bg-[var(--inv-bg)] text-[var(--inv-ink)]", label: "text-[var(--inv-muted)]" },
  accent: { card: "bg-[var(--accent)] text-[var(--on-accent)]", label: "" },
} as const;

/** design/boards/Studio.dc.html */
export default function StudioPage() {
  return (
    <>
      <Reveal
        as="section"
        onMount
        stagger={0.12}
        delay={0.1}
        className={`flex flex-col gap-[24px] pt-[64px] pb-[56px] lg:gap-[32px] lg:pt-[120px] lg:pb-[88px] ${PX}`}
      >
        <RevealItem>
          <Kicker>Chapter 02 — The studio</Kicker>
        </RevealItem>
        {/* Two lines from tablet up, one sentence each. "Advertising taught us precision." is 17.7em wide,
            so the size tracks the column width (1248px at 1440 → 68px) instead of the board's 88px. */}
        <RevealItem from={{ y: 60, blur: 8 }} duration={1.1}>
        <H1
          balance={false}
          className="md:text-[min(68px,calc((100vw-80px)/18.2))] lg:text-[min(68px,calc((100vw-192px)/18.2))]"
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

      <section className={`relative pb-[96px] lg:pb-[160px] ${PX}`}>
        {/* The still straightens and grows into place as it scrolls in; the sticker pops on after it. */}
        <ScrollIn scale={0.9} rotate={-4} y={80}>
        <div
          className="flex h-[320px] items-center justify-center rounded-[24px] px-[24px] text-center text-[12px] tracking-[0.22em] text-white/60 uppercase shadow-[0_30px_80px_rgba(0,0,0,0.14)] [transform:rotate(-1deg)] md:h-[460px] lg:h-[600px] lg:rounded-[32px]"
          style={{ background: "radial-gradient(ellipse at 45% 50%, #4a4a48 0%, #1a1a1a 60%, #0a0a0a 100%)" }}
        >
          [ On set — behind the scenes still ]
        </div>
        </ScrollIn>
        <Reveal
          from={{ scale: 0.3, rotate: 30, y: 0 }}
          delay={0.3}
          amount={0.5}
          className="absolute top-[-18px] right-[36px] lg:top-[-22px] lg:right-[150px]"
        >
          <span
            className={`${s.it} block rounded-full bg-[var(--accent)] px-[18px] py-[6px] text-[18px] text-[var(--on-accent)] [transform:rotate(5deg)] lg:px-[22px] lg:py-[8px] lg:text-[22px]`}
          >
            on set, [Year]
          </span>
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
