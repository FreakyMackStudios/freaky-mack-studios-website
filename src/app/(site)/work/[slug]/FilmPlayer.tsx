"use client";

import { useState, type CSSProperties } from "react";
import { Eq, PlayIcon } from "@/components/site/ui";
import { Still } from "@/components/site/Still";
import type { Still as StillData } from "@/content/stills";

const FRAME = "relative block overflow-hidden rounded-[20px] bg-[#0d0d0d] text-left text-white lg:rounded-[28px]";

/**
 * Project board film: play toggle (paused → big accent play button; playing → "Now playing" + equaliser).
 * The film's first still is the poster; without one, the board's [ FILM ] placeholder shows.
 */
export function FilmPlayer({ videoUrl, duration, poster, title }: { videoUrl: string; duration?: string; poster?: StillData; title?: string }) {
  const [playing, setPlaying] = useState(false);
  // The player takes the film's own shape (from its poster frame), so nothing is cropped. A vertical film
  // is capped at 80% of the window height and centred.
  const shape: CSSProperties = poster
    ? {
        aspectRatio: `${poster.width} / ${poster.height}`,
        width: poster.height > poster.width ? `min(100%, ${((80 * poster.width) / poster.height).toFixed(2)}vh)` : "100%",
        marginInline: "auto",
      }
    : { aspectRatio: "1248 / 702", width: "100%" };

  if (playing && videoUrl) {
    return (
      <div className={FRAME} style={shape}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`${videoUrl}${videoUrl.includes("?") ? "&" : "?"}autoplay=1`}
          title={title ? `${title} on YouTube` : "Film"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying((p) => !p)}
      aria-label={playing ? "Pause the film" : title ? `Play ${title}` : "Play the film"}
      aria-pressed={playing}
      className={`${FRAME} border-0 p-0`}
      style={shape}
    >
      {poster ? (
        <>
          <Still still={poster} fit="contain" sizes="100vw" priority className="absolute! inset-0" />
          <div aria-hidden="true" className="absolute inset-0 bg-black/25" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 55%, #2c2c2c 0%, #121212 55%, #0a0a0a 100%)" }}
          />
          <div className="absolute inset-[12px] flex items-center justify-center border border-dashed border-white/[0.18] text-center text-[11px] tracking-[0.22em] text-white/45 uppercase lg:inset-[24px] lg:text-[12px]">
            [ FILM — YOUTUBE / VIMEO EMBED ]
          </div>
        </>
      )}
      {playing ? (
        <div className="absolute bottom-[18px] left-[20px] flex items-center gap-[14px] text-[13px] font-medium lg:bottom-[36px] lg:left-[40px] lg:text-[14px]">
          <Eq height={18} />
          Now playing{duration ? ` · ${duration}` : ""}
        </div>
      ) : (
        <span className="absolute top-1/2 left-1/2 flex h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent)] lg:h-[104px] lg:w-[104px]">
          <PlayIcon size={22} className="lg:h-[28px] lg:w-[28px]" />
        </span>
      )}
    </button>
  );
}
