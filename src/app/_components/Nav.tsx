"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { MobileMenu } from "@/components/site/MobileMenu";
import { NAV_ITEMS } from "@/components/site/nav-items";
import { Mark } from "@/components/site/Logo";
import s from "../home.module.css";
import { PX } from "@/shared/ui";

export function Nav() {
  return (
    <Reveal as="header" onMount from={{ y: -24 }} duration={0.8} className={`flex h-[72px] shrink-0 items-center justify-between lg:h-[96px] ${PX}`}>
      <div data-exit="left">
        <a href="#top" className={`${s.link} flex items-center gap-[14px]`} aria-label="Freaky Mack Studios home">
          <Mark className="h-[32px] w-[48px] shrink-0" />
          <span className="text-[14px] font-extrabold tracking-[0.1em] whitespace-nowrap uppercase">Freaky Mack</span>
        </a>
      </div>
      <nav data-exit="up" aria-label="Chapters" className="hidden items-center gap-[32px] text-[15px] font-medium lg:flex">
        {NAV_ITEMS.map((c) => (
          <Link key={c.no} href={c.href} className={`${s.link} flex items-baseline gap-[6px]`}>
            <span className={`${s.it} text-[var(--muted-2)]`}>{c.no}</span>
            {c.label}
          </Link>
        ))}
      </nav>
      <div data-exit="right" className="flex items-center gap-[10px]">
      <Link
        href="/start-a-project"
        className={`${s.pill} ${s.primary} hidden h-[40px] items-center whitespace-nowrap sm:flex rounded-full border border-[var(--accent)] bg-[var(--accent)] px-[16px] text-[13px] font-semibold text-[var(--on-accent)] lg:h-[46px] lg:px-[22px] lg:text-[14px]`}
      >
        Start a project
      </Link>
      <MobileMenu serifClass={s.it} />
      </div>
    </Reveal>
  );
}
