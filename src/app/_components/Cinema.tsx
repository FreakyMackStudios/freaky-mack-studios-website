"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { REEL } from "@/shared/config";
import { FullReelSources } from "@/shared/reel";
import { ScrollNudge, enterFullscreen, useReelLock } from "@/shared/reel-lock";
import c from "./cinema.module.css";

/**
 * TEST FEATURE: "Press play" cinema intro.
 * The hero text fades, the first-screen elements slide off left and right, the screen goes black,
 * a 3-2-1 film-leader countdown runs (with beeps) and the complete showreel plays full screen.
 * Close (✕ or Escape) or the reel ending reverses it.
 *
 * idle → exit (elements leave, black fades in) → count (3, 2, 1) → play → return → idle
 */
export type CinemaPhase = "idle" | "exit" | "count" | "play" | "return";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Countdown beeps (film-leader style): a short tone on 3 and 2, a higher, longer one on 1. */
const BEEP = { 3: [880, 0.16], 2: [880, 0.16], 1: [1760, 0.32] } as const;

function beep(ctx: AudioContext | null, freq: number, dur: number) {
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.18, t + 0.008);
  gain.gain.setValueAtTime(0.18, t + dur - 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export function useCinema() {
  const [phase, setPhase] = useState<CinemaPhase>("idle");
  const [count, setCount] = useState(3);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const active = phase !== "idle";

  const start = useCallback(() => {
    if (phase !== "idle") return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    enterFullscreen();
    // While we still hold the click, unlock playback with sound (iOS asks per element) and start
    // buffering, so the reel is ready when the countdown ends.
    const v = videoRef.current;
    if (v) {
      v.preload = "auto";
      v.muted = false;
      v.play().catch(() => {});
      v.pause();
    }
    // The beeps need an audio context started from the click too.
    try {
      audio.current ??= new AudioContext();
      audio.current.resume().catch(() => {});
    } catch {
      audio.current = null;
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

  // Beep on each number.
  useEffect(() => {
    if (phase !== "count") return;
    const [freq, dur] = BEEP[count as 1 | 2 | 3];
    beep(audio.current, freq, dur);
  }, [phase, count]);

  useEffect(() => () => void audio.current?.close().catch(() => {}), []);

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

  // While it runs: full screen, no page scroll (each attempt nudges), Escape or leaving full screen
  // closes. Afterwards focus goes back to "Press play".
  const nudges = useReelLock(phase === "exit" || phase === "count" || phase === "play", close);
  useEffect(() => {
    if (active) return;
    returnFocus.current?.focus({ preventScroll: true });
    returnFocus.current = null;
  }, [active]);

  return { phase, count, muted, active, nudges, videoRef, start, close, unmute };
}

export type Cinema = ReturnType<typeof useCinema>;

export function CinemaOverlay({ cinema }: { cinema: Cinema }) {
  const { phase, count, muted, active, nudges, videoRef, close, unmute } = cinema;
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
      <ScrollNudge count={nudges} />
    </div>
  );
}
