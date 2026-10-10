import Image from "next/image";
import type { CSSProperties } from "react";
import type { Still as StillData } from "@/content/stills";

/**
 * A film still filling its box (the box sets size, radius and tilt through `className`/`style`).
 * Landscape frames cover the box. Vertical (9:16) frames are shown whole over a blurred copy of
 * themselves, so a phone-shot film isn't cropped to a sliver in a wide box; pass `portrait="cover"`
 * where the box is itself tall.
 */
export function Still({
  still,
  className = "",
  style,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  portrait = "contain",
}: {
  still: StillData;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  priority?: boolean;
  portrait?: "contain" | "cover";
}) {
  const tall = still.height > still.width;
  const contain = tall && portrait === "contain";
  return (
    <div className={`relative overflow-hidden bg-black ${className}`} style={style}>
      {contain && (
        <Image src={still.src} alt="" aria-hidden fill sizes={sizes} className="scale-125 object-cover opacity-60 blur-2xl" />
      )}
      <Image
        src={still.src}
        alt={still.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={contain ? "object-contain" : "object-cover"}
      />
    </div>
  );
}
