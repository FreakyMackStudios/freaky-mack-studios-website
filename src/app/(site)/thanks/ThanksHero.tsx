"use client";

import Link from "next/link";
import { motion, type TargetAndTransition, type Transition } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { BTN_INVERSE, BTN_OUTLINE } from "@/components/site/buttons";
import { DraggableMark } from "@/components/motion/DraggableMark";
import s from "@/components/site/site.module.css";
import { AccentWord, H1, Intro, PX } from "@/components/site/ui";
import { CONTACT } from "@/shared/config";
import { Still } from "@/components/site/Still";
import { WRAP } from "@/content/bts";
import { curtainIsUp, uncoverScreen } from "@/shared/send-flight";

type From = "top" | "bottom" | "left" | "right";

/**
 * Each piece flies in from its own side on a springy path, stretched along the way it travels, and
 * squashes as it lands: stretched long, squashed, a small rebound, settled.
 */
function entrance(from: From, delay: number): { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition } {
  const sideways = from === "left" || from === "right";
  const offset = from === "left" || from === "top" ? -1 : 1;
  const along = [1.7, 0.86, 1.07, 0.98, 1];
  const across = [0.62, 1.12, 0.95, 1.01, 1];
  const spring = { type: "spring" as const, stiffness: 210, damping: 13, mass: 0.9, delay };
  const stretch = { duration: 0.85, times: [0, 0.35, 0.6, 0.8, 1], ease: "easeOut" as const, delay };
  return {
    initial: { opacity: 0, x: sideways ? offset * 420 : 0, y: sideways ? 0 : offset * 300, scaleX: sideways ? along[0] : across[0], scaleY: sideways ? across[0] : along[0] },
    animate: { opacity: 1, x: 0, y: 0, scaleX: sideways ? along : across, scaleY: sideways ? across : along },
    transition: { x: spring, y: spring, scaleX: stretch, scaleY: stretch, opacity: { duration: 0.25, delay } },
  };
}

function Fly({ from, delay, className, children }: { from: From; delay: number; className?: string; children: ReactNode }) {
  return (
    <motion.div data-reveal="move" className={className} {...entrance(from, delay)}>
      {children}
    </motion.div>
  );
}

/**
 * The top of /thanks. Arriving from a sent enquiry, the black curtain from the send sequence is still up:
 * it slides away to the left and the page plays in behind it (src/shared/send-flight.ts).
 */
export function ThanksHero() {
  const [behindCurtain] = useState(() => typeof document !== "undefined" && curtainIsUp());
  useEffect(() => {
    if (behindCurtain) void uncoverScreen("left");
  }, [behindCurtain]);
  // Start as the curtain is half way across.
  const t = (i: number) => (behindCurtain ? 0.3 : 0.1) + i * 0.09;

  return (
    <section className={`flex flex-col items-center gap-[48px] pt-[56px] pb-[80px] lg:gap-[72px] lg:pt-[96px] lg:pb-[120px] ${PX}`}>
      {/* Two columns on large screens: the message on the left, the wrap photo big on the right. Stacked on phones. */}
      <div className="grid w-full grid-cols-1 items-center gap-[48px] lg:grid-cols-12 lg:gap-x-[32px]">
        <div className="flex flex-col items-center gap-[24px] text-center lg:col-span-7 lg:items-start lg:gap-[32px] lg:text-left">
          <Fly from="top" delay={t(0)} className="flex">
            <DraggableMark className="relative h-[84px] w-[126px] lg:h-[110px] lg:w-[165px]" imgClassName={s.blob} />
          </Fly>
          <Fly from="left" delay={t(1)} className="flex">
            <span className="rounded-full bg-[var(--accent)] px-[20px] py-[8px] text-[15px] font-semibold text-[var(--on-accent)] [transform:rotate(-3deg)]">
              Brief received
            </span>
          </Fly>
          <Fly from="left" delay={t(2)}>
            <H1 big>
              That’s a <AccentWord big>wrap</AccentWord> for now.
            </H1>
          </Fly>
          <Fly from="bottom" delay={t(3)}>
            <Intro className="max-w-[560px]">
              Thanks for telling us your story. We’ll be in touch at the email you gave us, within {CONTACT.replyTime}.
            </Intro>
          </Fly>
        </div>
        {/* Wrap day: a polaroid of the crew at the end of a shoot. */}
        <Fly from="right" delay={t(2.5)} className="flex justify-center lg:col-span-5">
          <div className="w-[260px] bg-white p-[12px] pb-[44px] shadow-[0_24px_60px_rgba(0,0,0,0.35)] [transform:rotate(4deg)] sm:w-[320px] lg:w-[380px] lg:p-[14px] lg:pb-[52px] xl:w-[420px]">
            <Still still={WRAP} sizes="(min-width: 1280px) 420px, (min-width: 1024px) 380px, 320px" />
          </div>
        </Fly>
      </div>
      <div className="flex flex-wrap justify-center gap-[12px] sm:gap-[16px]">
        <Fly from="left" delay={t(4)} className="flex">
          <Link href="/" className={BTN_INVERSE}>Back to the start</Link>
        </Fly>
        <Fly from="right" delay={t(4.5)} className="flex">
          <Link href="/work" className={BTN_OUTLINE}>See the work</Link>
        </Fly>
      </div>
    </section>
  );
}
