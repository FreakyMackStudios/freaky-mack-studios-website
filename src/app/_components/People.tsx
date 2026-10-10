"use client";

import Link from "next/link";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import s from "../home.module.css";
import { CHAPTER, H2, PB, PX } from "@/shared/ui";

const FACES = [
  { label: "Izaan Khan · Founder", radius: "120px 120px 24px 24px", bg: "var(--surface-2)", rot: -3, mb: 0 },
  { label: "AB Rahim Shah · Sales & Marketing", radius: "24px 24px 120px 120px", bg: "var(--surface-3)", rot: 2, mb: 40 },
  { label: "Ashok Naik · Creative Director", radius: "120px", bg: "var(--surface-2)", rot: -2, mb: 0 },
  { label: "Tridip K Maity · Editor", radius: "24px", bg: "var(--surface-3)", rot: 4, mb: 24 },
];

export function People() {
  return (
    <section id="ch5" className={`flex shrink-0 flex-col items-center gap-[48px] lg:gap-[64px] ${PB} ${PX}`}>
      <Reveal className="flex flex-col items-center gap-[20px] text-center">
        <div className={`${s.it} ${CHAPTER}`}>Chapter 05 — The humans behind the camera</div>
        <h2 className={`${H2} max-w-[900px]`}>Small crew. Big appetite.</h2>
      </Reveal>
      <Reveal stagger={0.1} amount={0.2} className="grid w-full grid-cols-2 items-end gap-x-[16px] gap-y-[40px] md:flex md:w-auto md:gap-[32px] lg:gap-[48px]">
        {FACES.map((f, i) => (
          <RevealItem
            key={i}
            from={{ y: 60 }}
            className={`${s.face} flex flex-col items-center gap-[16px] ${f.mb === 40 ? "md:mb-[40px]" : f.mb === 24 ? "md:mb-[24px]" : ""}`}
          >
            <div
              className="flex aspect-[200/240] w-full max-w-[160px] items-center justify-center text-center text-[12px] tracking-[0.2em] text-[var(--muted)] uppercase md:max-w-none lg:h-[240px] lg:w-[200px]"
              style={{ borderRadius: f.radius, background: f.bg }}
            >
              [ PHOTO ]
            </div>
            <span
              className="rounded-full border border-[var(--ink)] bg-[var(--pill-bg)] px-[12px] py-[6px] text-center text-[13px] font-semibold lg:px-[16px] lg:py-[8px] lg:text-[15px]"
              style={{ transform: `rotate(${f.rot}deg)` }}
            >
              {f.label}
            </span>
          </RevealItem>
        ))}
      </Reveal>
      <Reveal delay={0.1} className="flex">
      <Link href="/people" className={`${s.link} ${s.it} border-b border-[var(--ink)] pb-[4px] text-[22px] lg:text-[26px]`}>
        Meet everyone →
      </Link>
      </Reveal>
    </section>
  );
}
