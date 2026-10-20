import type { Metadata } from "next";
import Image from "next/image";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import s from "@/components/site/site.module.css";
import { AccentWord, H1, Intro, Kicker, PX } from "@/components/site/ui";
import { LISTED, displayUrl, type Company } from "@/content/companies";

// Luxury lettering for the House of Luxora card only.
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600"], variable: "--fm-cinzel" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400"], style: ["italic"], variable: "--fm-cormorant" });

export const metadata: Metadata = {
  title: "Sister companies",
  description: `The companies in the Freaky Mack family: ${LISTED.map((c) => c.name).join(" and ")}.`,
  alternates: { canonical: "/sister-companies" },
};

const TILT = [-1.2, 1.2];
const GOLD = "linear-gradient(180deg,#f7e7b4 0%,#d9b45a 45%,#a8802c 75%,#e9cf86 100%)";

/** "Live" (a green dot) or "Coming soon". */
function Status({ status }: { status: Company["status"] }) {
  return status === "live" ? (
    <span className="inline-flex items-center gap-[8px] rounded-full border border-[var(--line-2)] px-[14px] py-[6px] text-[13px] font-semibold">
      <span aria-hidden="true" className="h-[8px] w-[8px] rounded-full bg-[#1fae5b] shadow-[0_0_0_4px_rgba(31,174,91,0.18)]" />
      Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-[8px] rounded-full bg-[var(--accent)] px-[14px] py-[6px] text-[13px] font-semibold text-[var(--on-accent)]">
      Coming soon
    </span>
  );
}

/** A live site: its homepage screenshot in a browser frame, or until there is one, its name set in the frame. */
function SiteThumb({ c }: { c: Company }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[22px] border border-[var(--line-2)] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
      <div aria-hidden="true" className="flex h-[34px] shrink-0 items-center gap-[6px] border-b border-[#e4e4e0] bg-[#f4f4f1] px-[14px]">
        <span className="h-[9px] w-[9px] rounded-full bg-[#ff5f57]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#febc2e]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#28c840]" />
        <span className="ml-[10px] truncate rounded-full bg-white px-[12px] py-[2px] text-[11px] text-[#5c5c5c]">{c.url && displayUrl(c.url)}</span>
      </div>
      {/* The page area is 16:10, the shape of the screenshot (1440×900), so none of it is cropped. */}
      <div className="relative aspect-[16/10]">
        {c.shot ? (
          <Image src={c.shot.src} alt={`${c.name}'s website: its homepage`} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover object-top" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-[10px] px-[24px] text-center text-[#0a0a0a]">
            <span className="text-[clamp(26px,3.4vw,44px)] leading-[1] font-extrabold tracking-[-0.03em] uppercase">{c.name}</span>
            <span className="text-[13px] tracking-[0.18em] text-[#5c5c5c] uppercase">{c.url && displayUrl(c.url)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/** House of Luxora, still being built: black and gold, set in luxury capitals and italics. */
function LuxoraThumb() {
  return (
    <div
      className={`${cinzel.variable} ${cormorant.variable} relative flex aspect-[16/10] flex-col items-center justify-center overflow-hidden rounded-[22px] bg-[#0b0a08] px-[24px] text-center shadow-[0_24px_60px_rgba(0,0,0,0.3)]`}
      style={{ backgroundImage: "radial-gradient(ellipse at 50% 40%, rgba(217,180,90,0.22), transparent 62%)" }}
    >
      {/* A fine double gold frame, inset from the edge. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-[14px] rounded-[14px] border border-[#d9b45a]/45" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-[20px] rounded-[10px] border border-[#d9b45a]/20" />
      <span aria-hidden="true" className="mb-[14px] h-[10px] w-[10px] rotate-45 border border-[#d9b45a]" />
      <span className="text-[clamp(11px,1vw,14px)] tracking-[0.5em] text-[#d9b45a] uppercase [font-family:var(--fm-cinzel)]">House of</span>
      <span
        className="bg-clip-text pb-[6px] text-[clamp(52px,6.4vw,92px)] leading-[1.05] font-light text-transparent italic [font-family:var(--fm-cormorant)]"
        style={{ backgroundImage: GOLD }}
      >
        Luxora
      </span>
      <span aria-hidden="true" className="my-[12px] h-px w-[120px] bg-[linear-gradient(90deg,transparent,#d9b45a,transparent)]" />
      <span className="text-[clamp(10px,0.9vw,12px)] tracking-[0.42em] text-[#e9dcb8] uppercase [font-family:var(--fm-cinzel)]">
        Website under construction
      </span>
    </div>
  );
}

function CompanyCard({ c, i }: { c: Company; i: number }) {
  const body = (
    <>
      {c.key === "luxora" ? <LuxoraThumb /> : <SiteThumb c={c} />}
      <div className="flex flex-wrap items-center justify-between gap-[12px] px-[6px]">
        <div className="flex flex-col gap-[4px]">
          <span className="text-[24px] font-semibold tracking-[-0.02em] lg:text-[30px]">{c.name}</span>
          {c.what && <span className="text-[15px] text-[var(--muted)]">{c.what}</span>}
        </div>
        <Status status={c.status} />
      </div>
      <span className="px-[6px] text-[15px] font-medium">
        {c.status === "live" && c.url ? (
          <span className="border-b border-[var(--ink)] pb-[3px]">Visit {displayUrl(c.url)} ↗</span>
        ) : (
          <span className="text-[var(--muted)]">Website coming soon</span>
        )}
      </span>
    </>
  );
  const tilt = { transform: `rotate(${TILT[i % TILT.length]}deg)` };
  return c.status === "live" && c.url ? (
    <a href={c.url} target="_blank" rel="noopener noreferrer" className={`${s.card} flex flex-col gap-[20px]`} style={tilt} aria-label={`${c.name} — visit the website (opens in a new tab)`}>
      {body}
    </a>
  ) : (
    <div className="flex flex-col gap-[20px]" style={tilt}>
      {body}
    </div>
  );
}

/** Sister companies: the companies in the Freaky Mack family, live or on their way. */
export default function SisterCompaniesPage() {
  return (
    <>
      <Reveal onMount stagger={0.12} delay={0.1} as="section" className={`flex flex-col gap-[24px] pt-[64px] pb-[56px] lg:gap-[32px] lg:pt-[120px] lg:pb-[96px] ${PX}`}>
        <RevealItem>
          <Kicker>Chapter 05 — Sister companies</Kicker>
        </RevealItem>
        <RevealItem from={{ y: 60, blur: 8 }} duration={1.1}>
          <H1 className="max-w-[1000px]">
            The Freaky Mack <AccentWord>family</AccentWord>.
          </H1>
        </RevealItem>
        <RevealItem>
          <Intro className="max-w-[640px]">Our sister companies, from the same family as Freaky Mack Studios.</Intro>
        </RevealItem>
      </Reveal>
      <Reveal
        as="section"
        stagger={0.14}
        amount={0.15}
        aria-label="Our sister companies"
        className={`grid grid-cols-1 items-start gap-[56px] pb-[120px] md:grid-cols-2 md:gap-[32px] lg:gap-[48px] lg:pb-[180px] ${PX}`}
      >
        {LISTED.map((c, i) => (
          // A company on its own (or an odd one out) sits centred across both columns.
          <RevealItem
            key={c.key}
            from={{ y: 70 }}
            className={i % 2 ? "md:mt-[64px]" : i === LISTED.length - 1 ? "md:col-span-2 md:mx-auto md:w-full md:max-w-[760px]" : ""}
          >
            <CompanyCard c={c} i={i} />
          </RevealItem>
        ))}
      </Reveal>
    </>
  );
}
