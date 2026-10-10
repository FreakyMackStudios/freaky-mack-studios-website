"use client";

import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { TESTIMONIALS, type Testimonial } from "@/content/testimonials";
import s from "../home.module.css";
import { CHAPTER, PB, PX } from "@/shared/ui";

/** The two cards: a light one tilted left, and a dark one tilted right and dropped a little. */
const CARDS = [
  {
    card: "bg-[var(--surface)] [transform:rotate(-1deg)]",
    avatar: "bg-[var(--surface-3)]",
    muted: "text-[var(--muted)]",
  },
  {
    card: "bg-[var(--inv-bg)] text-[var(--inv-ink)] [transform:rotate(1.5deg)] md:mt-[56px]",
    avatar: "bg-[var(--inv-avatar)]",
    muted: "text-[var(--inv-muted)]",
  },
];

export function Testimonials() {
  return (
    <section aria-label="What clients say" className={`flex shrink-0 flex-col gap-[32px] lg:gap-[48px] ${PB} ${PX}`}>
      <Reveal className={`${s.it} ${CHAPTER}`}>…and what they said afterwards</Reveal>
      <Reveal stagger={0.18} className="grid grid-cols-1 items-start gap-[32px] md:grid-cols-2">
        {TESTIMONIALS.map((t, i) => (
          <RevealItem key={i} from={{ y: 70 }}>
            <Card t={t} look={CARDS[i]} />
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}

function Card({ t, look }: { t: Testimonial; look: (typeof CARDS)[number] }) {
  // Longer quotes step down a size so the two cards stay a similar height.
  const long = t.quote.length > 160;
  const initials = t.name.startsWith("[") ? "" : t.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
  return (
    <figure
      className={`${s.ep} m-0 flex flex-col gap-[28px] rounded-[28px] px-[28px] pt-[32px] pb-[28px] lg:px-[44px] lg:pt-[44px] lg:pb-[36px] ${look.card}`}
    >
      <blockquote
        className={`${s.serif} m-0 leading-[1.25] tracking-[-0.01em] text-pretty ${long ? "text-[22px] lg:text-[27px]" : "text-[26px] lg:text-[34px]"}`}
      >
        “{t.quote}”
      </blockquote>
      <figcaption className="flex items-center gap-[14px]">
        <span
          aria-hidden="true"
          className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-[14px] font-semibold tracking-[0.04em] ${look.avatar}`}
        >
          {initials}
        </span>
        <span className="flex flex-col gap-[2px]">
          <span className="text-[15px] font-semibold">{t.name}</span>
          <span className={`text-[13px] ${look.muted}`}>{t.role ? `${t.role}, ${t.brand}` : t.brand}</span>
        </span>
      </figcaption>
    </figure>
  );
}
