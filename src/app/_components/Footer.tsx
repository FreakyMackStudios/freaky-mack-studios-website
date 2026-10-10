"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Lockup } from "@/components/site/Logo";
import { CONTACT, SOCIAL, STUDIO } from "@/shared/config";
import s from "../home.module.css";
import { PX } from "@/shared/ui";

const HEAD = "mb-[6px] text-[18px] text-[var(--muted-2)]";

export function Footer() {
  return (
    <footer
      className={`rule-bleed mt-auto flex shrink-0 flex-col gap-[48px] border-t border-[var(--ink)] pt-[56px] pb-[88px] lg:gap-[56px] lg:pt-[64px] lg:pb-[40px] ${PX}`}
    >
      <Reveal amount={0.3} className="flex flex-col items-start justify-between gap-[48px] lg:flex-row">
        <div className="flex max-w-[360px] flex-col gap-[20px]">
          <Lockup title="Freaky Mack Studios" className="h-[118px] w-[150px]" />
          <p className="m-0 text-[15px] leading-[1.6] text-[var(--muted)]">
            A home for filmmakers, creators and ideas that deserve to become films.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-[24px] gap-y-[40px] md:flex md:gap-[64px] lg:gap-[96px]">
          <div className="flex flex-col gap-[12px] text-[15px]">
            <div className={`${s.it} ${HEAD}`}>Chapters</div>
            <Link href="/work" className={s.link}>Work</Link>
            <Link href="/studio" className={s.link}>Studio</Link>
            <Link href="/originals" className={s.link}>Originals &amp; podcast</Link>
            <Link href="/people" className={s.link}>People</Link>
            <Link href="/start-a-project" className={s.link}>Start a project</Link>
          </div>
          <div className="flex flex-col gap-[12px] text-[15px]">
            <div className={`${s.it} ${HEAD}`}>Follow</div>
            <a href={SOCIAL.instagram} className={s.link}>Instagram</a>
            <a href={SOCIAL.youtube} className={s.link}>YouTube</a>
          </div>
          <div className="col-span-2 flex flex-col gap-[12px] text-[15px]">
            <div className={`${s.it} ${HEAD}`}>Say hello</div>
            <a href={`mailto:${CONTACT.email}`} className={s.link}>{CONTACT.email}</a>
            {CONTACT.phones.map((ph) => (
              <a key={ph.href} href={ph.href} className={s.link}>
                {ph.label}
              </a>
            ))}
            <a href={CONTACT.whatsapp} className={s.link}>WhatsApp · {CONTACT.whatsappNumber}</a>
            <span className="text-[var(--muted)]">{STUDIO.address.join(", ")}</span>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1} amount={0.5} className="flex flex-col items-start justify-between gap-[10px] border-t border-[var(--line-2)] pt-[24px] text-[13px] text-[var(--muted)] md:flex-row md:items-center">
        <span>© 2026 Freaky Mack Studios. All rights reserved.</span>
        <span className={`${s.it} text-[16px]`}>The end. For now.</span>
        <span className="flex gap-[16px]">
          <Link href="/privacy" className={s.link}>Privacy</Link>
          <Link href="/terms" className={s.link}>Terms</Link>
          <a href="#top" className={s.link}>Back to the top ↑</a>
        </span>
      </Reveal>
    </footer>
  );
}
