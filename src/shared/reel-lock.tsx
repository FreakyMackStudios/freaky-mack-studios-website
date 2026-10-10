"use client";

import { useEffect, useRef, useState } from "react";
import c from "./reel-lock.module.css";

/**
 * Full-screen reel helpers, shared by every player that takes over the screen.
 *
 * enterFullscreen(): call it inside the click that opens the reel (browsers only allow it from a click).
 * The whole page goes full screen and the player's fixed overlay fills it. Phones without the
 * Fullscreen API (iPhone) still get the overlay filling the window.
 */
export function enterFullscreen() {
  const el = document.documentElement;
  if (document.fullscreenElement || !el.requestFullscreen) return;
  el.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
}

const SCROLL_KEYS = new Set(["PageDown", "PageUp", "Home", "End", "ArrowDown", "ArrowUp", " "]);

/**
 * While `active`: the page can't scroll (wheel, touch and keyboard are held), each attempt bumps the
 * returned counter so the player can show its "close the reel" nudge, Escape or leaving full screen
 * calls `onClose`, and on the way out full screen is left.
 */
export function useReelLock(active: boolean, onClose: () => void) {
  const [nudges, setNudges] = useState(0);
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!active) return;
    const onClose = () => close.current();
    const html = document.documentElement;
    const body = document.body;
    // Where the visitor was. Going full screen resizes the window and the page re-flows underneath the
    // player, so on the way out they're put back exactly here.
    const scrollY = window.scrollY;
    const prev = [html.style.overflow, body.style.overflow, html.style.overscrollBehavior];
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";

    let last = 0;
    const nudge = () => {
      const now = Date.now();
      if (now - last < 350) return;
      last = now;
      setNudges((n) => n + 1);
    };
    const inVideo = (t: EventTarget | null) => t instanceof Element && !!t.closest("video");

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) > 2) nudge();
    };
    // Touch: a vertical swipe is a scroll attempt. Swipes on the video itself aren't cancelled, so its
    // timeline can still be dragged.
    let sx = 0;
    let sy = 0;
    const onTouchStart = (e: TouchEvent) => {
      sx = e.touches[0]?.clientX ?? 0;
      sy = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const dx = Math.abs(t.clientX - sx);
      const dy = Math.abs(t.clientY - sy);
      if (!inVideo(e.target)) e.preventDefault();
      if (dy > 14 && dy > dx * 1.2) nudge();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      const onControl = e.target instanceof Element && !!e.target.closest("video, button, input, a");
      if (SCROLL_KEYS.has(e.key) && !onControl) {
        e.preventDefault();
        nudge();
      }
    };
    const onFullscreen = () => {
      if (!document.fullscreenElement) onClose();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      [html.style.overflow, body.style.overflow, html.style.overscrollBehavior] = prev;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFullscreen);
      const restore = () => requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "instant" }));
      if (document.fullscreenElement) document.exitFullscreen().then(restore, restore);
      else restore();
    };
  }, [active]);

  return nudges;
}

/** The pop-up under the Close button, shown for a moment after each scroll attempt. */
export function ScrollNudge({ count, className = "" }: { count: number; className?: string }) {
  const [expired, setExpired] = useState(0);
  useEffect(() => {
    if (!count) return;
    const t = window.setTimeout(() => setExpired(count), 2600);
    return () => window.clearTimeout(t);
  }, [count]);
  return (
    <div role="status" aria-live="polite" className={`${c.wrap} ${className}`}>
      {count > 0 && expired !== count && (
        <p key={count} className={c.nudge}>
          Close the reel to keep scrolling
        </p>
      )}
    </div>
  );
}
