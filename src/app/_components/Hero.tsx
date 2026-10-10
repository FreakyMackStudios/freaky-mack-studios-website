"use client";

import { motion, useScroll } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import { DraggableMark } from "@/components/motion/DraggableMark";
import { EASE, Reveal, RevealItem } from "@/components/motion/Reveal";
import { useSmoothScrollValue } from "@/components/motion/useScrollMotion";
import s from "../home.module.css";
import { PlayIcon } from "./icons";
import { PX } from "@/shared/ui";

export function Hero({
  reelOpen,
  onPressPlay,
  cinema,
}: {
  reelOpen: boolean;
  onPressPlay: () => void;
  /** TEST FEATURE: "Press play" opens the full-screen cinema intro instead of the reel band. */
  cinema: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  // As the hero scrolls away, its text drifts down a little and fades (spring-smoothed).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useSmoothScrollValue(scrollYProgress, [0, 140], 0);
  const opacity = useSmoothScrollValue(scrollYProgress, [1, 0.1], 1);
  return (
    <section
      ref={ref}
      id="top"
      className={`relative flex shrink-0 flex-col items-center pt-[128px] pb-[72px] text-center lg:pt-[140px] lg:pb-[120px] ${PX}`}
    >
      <div data-exit="left" className="pointer-events-none absolute inset-0 z-10" style={{ "--exit-delay": "0.12s" } as CSSProperties}>
        <DraggableMark
          className="pointer-events-auto absolute top-[24px] left-[12px] h-[56px] w-[84px] lg:top-[96px] lg:left-[148px] lg:h-[112px] lg:w-[168px]"
          imgClassName={`${s.blob} opacity-90`}
        />
      </div>
      <div data-exit="right" className="pointer-events-none absolute inset-0" style={{ "--exit-delay": "0.12s" } as CSSProperties}>
      <Reveal
        onMount
        delay={0.5}
        duration={1.1}
        from={{ scale: 0.3, rotate: -90, y: 0 }}
        className="absolute top-[20px] right-[16px] h-[88px] w-[88px] lg:top-[150px] lg:right-[160px] lg:h-[128px] lg:w-[128px]"
        aria-hidden="true"
      >
        <div className={`${s.spin} h-full w-full rounded-full bg-[var(--accent)]`}>
          <svg viewBox="0 0 128 128" className="h-full w-full">
            <defs>
              <path id="fm-circ" d="M64,64 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
            </defs>
            <text
              className={s.badge}
              style={{ fontSize: 11.5, letterSpacing: "0.22em", textTransform: "uppercase", fill: "var(--on-accent)", fontWeight: 600 }}
            >
              <textPath href="#fm-circ">Films for brands · Films of our own · </textPath>
            </text>
          </svg>
        </div>
      </Reveal>
      </div>
      {/* The text block: plays in on load, then eases away as the page scrolls. */}
      <div data-exit="fade" className="w-full">
      <motion.div style={{ y, opacity }} className="flex w-full flex-col items-center">
        <Reveal onMount stagger={0.12} delay={0.1} className="flex w-full flex-col items-center gap-[28px] lg:gap-[40px]">
          <RevealItem className={`${s.it} text-[17px] tracking-[0.08em] text-[var(--muted-2)] uppercase lg:text-[22px]`}>
            Chapter 00 — Once upon a brief
          </RevealItem>
          <motion.h1
            data-reveal="move"
            variants={{
              hidden: { opacity: 0, y: 60, filter: "blur(8px)" },
              show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.1, ease: EASE } },
            }}
            className="m-0 max-w-[1200px] text-[clamp(38px,6.667vw,96px)] leading-[0.98] font-extrabold tracking-[-0.03em] text-balance uppercase"
          >
            We make{" "}
            <span
              className={`${s.it} text-[clamp(42px,7.222vw,104px)] font-normal tracking-[0.01em] text-[var(--accent-text)]`}
            >
              films
            </span>{" "}
            that people actually finish watching.
          </motion.h1>
          <RevealItem
            as="p"
            className="m-0 max-w-[640px] text-[14px] leading-[1.7] tracking-[0.06em] text-[var(--ink-2)] uppercase lg:text-[16px]"
          >
            A film production house born from six years of advertising — now telling stories for brands, music, fashion
            and ourselves.
          </RevealItem>
          <RevealItem className="mt-[8px] flex flex-wrap items-center justify-center gap-[20px]">
            <button
              type="button"
              onClick={onPressPlay}
              {...(cinema ? { "aria-haspopup": "dialog" as const } : { "aria-expanded": reelOpen, "aria-controls": "reel" })}
              className={`${s.pill} ${s.primary} flex h-[60px] items-center gap-[14px] rounded-full border border-[var(--inv-bg)] bg-[var(--inv-bg)] pr-[30px] pl-[22px] text-[15px] font-semibold text-[var(--inv-ink)]`}
            >
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[var(--accent)]">
                <PlayIcon size={11} fill="var(--on-accent)" />
              </span>
              {reelOpen && !cinema ? "Close the reel" : "Press play"}
            </button>
            <a href="#ch1" className={`${s.link} border-b-2 border-[var(--accent)] pb-[3px] text-[15px] font-medium`}>
              or scroll the story ↓
            </a>
          </RevealItem>
        </Reveal>
      </motion.div>
      </div>
    </section>
  );
}
