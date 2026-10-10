"use client";

import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { EASE, Reveal } from "@/components/motion/Reveal";
import { useScrollMotionAllowed } from "@/components/motion/useScrollMotion";
import { REEL } from "@/shared/config";
import { FullReelPlayer, HAS_FULL_REEL, ReelEmbed, ReelLoop } from "@/shared/reel";
import s from "../home.module.css";
import { Eq, PlayIcon } from "./icons";
import { PX } from "@/shared/ui";

const GRADIENT = "radial-gradient(ellipse at 50% 55%, #2c2c2c 0%, #121212 55%, #0a0a0a 100%)";
const DASHED =
  "absolute flex items-center justify-center border border-dashed border-white/[0.18] text-center text-[11px] tracking-[0.22em] text-white/45 uppercase lg:text-[12px]";

const ASPECT = 760 / 428;
/** How much of the window the reel should cover once it has grown (by area). */
const COVER = 0.7;
/** How far the page scrolls (as a share of the window height) while the reel grows in place. */
const PIN = 0.9;

/** The window size, read without a hydration mismatch: "" on the server and while hydrating. */
const onResize = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
function useViewport(): [number, number] {
  const v = useSyncExternalStore(onResize, () => `${document.documentElement.clientWidth}x${window.innerHeight}`, () => "");
  const [w, h] = v ? v.split("x").map(Number) : [0, 0];
  return [w, h];
}

/**
 * The showreel: a straight card that fades in, then grows as the page scrolls. While it grows the
 * reel stays pinned in the middle of the window (the page seems to hold still), and once it covers
 * about 70% of the window the pin releases and the page scrolls on. Opening it (click, or the hero's
 * "Press play") swaps in the full-width band. Phones, reduced motion and no-JS get the static card.
 */
export function Reel({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const allowed = useScrollMotionAllowed();
  const [vw, vh] = useViewport();

  // The card's width in the layout (760px, less on narrow screens) and the size that covers COVER of
  // the window, kept inside it.
  const px = vw < 768 ? 20 : vw < 1024 ? 40 : 96;
  const baseW = Math.min(760, vw - 2 * px);
  const baseH = baseW / ASPECT;
  const targetW = Math.min(Math.sqrt(COVER * vw * vh * ASPECT), vw * 0.94, vh * 0.94 * ASPECT);
  const maxScale = vw ? Math.max(1, targetW / baseW) : 1;
  const pin = allowed && !open && maxScale > 1.05;

  // 0 when the card is centred in the window and pins, 1 when it has grown and releases.
  const top = Math.round(vh / 2 - baseH / 2);
  const { scrollYProgress } = useScroll({ target: track, offset: [`start ${top}px`, `end ${top + Math.round(baseH)}px`] });
  const grown = useTransform(scrollYProgress, (p) => (pin ? 1 + (maxScale - 1) * p : 1));
  const scale = useSpring(grown, { stiffness: 220, damping: 32, mass: 0.5 });

  return (
    <section id="reel" aria-label="Showreel" className={`flex shrink-0 flex-col items-center pb-[96px] lg:pb-[160px] ${PX}`}>
      <div ref={track} data-reel-track className="flex w-full flex-col items-center">
        <div
          data-reel-pin
          className={`flex w-full justify-center ${pin ? "sticky z-10" : ""}`}
          style={pin ? { top } : undefined}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={open ? "open" : "closed"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.55, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className={`flex w-full justify-center ${open ? "max-w-[1296px]" : "max-w-[760px]"}`}
            >
              {open ? (
                <OpenReel onToggle={onToggle} />
              ) : (
                <motion.div style={{ scale }} className="flex w-full">
                  {/* Fade only: no tilt, no slide. */}
                  <Reveal from={{ y: 0 }} duration={1} amount={0.3} className="flex w-full">
                    <ClosedReel onToggle={onToggle} />
                  </Reveal>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Scroll room while the reel grows in place. */}
        {pin && <div aria-hidden="true" style={{ height: Math.round(vh * PIN) }} />}
      </div>
      {/* Once grown, the reel reaches below its layout box by half the height it gained. That room has to
          come after the pinned stretch (inside it, the card would only stay pinned longer), so the next
          chapter keeps its usual distance at every window size. */}
      {pin && <div aria-hidden="true" style={{ height: Math.ceil(((maxScale - 1) * baseH) / 2) }} />}
    </section>
  );
}

/**
 * "or scroll the story ↓": glide to the point where the reel has finished growing and holds the middle of
 * the window, so only the loop is in view. Where the reel doesn't pin (phones, reduced motion, open band),
 * centre it in the window instead.
 */
export function scrollToReel() {
  const track = document.querySelector<HTMLElement>("[data-reel-track]");
  const pin = document.querySelector<HTMLElement>("[data-reel-pin]");
  if (!track || !pin) return;
  const y = window.scrollY;
  let top: number;
  if (getComputedStyle(pin).position === "sticky") {
    // The pinned stretch ends when the pinned box's bottom meets the track's bottom; stop just short of it.
    top = track.getBoundingClientRect().bottom + y - parseFloat(pin.style.top || "0") - pin.offsetHeight - 2;
  } else {
    const r = pin.getBoundingClientRect();
    top = r.top + y + r.height / 2 - window.innerHeight / 2;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: reduced ? "auto" : "smooth" });
}

function OpenReel({ onToggle }: { onToggle: () => void }) {
  const inner = (
    <>
      <div className="absolute inset-0" style={{ background: GRADIENT }} />
      <ReelEmbed
        className="absolute inset-0 h-full w-full"
        placeholder={<div className={`${DASHED} inset-[12px] lg:inset-[24px]`}>[ FULL SHOWREEL — EMBED, SOUND ON ]</div>}
      />
      <div className="pointer-events-none absolute bottom-[16px] left-[18px] flex items-center gap-[14px] text-[12px] font-medium lg:bottom-[36px] lg:left-[40px] lg:text-[14px]">
        <Eq height={18} color="#ffffff" />
        Now playing · Showreel [YEAR]
      </div>
    </>
  );
  const box =
    "relative aspect-[1296/730] w-full max-w-[1296px] overflow-hidden rounded-[20px] border-0 bg-[#0d0d0d] p-0 text-left text-white lg:rounded-[28px]";
  const closeLabel =
    "absolute top-[16px] right-[18px] text-[12px] text-white/70 lg:top-auto lg:right-[40px] lg:bottom-[36px] lg:text-[13px]";

  // The full reel: the player owns play/pause, the timeline, volume and fullscreen along the bottom, so the
  // close control sits top-right, clear of them. Escape closes it too.
  if (HAS_FULL_REEL) {
    return (
      <div className={box}>
        <FullReelPlayer className="absolute inset-0 h-full w-full bg-black object-contain" />
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-[12px] right-[12px] z-10 rounded-full border-0 bg-black/65 px-[14px] py-[8px] text-[12px] font-semibold text-white backdrop-blur-sm lg:top-[20px] lg:right-[20px] lg:text-[13px]"
        >
          Close the reel ✕
        </button>
        <CloseOnEscape onClose={onToggle} />
      </div>
    );
  }

  // With an embed in place the band can't be one big button, so it gets its own close control.
  if (REEL.fullEmbedUrl) {
    return (
      <div className={box}>
        {inner}
        <button type="button" onClick={onToggle} className={`${closeLabel} border-0 bg-transparent`}>
          Close the reel ✕
        </button>
      </div>
    );
  }
  return (
    <button type="button" onClick={onToggle} aria-label="Close the reel" className={box}>
      {inner}
      <div className={closeLabel}>click anywhere to close</div>
    </button>
  );
}

function ClosedReel({ onToggle }: { onToggle: () => void }) {
  // The "new!" sticker hangs over the card's edge, so it sits outside the card's clipped box.
  return (
    <div className={`${s.reelCard} relative w-full max-w-[760px]`}>
    <button
      type="button"
      onClick={onToggle}
      aria-label="Open the showreel"
      className={`relative block aspect-[760/428] w-full overflow-hidden rounded-[20px] border-0 bg-[#0d0d0d] p-0 text-left text-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] lg:rounded-[24px]`}
    >
      <div className="absolute inset-0" style={{ background: GRADIENT }} />
      <ReelLoop className="absolute inset-0 h-full w-full object-cover">
        <div className={`${DASHED} inset-[12px] lg:inset-[18px]`}>[ 10–15 SEC LOOP, MUTED ]</div>
      </ReelLoop>
      {/* Keeps the label legible over any frame of the loop. */}
      {REEL.loopSrc && <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/55 to-transparent" />}
      <div className="absolute bottom-[16px] left-[18px] flex items-center gap-[14px] lg:bottom-[28px] lg:left-[32px]">
        <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[var(--accent)] lg:h-[52px] lg:w-[52px]">
          <PlayIcon size={14} fill="var(--on-accent)" />
        </span>
        <span className="flex flex-col gap-[2px]">
          <span className="text-[14px] font-semibold lg:text-[15px]">Showreel</span>
          <span className="text-[12px] text-white/65 lg:text-[13px]">tap to open · {REEL.duration}</span>
        </span>
      </div>
    </button>
      <span
        aria-hidden="true"
        className={`${s.it} pointer-events-none absolute top-[14px] right-[-6px] rounded-full bg-[var(--accent)] px-[14px] py-[4px] text-[16px] text-[var(--on-accent)] [transform:rotate(6deg)] lg:top-[22px] lg:px-[18px] lg:py-[6px] lg:text-[20px]`}
      >
        new!
      </span>
    </div>
  );
}

/** Closes the open reel on Escape. */
function CloseOnEscape({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return null;
}
