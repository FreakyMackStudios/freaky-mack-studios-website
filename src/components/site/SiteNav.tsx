"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { Mark } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NAV_ITEMS, activeFor } from "./nav-items";
import s from "./site.module.css";
import { PX } from "./ui";

/**
 * Shared header (design/boards/SiteNav.dc.html). The active item comes from the URL. Between 1024 and 1279px
 * the five chapters sit a little tighter, without their numbers, so they fit beside the logo and the button.
 */
export function SiteNav() {
  const active = activeFor(usePathname());
  const onContact = active === "contact";
  return (
    <Reveal as="header" onMount from={{ y: -24 }} duration={0.8} className={`flex h-[72px] shrink-0 items-center justify-between lg:h-[96px] ${PX}`}>
      <Link href="/" aria-label="Freaky Mack Studios home" className={`${s.link} flex items-center gap-[14px]`}>
        <Mark className="h-[32px] w-[48px] shrink-0" />
        <span className="text-[14px] font-extrabold tracking-[0.1em] whitespace-nowrap uppercase">Freaky Mack</span>
      </Link>
      <nav aria-label="Main" className="hidden items-center gap-[18px] text-[14px] font-medium whitespace-nowrap lg:flex xl:gap-[32px] xl:text-[15px]">
        {NAV_ITEMS.map((it) => (
          <Link
            key={it.key}
            href={it.href}
            aria-current={active === it.key ? "page" : undefined}
            className={`${s.link} flex items-baseline gap-[6px] border-b-2 pb-[4px] ${
              active === it.key ? "border-[var(--accent)]" : "border-transparent"
            }`}
          >
            <span className={`${s.it} hidden text-[var(--muted-2)] xl:inline`}>{it.no}</span>
            {it.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-[10px]">
        <Link
          href="/start-a-project"
          aria-current={onContact ? "page" : undefined}
          className={`${s.pill} hidden h-[40px] items-center rounded-full border px-[16px] text-[13px] font-semibold whitespace-nowrap sm:flex lg:h-[46px] lg:px-[22px] lg:text-[14px] ${
            onContact
              ? "border-[var(--inv-bg)] bg-[var(--inv-bg)] text-[var(--inv-ink)]"
              : "border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)]"
          }`}
        >
          Start a project
        </Link>
        <MobileMenu serifClass={s.it} />
      </div>
    </Reveal>
  );
}
