"use client";

import { useEffect, useState, type ReactNode } from "react";
import { REEL } from "./config";

const SD = "(max-width: 1599px)";

/**
 * Homepage loop: a muted, looping, inline autoplay <video> once REEL.loopSrc exists.
 * Until then it renders `children` (the board's [ 10–15 SEC LOOP ] placeholder).
 * The browser takes the first source it can play: WebM before MP4, 720p up to 1599px wide and 1080p above
 * (browsers that ignore `media` take the first playable 720p file).
 * With reduced motion it doesn't autoplay, so the poster still shows.
 */
export function ReelLoop({ className, children }: { className?: string; children: ReactNode }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  if (!REEL.loopSrc) return <>{children}</>;
  return (
    <video
      className={className}
      poster={REEL.poster || undefined}
      muted
      loop
      playsInline
      autoPlay={!reduced}
      preload="auto"
      aria-hidden="true"
    >
      <source src={REEL.loop.sd.webm} type="video/webm" media={SD} />
      <source src={REEL.loop.sd.mp4} type="video/mp4" media={SD} />
      <source src={REEL.loop.hd.webm} type="video/webm" />
      <source src={REEL.loop.hd.mp4} type="video/mp4" />
    </video>
  );
}

/** Full-reel embed (YouTube/Vimeo URL from REEL.fullEmbedUrl), or its placeholder until the link arrives. */
export function ReelEmbed({ className, placeholder }: { className?: string; placeholder: ReactNode }) {
  if (!REEL.fullEmbedUrl) return <>{placeholder}</>;
  return (
    <iframe
      className={className}
      src={REEL.fullEmbedUrl}
      title="Freaky Mack Studios showreel"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}
