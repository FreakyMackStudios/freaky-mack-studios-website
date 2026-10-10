"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { Lockup } from "./Logo";
import { CONTACT, SOCIAL, STUDIO } from "@/shared/config";
import s from "./site.module.css";
import { PX } from "./ui";

const HEAD = `${s.it} mb-[6px] text-[18px] text-[var(--muted-2)]`;

/** Shared footer (design/boards/SiteFooter.dc.html). The Thanks board passes a different sign-off. */
export function SiteFooter() {
  const signoff = usePathname().startsWith("/thanks") ? "Cut. Print. Talk soon." : "The end. For now.";
  return (
    <footer
      className={`rule-bleed mt-auto flex shrink-0 flex-col gap-[48px] border-t border-[var(--ink)] pt-[56px] pb-[88px] lg:h-[424px] lg:justify-between lg:gap-0 lg:pt-[64px] lg:pb-[40px] ${PX}`}
    >
      <Reveal amount={0.3} className="flex flex-col items-start justify-between gap-[48px] lg:flex-row">
        <div className="flex max-w-[360px] min-w-0 flex-col gap-[20px]">
          <Lockup title="Freaky Mack Studios" alignLeft className="h-[118px] w-[150px]" />
          <p className="m-0 text-[15px] leading-[1.6] text-[var(--muted)]">
            A home for filmmakers, creators and ideas that deserve to become films.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-[24px] gap-y-[40px] md:flex md:shrink-0 md:gap-[64px] lg:gap-[40px] xl:gap-[96px]">
          <div className="flex flex-col gap-[12px] text-[15px]">
            <div className={HEAD}>Chapters</div>
            <Link href="/work" className={s.link}>Work</Link>
            <Link href="/studio" className={s.link}>Studio</Link>
            <Link href="/originals" className={s.link}>Originals &amp; podcast</Link>
            <Link href="/people" className={s.link}>People</Link>
            <Link href="/start-a-project" className={s.link}>Start a project</Link>
          </div>
          <div className="flex flex-col gap-[12px] text-[15px]">
            <div className={HEAD}>Follow</div>
            <a href={SOCIAL.instagram} className={s.link}>Instagram</a>
            <a href={SOCIAL.youtube} className={s.link}>YouTube</a>
          </div>
          <div className="col-span-2 flex flex-col gap-[12px] text-[15px]">
            <div className={HEAD}>Say hello</div>
            <a href={`mailto:${CONTACT.email}`} className={`${s.link} break-all md:break-normal`}>{CONTACT.email}</a>
            <a href={CONTACT.phoneHref} className={s.link}>{CONTACT.phone}</a>
            <a href={CONTACT.whatsapp} className={s.link}>WhatsApp · {CONTACT.whatsappNumber}</a>
            <span className="text-[var(--muted)]">{STUDIO.address.join(", ")}</span>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1} amount={0.5} className="flex flex-col items-start justify-between gap-[10px] border-t border-[var(--line-2)] pt-[24px] text-[13px] text-[var(--muted)] md:flex-row md:items-center">
        <span>© 2026 Freaky Mack Studios. All rights reserved.</span>
        <span className={`${s.it} text-[16px]`}>{signoff}</span>
        <span className="flex gap-[16px]">
          <Link href="/privacy" className={s.link}>Privacy</Link>
          <Link href="/terms" className={s.link}>Terms</Link>
          <a href="#top" className={s.link}>Back to the top ↑</a>
        </span>
      </Reveal>
    </footer>
  );
}
