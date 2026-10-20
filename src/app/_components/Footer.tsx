"use client";

import Link from "next/link";
import { ContactDetails } from "@/components/site/ContactDetails";
import { CookieSettingsButton } from "@/components/site/CookieSettingsButton";
import { Reveal } from "@/components/motion/Reveal";
import { Lockup } from "@/components/site/Logo";
import { SOCIAL } from "@/shared/config";
import s from "../home.module.css";
import { PX } from "@/shared/ui";

const HEAD = "mb-[6px] text-[18px] text-[var(--muted-2)]";

export function Footer() {
  return (
    <footer
      className={`rule-bleed mt-auto flex shrink-0 flex-col gap-[48px] border-t border-[var(--ink)] pt-[56px] pb-[88px] lg:gap-[56px] lg:pt-[64px] lg:pb-[40px] ${PX}`}
    >
      <Reveal amount={0.3} className="flex flex-col items-start justify-between gap-[48px] lg:flex-row">
        <div className="flex max-w-[360px] min-w-0 flex-col gap-[20px] lg:max-w-[300px]">
          <Lockup title="Freaky Mack Studios" className="h-[118px] w-[150px]" />
          <p className="m-0 text-[15px] leading-[1.6] text-[var(--muted)]">
            A home for filmmakers, creators and ideas that deserve to become films.
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-x-[24px] gap-y-[40px] md:grid-cols-[auto_auto] md:gap-x-[64px] min-[1400px]:flex min-[1400px]:gap-[64px]">
          <div className="flex flex-col gap-[12px] text-[15px]">
            <div className={`${s.it} ${HEAD}`}>Chapters</div>
            <Link href="/work" className={s.link}>Work</Link>
            <Link href="/studio" className={s.link}>Studio</Link>
            <Link href="/originals" className={s.link}>Originals &amp; podcast</Link>
            <Link href="/people" className={s.link}>People</Link>
            <Link href="/sister-companies" className={s.link}>Sister companies</Link>
            <Link href="/start-a-project" className={s.link}>Start a project</Link>
          </div>
          <div className="flex flex-col gap-[12px] text-[15px]">
            <div className={`${s.it} ${HEAD}`}>Follow</div>
            <a href={SOCIAL.instagram} className={s.link}>Instagram</a>
            <a href={SOCIAL.youtube} className={s.link}>YouTube</a>
          </div>
          <div className="col-span-2 flex min-w-0 flex-col gap-[12px] text-[15px]">
            <div className={`${s.it} ${HEAD}`}>Say hello</div>
            <ContactDetails />
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1} amount={0.5} className="flex flex-col items-start justify-between gap-[10px] border-t border-[var(--line-2)] pt-[24px] text-[13px] text-[var(--muted)] md:flex-row md:items-center">
        <span>© 2026 Freaky Mack Studios. All rights reserved.</span>
        <span className={`${s.it} text-[16px]`}>The end. For now.</span>
        <span className="flex flex-wrap gap-x-[16px] gap-y-[6px]">
          <Link href="/privacy" className={s.link}>Privacy</Link>
          <Link href="/terms" className={s.link}>Terms</Link>
          <CookieSettingsButton className={s.link} />
          <a href="#top" className={s.link}>Back to the top ↑</a>
        </span>
      </Reveal>
    </footer>
  );
}
