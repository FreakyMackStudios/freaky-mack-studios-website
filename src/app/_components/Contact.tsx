"use client";

import { Reveal } from "@/components/motion/Reveal";
import { CONTACT } from "@/shared/config";
import { useEnquiryForm } from "@/shared/enquiry";
import s from "../home.module.css";
import { CHAPTER, PX } from "@/shared/ui";

const FIELD = "rounded-[12px] border border-[var(--field-line)] bg-[var(--field-bg)] px-[16px] text-[16px] text-[var(--ink)] [font-family:inherit]";
const LABEL = "text-[13px] font-medium text-[var(--ink-2)]";
const ERR = "m-0 text-[13px] text-[var(--error)]";

/** Chapter 06: contact + enquiry form (shared submit handler). */
export function Contact() {
  const { onSubmit, status, message, errors } = useEnquiryForm({ source: "Homepage" });
  return (
    <section
      id="contact"
      className={`grid shrink-0 grid-cols-1 pb-[96px] lg:grid-cols-12 lg:gap-x-[32px] lg:pb-[140px] ${PX}`}
    >
      <Reveal className="flex flex-col gap-[24px] lg:col-span-7 lg:gap-[32px]">
        <div className={`${s.it} ${CHAPTER}`}>Chapter 06 — Your turn</div>
        <h2 className="m-0 text-[clamp(46px,6.111vw,88px)] leading-[1] font-extrabold tracking-[-0.035em] text-balance">
          Got a story? <span className={`${s.it} font-normal tracking-normal normal-case`}>Let’s shoot it.</span>
        </h2>
        <a
          href={`mailto:${CONTACT.email}`}
          className={`${s.link} self-start border-b-[3px] border-[var(--accent)] pb-[6px] text-[19px] font-medium tracking-[-0.01em] break-all sm:text-[22px] lg:text-[26px]`}
        >
          {CONTACT.email}
        </a>
        <a href={CONTACT.whatsapp} className={`${s.link} self-start text-[16px] text-[var(--ink-2)]`}>
          or WhatsApp us · {CONTACT.whatsappNumber} ↗
        </a>
      </Reveal>
      <Reveal from={{ y: 80 }} delay={0.12} className="mt-[48px] lg:col-span-5 lg:col-start-8 lg:mt-[96px]">
      <form
        onSubmit={onSubmit}
        noValidate
        aria-label="Start a project"
        className="flex flex-col gap-[20px] rounded-[28px] bg-[var(--surface)] p-[24px] [transform:rotate(1deg)] sm:p-[36px]"
      >
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="fm-name" className={LABEL}>Your name</label>
          <input id="fm-name" name="name" type="text" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "fm-name-err" : undefined} placeholder="Hi, I’m…" className={`${FIELD} h-[52px]`} />
          {errors.name && <p id="fm-name-err" className={ERR}>{errors.name}</p>}
        </div>
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="fm-email" className={LABEL}>Email</label>
          <input id="fm-email" name="email" type="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "fm-email-err" : undefined} placeholder="you@brand.com" className={`${FIELD} h-[52px]`} />
          {errors.email && <p id="fm-email-err" className={ERR}>{errors.email}</p>}
        </div>
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="fm-brief" className={LABEL}>The story so far</label>
          <textarea
            id="fm-brief"
            name="brief"
            rows={4}
            required
            aria-invalid={!!errors.brief}
            aria-describedby={errors.brief ? "fm-brief-err" : undefined}
            placeholder="Format, timeline, references — whatever you have."
            className={`${FIELD} resize-y py-[14px]`}
          />
          {errors.brief && <p id="fm-brief-err" className={ERR}>{errors.brief}</p>}
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className={`${s.pill} ${s.primary} h-[56px] self-start rounded-full border border-[var(--accent)] bg-[var(--accent)] px-[28px] text-[15px] font-semibold text-[var(--on-accent)]`}
        >
          Send it over
        </button>
        {message && (
          <p role="status" className="m-0 text-[14px] text-[var(--ink-2)]">
            {message}
          </p>
        )}
      </form>
      </Reveal>
    </section>
  );
}
