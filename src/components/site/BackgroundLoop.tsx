"use client";

import { useEffect, useState } from "react";

export type LoopFiles = { webm: string; mp4: string; poster: string };

/** Phones get the vertical cut; wider screens the landscape one. */
const WIDE = "(min-width: 768px)";

/**
 * A silent background video: muted, looping, inline, autoplaying, behind the content it sits under.
 * Wider screens play `wide` and phones play `tall`, each as WebM (smaller) then MP4 for Safari. Browsers that
 * ignore `media` on <source> take the first playable file (the wide one). The poster is a <picture> under
 * the video, so it also switches with the screen, and shows until the first frame is ready. With reduced
 * motion it doesn't autoplay; the first frame (the poster) stands still.
 */
export function BackgroundLoop({ wide, tall, className = "" }: { wide: LoopFiles; tall: LoopFiles; className?: string }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return (
    <>
      <picture>
        <source srcSet={wide.poster} media={WIDE} />
        <img src={tall.poster} alt="" aria-hidden="true" className={className} />
      </picture>
      <video className={className} muted loop playsInline autoPlay={!reduced} preload="auto" aria-hidden="true">
        <source src={wide.webm} type="video/webm" media={WIDE} />
        <source src={wide.mp4} type="video/mp4" media={WIDE} />
        <source src={tall.webm} type="video/webm" />
        <source src={tall.mp4} type="video/mp4" />
      </video>
    </>
  );
}
