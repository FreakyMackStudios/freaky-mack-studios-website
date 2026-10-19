/**
 * The "Send it over" sequence, shared by both enquiry forms (see useEnquiryForm in ./enquiry.ts):
 *
 *   1. the form's contents fade and the card folds into an envelope (side and bottom flaps fold in, the top
 *      flap closes, an accent seal stamps it),
 *   2. it pulls back a touch and flies off the right edge of the screen,
 *   3. a solid black curtain slides in from the right and holds while the enquiry is confirmed,
 *   4. on /thanks the curtain slides away to the left (ThanksHero) and the page plays in.
 *      If the send fails, the curtain slides back out to the right and the form comes back as it was.
 *
 * Built with the Web Animations API on plain DOM nodes rather than React state: the curtain has to stay
 * on screen across the route change to /thanks, and nothing here needs to re-render.
 */

const PAPER = "#f4f1e8";
const FLAP_SIDE = "#e8e3d6";
const FLAP_BOTTOM = "#eeeadf";
const FLAP_TOP = "#ddd7c8";
const CURTAIN_ID = "fm-curtain";
const ENVELOPE_ID = "fm-envelope";

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

function el(style: Partial<CSSStyleDeclaration>, parent?: HTMLElement, text?: string) {
  const d = document.createElement("div");
  Object.assign(d.style, style);
  if (text) d.textContent = text;
  parent?.appendChild(d);
  return d;
}

/** Animate and resolve when done, holding the end state. */
function play(target: Element, frames: Keyframe[], options: KeyframeAnimationOptions) {
  return target.animate(frames, { fill: "both", ...options }).finished.then(() => undefined);
}

/** Fades the form out, folds it into an envelope and flies it off to the right. The form stays hidden. */
export async function flyEnvelope(form: HTMLElement): Promise<void> {
  // 1. The fields fade, leaving the bare card.
  const fades = [...form.children].map((c) => c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" }));
  await wait(220);

  const rect = form.getBoundingClientRect();
  const cs = getComputedStyle(form);
  // Fold towards the middle of the part of the form that is on screen.
  const visTop = Math.max(rect.top, 0);
  const visBottom = Math.min(rect.bottom, window.innerHeight);
  const cx = rect.left + rect.width / 2;
  const cy = visBottom > visTop ? (visTop + visBottom) / 2 : window.innerHeight / 2;
  const w = Math.min(340, Math.max(220, rect.width * 0.7));
  const h = Math.round(w * 0.62);

  const stage = el({ position: "fixed", left: "0", top: "0", width: "100vw", height: "100vh", zIndex: "1500", pointerEvents: "none", perspective: "1200px" });
  stage.id = ENVELOPE_ID;
  stage.setAttribute("aria-hidden", "true");
  const env = el(
    {
      position: "absolute",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      background: cs.backgroundColor,
      borderRadius: cs.borderRadius,
      transform: cs.transform === "none" ? "none" : cs.transform,
      boxShadow: "0 16px 36px rgba(0,0,0,0.28)",
      transformStyle: "preserve-3d",
    },
    stage,
  );
  const flap = (clip: string, bg: string, origin: string) =>
    el({ position: "absolute", inset: "0", clipPath: clip, background: bg, borderRadius: "12px", opacity: "0", transformOrigin: origin }, env);
  const left = flap("polygon(0 0, 52% 54%, 0 100%)", FLAP_SIDE, "0% 50%");
  const right = flap("polygon(100% 0, 48% 54%, 100% 100%)", FLAP_SIDE, "100% 50%");
  const bottom = flap("polygon(0 100%, 50% 46%, 100% 100%)", FLAP_BOTTOM, "50% 100%");
  // The top flap starts open (flipped up above the envelope) and closes down over it.
  const top = el(
    {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "60%",
      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
      background: FLAP_TOP,
      borderRadius: "12px 12px 0 0",
      transformOrigin: "50% 0%",
      transform: "rotateX(180deg)",
      opacity: "0",
      backfaceVisibility: "visible",
    },
    env,
  );
  const seal = el(
    {
      position: "absolute",
      left: "50%",
      top: "54%",
      width: "38px",
      height: "38px",
      margin: "-19px 0 0 -19px",
      borderRadius: "50%",
      background: "var(--accent, #1f3bff)",
      color: "var(--on-accent, #fff)",
      font: "800 12px/38px var(--fm-sans), sans-serif",
      letterSpacing: "0.04em",
      textAlign: "center",
      transform: "scale(0)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    },
    env,
    "FM",
  );
  document.body.appendChild(stage);
  form.style.visibility = "hidden";
  fades.forEach((a) => a.cancel());

  // 2. The card shrinks into an envelope.
  const fold = { duration: 480, easing: "cubic-bezier(0.65, 0, 0.35, 1)" };
  const morph = play(
    env,
    [
      { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, borderRadius: cs.borderRadius, background: cs.backgroundColor, transform: env.style.transform },
      { left: `${cx - w / 2}px`, top: `${cy - h / 2}px`, width: `${w}px`, height: `${h}px`, borderRadius: "12px", background: PAPER, transform: "none" },
    ],
    fold,
  );
  await wait(300);
  // 3. Sides and bottom fold in, the top flap appears open.
  const flapIn = (f: HTMLElement, from: string, delay: number) =>
    play(f, [{ opacity: 0, transform: from }, { opacity: 1, transform: "none" }], { duration: 320, delay, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
  await Promise.all([
    morph,
    flapIn(left, "scaleX(0.2)", 0),
    flapIn(right, "scaleX(0.2)", 40),
    flapIn(bottom, "scaleY(0.2)", 80),
    play(top, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 60 }),
  ]);
  // 4. The top flap closes, the seal stamps it.
  await play(top, [{ transform: "rotateX(180deg)" }, { transform: "rotateX(0deg)" }], { duration: 380, easing: "cubic-bezier(0.6, 0, 0.3, 1)" });
  await play(seal, [{ transform: "scale(0) rotate(-30deg)" }, { transform: "scale(1.25) rotate(6deg)", offset: 0.6 }, { transform: "scale(1) rotate(0deg)" }], {
    duration: 300,
    easing: "ease-out",
  });
  await wait(120);
  // 5. A small wind-up, then off the right edge.
  const away = window.innerWidth - (cx - w / 2) + w;
  await play(env, [{ transform: "none" }, { transform: "translate(-26px, 6px) rotate(-6deg) scale(0.97)" }], { duration: 200, easing: "ease-out" });
  await play(
    env,
    [
      { transform: "translate(-26px, 6px) rotate(-6deg) scale(0.97)" },
      { transform: `translate(${away}px, -110px) rotate(16deg) scale(0.9)` },
    ],
    { duration: 520, easing: "cubic-bezier(0.55, 0, 0.85, 0.35)" },
  );
  stage.remove();
}

/** Brings the form back after a failed send. */
export function restoreForm(form: HTMLElement) {
  form.style.visibility = "";
  form.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 400, easing: "ease-out", composite: "add" });
}

/** Slides the black curtain in from the right and holds it. After a moment it shows a quiet loader. */
export async function coverScreen(): Promise<void> {
  document.getElementById(CURTAIN_ID)?.remove();
  const curtain = el({ position: "fixed", inset: "0", zIndex: "2000", background: "#000", transform: "translateX(100%)", display: "grid", placeItems: "center" });
  curtain.id = CURTAIN_ID;
  curtain.setAttribute("aria-hidden", "true");
  const dots = el({ display: "flex", gap: "10px", opacity: "0" }, curtain);
  [0, 1, 2].forEach((i) => {
    const d = el({ width: "9px", height: "9px", borderRadius: "50%", background: "#fff" }, dots);
    d.animate([{ transform: "translateY(0)", opacity: 0.35 }, { transform: "translateY(-8px)", opacity: 1 }, { transform: "translateY(0)", opacity: 0.35 }], {
      duration: 900,
      delay: i * 140,
      iterations: Infinity,
      easing: "ease-in-out",
    });
  });
  document.body.appendChild(curtain);
  await play(curtain, [{ transform: "translateX(100%)" }, { transform: "translateX(0)" }], { duration: 600, easing: "cubic-bezier(0.76, 0, 0.24, 1)" });
  // Only show the loader if the confirmation takes a moment.
  dots.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 500, fill: "forwards" });
}

export const curtainIsUp = () => !!document.getElementById(CURTAIN_ID);

/** Slides the curtain away (to the left on the way into Thanks, back to the right after a failed send). */
export async function uncoverScreen(to: "left" | "right"): Promise<void> {
  const curtain = document.getElementById(CURTAIN_ID);
  if (!curtain || curtain.dataset.leaving) return;
  curtain.dataset.leaving = "1";
  await play(curtain, [{ transform: "translateX(0)" }, { transform: `translateX(${to === "left" ? "-100%" : "100%"})` }], {
    duration: 700,
    easing: "cubic-bezier(0.76, 0, 0.24, 1)",
  });
  curtain.remove();
}
