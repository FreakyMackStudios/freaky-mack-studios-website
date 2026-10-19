import Image from "next/image";
import { FallbackImage } from "./FallbackImage";
import type { CSSProperties, ReactNode } from "react";
import type { Still as StillData } from "@/content/stills";

/** A still's shape as a CSS aspect-ratio, e.g. "1920 / 1080". */
export const ratioOf = (s: StillData) => `${s.width} / ${s.height}`;
export const isTall = (s: StillData) => s.height > s.width;

/**
 * A film still.
 *
 * - `fit="natural"` (default): the box takes the shape given by the still's width and height, and the frame
 *   fills it. For a photo that is its own shape (shown whole); project frames are given 16:9 or 9:16
 *   (src/content/projects.ts), so a frame of another shape fills that box, centred. `className` sets width, radius and tilt, not height.
 *   `maxVh` caps how tall it gets (tall frames shrink in width and centre, keeping their shape).
 * - `fit="contain"`: for a box whose size is fixed elsewhere: the whole frame shows, centred, over a
 *   blurred copy of itself that fills the rest.
 */
export function Still({
  still,
  className = "",
  style,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  fit = "natural",
  maxVh,
  children,
}: {
  still: StillData;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  priority?: boolean;
  fit?: "natural" | "contain";
  maxVh?: number;
  children?: ReactNode;
}) {
  const natural = fit === "natural";
  const box: CSSProperties = natural
    ? {
        aspectRatio: ratioOf(still),
        ...(maxVh ? { width: `min(100%, ${((maxVh * still.width) / still.height).toFixed(2)}vh)`, marginInline: "auto" } : {}),
        ...style,
      }
    : { ...style };
  return (
    <div className={`relative overflow-hidden bg-black ${natural && !maxVh ? "w-full" : ""} ${className}`} style={box}>
      {!natural && (
        <Image src={still.src} alt="" aria-hidden fill sizes={sizes} className="scale-125 object-cover opacity-60 blur-2xl" />
      )}
      {still.fallback ? (
        // A YouTube thumbnail cover: falls back to the always-present smaller thumbnail when needed.
        <FallbackImage src={still.src} fallback={still.fallback} alt={still.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <Image src={still.src} alt={still.alt} fill sizes={sizes} priority={priority} className={natural ? "object-cover" : "object-contain"} />
      )}
      {children}
    </div>
  );
}
