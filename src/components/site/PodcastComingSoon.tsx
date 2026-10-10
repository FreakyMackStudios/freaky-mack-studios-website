import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { CONTACT } from "@/shared/config";
import { pillAccent } from "./blocks";
import c from "./coming-soon.module.css";
import { AccentWord } from "./ui";

/** Tilted accent sticker with a pulsing "live" dot. */
export function OnAirSticker({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-[10px] rounded-full bg-[var(--accent)] px-[16px] py-[8px] text-[14px] font-semibold text-[var(--on-accent)] [transform:rotate(-4deg)] ${className}`}
    >
      <span aria-hidden="true" className={c.dot} />
      On air soon
    </span>
  );
}

const EXPECT = [
  "Conversations with the filmmakers, creators and brands we work with",
  "The stories behind the films we make",
  "New episodes on YouTube",
];

const PITCH = `mailto:${CONTACT.email}?subject=${encodeURIComponent("The Freaky Mack Podcast")}`;

/**
 * The podcast before launch: no episode art or embeds yet, so it is type only. Used on the homepage
 * (Chapter 04) and on /originals (with the "What to expect" list).
 */
export function PodcastComingSoon({ expect = false, heading: Heading = "h3" }: { expect?: boolean; heading?: "h2" | "h3" }) {
  return (
    <div className="grid grid-cols-1 items-end gap-y-[36px] border-t border-[var(--ink)] pt-[40px] lg:grid-cols-12 lg:gap-x-[32px] lg:pt-[56px]">
      <Reveal from={{ y: 60, blur: 6 }} duration={1.1} className="flex flex-col items-start gap-[28px] lg:col-span-7">
        <OnAirSticker />
        <Heading className="m-0 text-[clamp(56px,9.5vw,144px)] leading-[0.92] font-extrabold tracking-[-0.04em] uppercase">
          Coming <AccentWord size="text-[clamp(60px,10.2vw,154px)]" className="normal-case">soon.</AccentWord>
        </Heading>
      </Reveal>
      <Reveal stagger={0.1} delay={0.15} className="flex flex-col items-start gap-[24px] lg:col-span-5">
        <RevealItem as="p" className="m-0 text-[18px] leading-[1.6] text-[var(--ink-2)] lg:text-[20px]">
          A podcast from Freaky Mack Studios: conversations with the people behind the films. We’re getting it ready.
        </RevealItem>
        {expect && (
          <RevealItem as="ul" className="m-0 flex w-full list-none flex-col border-t border-[var(--line)] p-0">
            {EXPECT.map((line, i) => (
              <li key={line} className="flex items-baseline gap-[16px] border-b border-[var(--line)] py-[14px] text-[16px] lg:text-[17px]">
                <span className="w-[24px] shrink-0 text-[13px] text-[var(--muted)]">{String(i + 1).padStart(2, "0")}</span>
                {line}
              </li>
            ))}
          </RevealItem>
        )}
        <RevealItem className="flex">
          <a href={PITCH} className={pillAccent("h-[52px] px-[24px] text-[14px] lg:h-[56px] lg:text-[15px]")}>
            Want to be on it? Say hello →
          </a>
        </RevealItem>
      </Reveal>
    </div>
  );
}
