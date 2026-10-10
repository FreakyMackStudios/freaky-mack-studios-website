"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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

/** True once the full reel has at least one file to play. */
export const HAS_FULL_REEL = REEL.full.hosts.length > 0 && !!(REEL.full.main || REEL.full.original);

/**
 * The complete showreel with the browser's own controls: play/pause, a draggable timeline to skim back and
 * forth, volume and fullscreen. Every file is listed from CloudFront and then from the S3 bucket, so if one
 * fails the browser moves on to the next. It starts with sound (the visitor just pressed play); if the browser
 * blocks that, the controls stay up and one tap plays it.
 */
export function FullReelPlayer({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    ref.current?.play().catch(() => {});
  }, []);
  return (
    <video
      ref={ref}
      className={className}
      poster={REEL.full.poster}
      controls
      playsInline
      preload="auto"
      controlsList="nodownload"
      aria-label="Freaky Mack Studios showreel"
    >
      <FullReelSources />
    </video>
  );
}

/** The full reel's <source> list: 720p on phones, then full quality, each from CloudFront then S3. */
export function FullReelSources() {
  const { hosts, mobile, main, original } = REEL.full;
  const at = (path: string) => hosts.map((h) => `${h}/${path}`);
  return (
    <>
      {mobile && at(mobile).map((src) => <source key={src} src={src} type="video/mp4" media="(max-width: 899px)" />)}
      {main && at(main).map((src) => <source key={src} src={src} type="video/mp4" />)}
      {original && at(original).map((src) => <source key={src} src={src} type="video/quicktime" />)}
    </>
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
