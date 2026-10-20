"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Still } from "@/components/site/Still";
import { ON_LOCATION } from "@/content/bts";
import { SAY_HELLO_EVENT } from "@/components/site/SayHelloLink";
import { CONTACT } from "@/shared/config";
import { Honeypot } from "@/components/site/Honeypot";
import { SEND_MODE, useEnquiryForm } from "@/shared/enquiry";
import s from "../home.module.css";
import { CHAPTER, PX } from "@/shared/ui";

const FIELD = "rounded-[12px] border border-[var(--field-line)] bg-[var(--field-bg)] px-[16px] text-[16px] text-[var(--ink)] [font-family:inherit]";
const LABEL = "text-[13px] font-medium text-[var(--ink-2)]";
const ERR = "m-0 text-[13px] text-[var(--error)]";

/** A small white speech bubble above a field, pointing at it: shown after "Want to be on it? Say hello". */
function Hint({ show, delay, children }: { show: boolean; delay: number; children: ReactNode }) {
  return (
    <span aria-hidden="true" data-hint data-show={show} className={s.hint} style={{ transitionDelay: show ? `${delay}ms` : "0ms" }}>
      {children}
    </span>
  );
}

const HINTS = { name: "Start with your name", email: "Where should we reply?", brief: "What would you talk about?" };
type Field = keyof typeof HINTS;

/**
 * Chapter 06: contact + enquiry form (shared submit handler).
 * The podcast's "Want to be on it? Say hello" brings visitors here (SayHelloLink: an event on this page,
 * ?hello=podcast from another) and, on tablets and desktops (not phones), small bubbles point out what to
 * fill in. Each goes once its field has something in it; all of them fade after a while.
 */
export function Contact() {
  const [hinting, setHinting] = useState(false);
  const [filled, setFilled] = useState<Record<Field, boolean>>({ name: false, email: false, brief: false });
  const [fromPodcast, setFromPodcast] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const { onSubmit, status, message, errors } = useEnquiryForm({ source: fromPodcast ? "Homepage (podcast)" : "Homepage" });

  useEffect(() => {
    let hideTimer: number | undefined;
    const sayHello = () => {
      setFromPodcast(true);
      setHinting(false);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Desktop: the whole chapter fits, so show it from the top. Narrower: the form sits below the heading,
      // so go straight to the form. Measured from layout (offsetTop), not the box on screen: the form may
      // still be mid scroll-reveal (shifted down), which would leave it too high once it settles.
      const target = window.innerWidth >= 1024 ? document.getElementById("contact") : document.querySelector<HTMLElement>("#contact form");
      if (target) {
        let y = 0;
        for (let n: HTMLElement | null = target; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
        window.scrollTo({ top: y - (target.tagName === "FORM" ? 32 : 0), behavior: reduced ? "auto" : "smooth" });
      }
      // Once the scroll settles: the bubbles pop up, and on desktop the cursor waits in "Your name".
      let done = false;
      const arrive = () => {
        if (done) return;
        done = true;
        window.removeEventListener("scrollend", arrive);
        // Phones just get the scroll to the form: no bubbles there.
        if (!window.matchMedia("(min-width: 768px)").matches) return;
        setHinting(true);
        if (window.matchMedia("(pointer: fine)").matches) nameRef.current?.focus({ preventScroll: true });
        window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => setHinting(false), 12000);
      };
      window.addEventListener("scrollend", arrive);
      window.setTimeout(arrive, reduced ? 50 : 1100);
    };
    window.addEventListener(SAY_HELLO_EVENT, sayHello);
    // Arriving from another page (/?hello=podcast#contact): do the same, then tidy the address.
    if (new URLSearchParams(window.location.search).get("hello") === "podcast") {
      window.history.replaceState(window.history.state, "", "/#contact");
      sayHello();
    }
    return () => {
      window.removeEventListener(SAY_HELLO_EVENT, sayHello);
      window.clearTimeout(hideTimer);
    };
  }, []);

  const typed = (f: Field) => (e: { currentTarget: { value: string } }) => {
    const has = e.currentTarget.value.trim() !== "";
    setFilled((prev) => (prev[f] === has ? prev : { ...prev, [f]: has }));
  };
  const hint = (f: Field) => hinting && !filled[f];
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
        {/* Directing on location: fills the space beside the form on large screens, its foot level with the form's. */}
        <div className="hidden max-w-[540px] [transform:rotate(-2deg)] lg:mt-auto lg:block lg:pt-[24px]">
          <Still still={ON_LOCATION} sizes="540px" className="rounded-[20px] shadow-[0_24px_60px_rgba(0,0,0,0.3)]" />
        </div>
      </Reveal>
      {/* Large screens: the form card starts and ends level with the left column (the brief box takes up the slack). */}
      <Reveal from={{ y: 80 }} delay={0.12} className="mt-[48px] flex flex-col lg:col-span-5 lg:col-start-8 lg:mt-0">
      <form
        onSubmit={(e) => {
          setHinting(false);
          return onSubmit(e);
        }}
        noValidate
        aria-label="Start a project"
        data-send={SEND_MODE}
        className="relative flex flex-col gap-[20px] rounded-[28px] bg-[var(--surface)] p-[24px] [transform:rotate(1deg)] sm:p-[36px] lg:flex-1"
      >
        <Honeypot />
        <div className="relative flex flex-col gap-[8px]">
          <label htmlFor="fm-name" className={LABEL}>Your name</label>
          <Hint show={hint("name")} delay={0}>{HINTS.name}</Hint>
          <input ref={nameRef} onInput={typed("name")} id="fm-name" name="name" type="text" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "fm-name-err" : undefined} placeholder="Hi, I’m…" className={`${FIELD} h-[52px]`} />
          {errors.name && <p id="fm-name-err" className={ERR}>{errors.name}</p>}
        </div>
        <div className="relative flex flex-col gap-[8px]">
          <label htmlFor="fm-email" className={LABEL}>Email</label>
          <Hint show={hint("email")} delay={140}>{HINTS.email}</Hint>
          <input onInput={typed("email")} id="fm-email" name="email" type="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "fm-email-err" : undefined} placeholder="you@brand.com" className={`${FIELD} h-[52px]`} />
          {errors.email && <p id="fm-email-err" className={ERR}>{errors.email}</p>}
        </div>
        <div className="relative flex flex-col gap-[8px] lg:flex-1">
          <label htmlFor="fm-brief" className={LABEL}>The story so far</label>
          <Hint show={hint("brief")} delay={280}>{HINTS.brief}</Hint>
          <textarea
            onInput={typed("brief")}
            id="fm-brief"
            name="brief"
            rows={4}
            required
            aria-invalid={!!errors.brief}
            aria-describedby={errors.brief ? "fm-brief-err" : undefined}
            placeholder="Format, timeline, references — whatever you have."
            className={`${FIELD} resize-y py-[14px] lg:flex-1 lg:resize-none`}
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
          <p role="status" className={status === "sending" ? "sr-only" : "m-0 text-[14px] text-[var(--ink-2)]"}>
            {message}
          </p>
        )}
      </form>
      </Reveal>
    </section>
  );
}
