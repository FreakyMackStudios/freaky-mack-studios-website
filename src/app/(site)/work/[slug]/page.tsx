import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { ScrollIn } from "@/components/motion/ScrollIn";
import s from "@/components/site/site.module.css";
import { Label, MX, PX } from "@/components/site/ui";
import { PROJECTS, getProject, nextProject, projectHref, projectNumber, whoAndYear } from "@/content/projects";
import { Still, isTall } from "@/components/site/Still";
import { FilmPlayer } from "./FilmPlayer";

export const dynamicParams = false;

/**
 * Landscape frames as a balanced collage: a pair, then one full width, then a pair… Never a lone half-width
 * frame: one left over at a pair's turn goes full width, and two left at a full-width turn stay a pair.
 */
function collageRows<T>(frames: T[]): T[][] {
  const rows: T[][] = [];
  let pair = true;
  for (let i = 0; i < frames.length; ) {
    const left = frames.length - i;
    const two = pair ? left >= 2 : left === 2;
    rows.push(frames.slice(i, i + (two ? 2 : 1)));
    i += two ? 2 : 1;
    pair = !pair;
  }
  return rows;
}

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: `${p.title} · ${p.category}`,
    description: [p.who ? `${p.category} for ${p.who}.` : `${p.category}.`, p.logline].filter(Boolean).join(" "),
    alternates: { canonical: projectHref(p.slug) },
  };
}

/** design/boards/Project.dc.html — the case-study template, driven by src/content/projects.ts. */
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const next = nextProject(p.slug);
  // The first still is the film's poster; with more than three, the frames below start from the second.
  // A YouTube thumbnail cover isn't one of our frames, so a film with only that has no frames section.
  const own = p.stills.filter((st) => !st.fallback);
  const frames = own.length > 3 ? own.slice(1) : own;
  const tall = frames.length > 0 && isTall(frames[0]);
  const story = [
    { label: "The brief", text: p.brief, lead: true },
    { label: "The idea", text: p.idea, lead: false },
    { label: "On screen", text: p.onScreen, lead: false },
  ].filter((x): x is { label: string; text: string; lead: boolean } => !!x.text);

  return (
    <>
      <Reveal onMount from={{ y: -12 }} duration={0.7} className={`flex items-center justify-between gap-4 pt-[28px] text-[14px] lg:pt-[40px] ${PX}`}>
        <Link href="/work" className={`${s.link} font-semibold`}>
          ← All work
        </Link>
        <span className={`${s.it} text-[16px] text-[var(--muted-2)] lg:text-[18px]`}>
          Film {String(projectNumber(p.slug)).padStart(2, "0")} of {PROJECTS.length}
        </span>
      </Reveal>

      <Reveal
        as="section"
        onMount
        stagger={0.12}
        delay={0.15}
        className={`flex flex-col gap-[24px] pt-[48px] pb-[48px] lg:gap-[28px] lg:pt-[80px] lg:pb-[64px] ${PX}`}
      >
        <RevealItem className="flex flex-wrap items-center gap-[14px]">
          <span className="rounded-full bg-[var(--accent)] px-[18px] py-[8px] text-[14px] font-semibold text-[var(--on-accent)] [transform:rotate(-3deg)]">
            {p.category}
          </span>
          {whoAndYear(p) && (
            <span className={`${s.it} text-[17px] tracking-[0.08em] text-[var(--muted-2)] uppercase lg:text-[22px]`}>
              {whoAndYear(p)}
            </span>
          )}
        </RevealItem>
        <RevealItem from={{ y: 60, blur: 8 }} duration={1.1}>
        <h1 className="m-0 max-w-[1150px] text-[clamp(44px,6.667vw,96px)] leading-[0.98] font-extrabold tracking-[-0.03em] text-balance uppercase">
          {p.title}
        </h1>
        </RevealItem>
        {p.logline && (
          <RevealItem as="p" className="m-0 max-w-[720px] text-[18px] leading-[1.5] text-[var(--ink-2)] lg:text-[22px]">
            {p.logline}
          </RevealItem>
        )}
      </Reveal>

      <section aria-label="Film" className={`pb-[96px] lg:pb-[140px] ${PX}`}>
        {/* The player grows and straightens into place as it scrolls in. */}
        <ScrollIn scale={0.88} rotate={-2} y={70}>
          <FilmPlayer videoUrl={p.videoUrl} duration={p.duration} poster={p.stills[0]} title={p.title} />
        </ScrollIn>
      </section>

      {/* Credits and story, as far as the studio has given them; a film with neither skips this section. */}
      {(p.credits.length > 0 || story.length > 0) && (
      <section className={`grid grid-cols-1 gap-y-[56px] pb-[96px] lg:grid-cols-12 lg:gap-x-[32px] lg:pb-[160px] ${PX}`}>
        {p.credits.length > 0 && (
        <Reveal stagger={0.05} amount={0.15} className={`flex flex-col gap-[20px] ${story.length ? "lg:col-span-4" : "lg:col-span-6"}`}>
          <RevealItem>
            <Label>Credits</Label>
          </RevealItem>
          <dl className="m-0 flex flex-col border-t border-[var(--ink)]">
            {p.credits.map((c) => (
              <RevealItem key={c.role} from={{ y: 16 }} duration={0.6} className="flex justify-between gap-[16px] border-b border-[var(--line)] py-[16px] text-[15px]">
                <dt className="text-[var(--muted)]">{c.role}</dt>
                <dd className="m-0 text-right font-semibold">{c.who}</dd>
              </RevealItem>
            ))}
          </dl>
        </Reveal>
        )}
        {/* Only the parts of the story the studio has given; a film with none keeps just its credits. */}
        {story.length > 0 && (
          <Reveal stagger={0.15} amount={0.2} className="flex flex-col gap-[40px] lg:col-span-7 lg:col-start-6 lg:gap-[56px]">
            {story.map(({ label, text, lead }) => (
              <RevealItem key={label} className="flex flex-col gap-[16px]">
                <Label>{label}</Label>
                <p
                  className={`m-0 ${lead ? "text-[21px] leading-[1.45] font-medium tracking-[-0.01em] lg:text-[26px]" : "text-[17px] leading-[1.6] text-[var(--ink-2)] lg:text-[20px]"}`}
                >
                  {text}
                </p>
              </RevealItem>
            ))}
          </Reveal>
        )}
      </section>
      )}

      {frames.length > 0 && (
        <section aria-label="Stills" className={`flex flex-col gap-[32px] pb-[96px] lg:gap-[48px] lg:pb-[160px] ${PX}`}>
          <Reveal>
            <Label>Frames from the film</Label>
          </Reveal>
          {tall ? (
            // Vertical films: 9:16 frames in rows of three (two on phones); a short last row is centred.
            <Reveal stagger={0.08} amount={0.1} className="flex flex-wrap justify-center gap-[16px] lg:gap-[32px]">
              {frames.map((f, i) => (
                <RevealItem key={f.src} from={{ y: 50 }} className="w-[calc((100%-16px)/2)] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-64px)/3)]">
                  <Still
                    still={f}
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className={`${s.still} rounded-[20px]`}
                    style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
                  />
                </RevealItem>
              ))}
            </Reveal>
          ) : (
            // Landscape films: a balanced collage of 16:9 frames, a pair side by side, then one full width,
            // and so on. Rows are worked out from the count, so no row is ever left half empty.
            <div className="flex flex-col gap-[16px] md:gap-[32px] lg:gap-[40px]">
              {collageRows(frames).map((row, r) =>
                row.length === 2 ? (
                  <div key={r} className="grid grid-cols-2 gap-[16px] md:gap-[32px] lg:gap-[40px]">
                    <Reveal from={{ x: -70, y: 30 }} duration={1}>
                      <Still still={row[0]} sizes="(min-width: 768px) 50vw, 50vw" className={`${s.still} rounded-[14px] md:rounded-[24px]`} style={{ transform: "rotate(-1deg)" }} />
                    </Reveal>
                    <Reveal from={{ x: 70, y: 30 }} duration={1} delay={0.12}>
                      <Still still={row[1]} sizes="(min-width: 768px) 50vw, 50vw" className={`${s.still} rounded-[14px] md:rounded-[24px]`} style={{ transform: "rotate(1deg)" }} />
                    </Reveal>
                  </div>
                ) : (
                  <ScrollIn key={r} scale={0.92} y={90}>
                    <Still still={row[0]} sizes="100vw" className={`${s.still} rounded-[16px] lg:rounded-[28px]`} style={{ transform: `rotate(${r % 4 === 1 ? 0.6 : -0.6}deg)` }} />
                  </ScrollIn>
                ),
              )}
            </div>
          )}
        </section>
      )}

      <Reveal from={{ y: 60 }}>
      <Link
        href={projectHref(next.slug)}
        className={`${s.next} panel-invert mb-[96px] flex items-center justify-between gap-[24px] rounded-[28px] px-[28px] py-[40px] lg:mb-[140px] lg:gap-[48px] lg:rounded-[40px] lg:px-[80px] lg:py-[72px] ${MX}`}
      >
        <div className="flex flex-col gap-[14px]">
          <span className={`${s.it} text-[20px] text-[var(--muted-2)] lg:text-[24px]`}>Next up · {next.category}</span>
          <span className="text-[32px] leading-[1] font-extrabold tracking-[-0.03em] uppercase md:text-[48px] lg:text-[64px]">
            {next.title}
          </span>
        </div>
        <span
          aria-hidden="true"
          className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[26px] text-[var(--on-accent)] lg:h-[88px] lg:w-[88px] lg:text-[34px]"
        >
          →
        </span>
      </Link>
      </Reveal>
    </>
  );
}
