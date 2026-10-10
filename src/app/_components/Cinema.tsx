"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { REEL } from "@/shared/config";
import { FullReelSources } from "@/shared/reel";
import c from "./cinema.module.css";

/**
 * TEST FEATURE: "Press play" cinema intro.
 * The hero text fades, the first-screen elements slide off left and right, the screen goes black,
 * a 3-2-1 film-leader countdown runs and the complete showreel plays full screen.
 * Close (✕ or Escape) or the reel ending reverses it.
 *
 * idle → exit (elements leave, black fades in) → count (3, 2, 1) → play → return → idle
 */
export type CinemaPhase = "idle" | "exit" | "count" | "play" | "return";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useCinema() {
  const [phase, setPhase] = useState<CinemaPhase>("idle");
  const [count, setCount] = useState(3);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const active = phase !== "idle";

  const start = useCallback(() => {
    if (phase !== "idle") return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    // While we still hold the click, unlock playback with sound (iOS asks per element) and start
    // buffering, so the reel is ready when the countdown ends.
    const v = videoRef.current;
    if (v) {
      v.preload = "auto";
      v.muted = false;
      v.play().catch(() => {});
      v.pause();
    }
    setMuted(false);
    setCount(3);
    setPhase("exit");
  }, [phase]);

  const close = useCallback(() => {
    videoRef.current?.pause();
    setPhase((p) => (p === "idle" || p === "return" ? p : "return"));
  }, []);

  const unmute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    v.play().catch(() => {});
  }, []);

  // The timeline.
  useEffect(() => {
    let t: number | undefined;
    if (phase === "exit") t = window.setTimeout(() => setPhase("count"), reducedMotion() ? 400 : 1300);
    else if (phase === "count") t = window.setTimeout(() => (count > 1 ? setCount(count - 1) : setPhase("play")), 1000);
    else if (phase === "return") t = window.setTimeout(() => setPhase("idle"), reducedMotion() ? 200 : 650);
    return () => window.clearTimeout(t);
  }, [phase, count]);

  // Roll the reel from the top, with sound; if the browser refuses sound, play muted with a "Tap for sound" pill.
  useEffect(() => {
    if (phase !== "play") return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
  }, [phase]);

  // While it runs: no page scroll, Escape closes. Afterwards focus goes back to "Press play".
  useEffect(() => {
    if (!active) {
      returnFocus.current?.focus({ preventScroll: true });
      returnFocus.current = null;
      return;
    }
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close]);

  return { phase, count, muted, active, videoRef, start, close, unmute };
}

export type Cinema = ReturnType<typeof useCinema>;

export function CinemaOverlay({ cinema }: { cinema: Cinema }) {
  const { phase, count, muted, active, videoRef, close, unmute } = cinema;
  const closeRef = useRef<HTMLButtonElement>(null);
  const shown = phase === "exit" || phase === "count" || phase === "play";

  useEffect(() => {
    if (phase === "exit") closeRef.current?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Freaky Mack Studios showreel"
      aria-hidden={!active}
      inert={!active}
      data-phase={phase}
      data-shown={shown}
      className={c.overlay}
    >
      <div className={c.black} />

      {phase === "count" && (
        <div className={c.leader} aria-live="assertive">
          <svg className={c.ring} viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="46" className={c.track} />
            <circle cx="50" cy="50" r="36" className={c.track} />
            <line x1="50" y1="0" x2="50" y2="100" className={c.cross} />
            <line x1="0" y1="50" x2="100" y2="50" className={c.cross} />
            <circle key={count} cx="50" cy="50" r="46" className={c.sweep} />
          </svg>
          <span key={count} className={c.num}>
            {count}
          </span>
          <p className={c.caption}>
            <span className={c.kicker}>Freaky Mack Studios</span>
            <span className={c.title}>The showreel</span>
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        className={c.video}
        data-on={phase === "play"}
        poster={REEL.full.poster}
        controls={phase === "play"}
        playsInline
        preload="none"
        controlsList="nodownload"
        aria-label="Freaky Mack Studios showreel"
        onEnded={close}
      >
        <FullReelSources />
      </video>

      {phase === "play" && muted && (
        <button type="button" onClick={unmute} className={c.sound}>
          Tap for sound
        </button>
      )}

      <button ref={closeRef} type="button" onClick={close} className={c.close} tabIndex={shown ? 0 : -1}>
        Close <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}
