"use client";

import { useState } from "react";
import type { Still as StillData } from "@/content/stills";
import { Still } from "./Still";
import s from "./site.module.css";

const TILT = [-1.6, 1.2, -0.8, 1.6, 1.2, -1.4, 0.8, -1];

/**
 * An endless left-to-right slideshow of photos, each whole in its own shape at one height, with a slight
 * alternating tilt. The set runs twice so the loop never shows a gap; the second run is hidden from
 * screen readers. Hover or focus pauses it, and so does its Pause button (moving content needs a way to stop).
 */
export function SetReel({ stills, label }: { stills: StillData[]; label: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="relative">
      <div
        className={`${s.reel} overflow-hidden py-[18px] [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]`}
        data-paused={paused}
      >
        <ul aria-label={label} className={`${s.reelTrack} m-0 list-none p-0`}>
          {[...stills, ...stills].map((st, i) => {
            const copy = i >= stills.length;
            return (
              <li
                key={`${st.src}-${i}`}
                aria-hidden={copy || undefined}
                data-copy={copy || undefined}
                className="h-[200px] shrink-0 md:h-[260px] lg:h-[340px]"
                style={{ aspectRatio: `${st.width} / ${st.height}` }}
              >
                <div className={s.still} style={{ transform: `rotate(${TILT[i % TILT.length]}deg)` }}>
                  <Still
                    still={copy ? { ...st, alt: "" } : st}
                    sizes="(min-width: 1024px) 460px, (min-width: 768px) 350px, 270px"
                    className="rounded-[14px] shadow-[0_18px_40px_rgba(0,0,0,0.18)] lg:rounded-[18px]"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        className="absolute right-5 -bottom-[44px] flex md:right-10 lg:right-[96px] h-[36px] cursor-pointer items-center gap-[8px] rounded-full border border-[var(--line-2)] bg-transparent px-[14px] text-[13px] font-semibold text-[var(--ink-2)] [font-family:inherit] motion-reduce:hidden"
      >
        <span aria-hidden="true">{paused ? "▶" : "❚❚"}</span>
        {paused ? "Play slideshow" : "Pause slideshow"}
      </button>
    </div>
  );
}
