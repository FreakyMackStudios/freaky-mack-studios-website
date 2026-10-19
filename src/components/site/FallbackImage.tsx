"use client";

import Image from "next/image";
import { useState, type ComponentProps } from "react";

/**
 * An image with a stand-by: if `src` fails, or turns out to be YouTube's tiny grey "no thumbnail" image
 * (120×90), it switches to `fallback`. Used for YouTube thumbnail covers (src/content/projects.ts).
 */
export function FallbackImage({ src, fallback, alt, ...rest }: ComponentProps<typeof Image> & { src: string; fallback: string }) {
  const [current, setCurrent] = useState(src);
  const swap = () => setCurrent((c) => (c === fallback ? c : fallback));
  return (
    <Image
      {...rest}
      alt={alt}
      src={current}
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth <= 120) swap();
      }}
      onError={swap}
    />
  );
}
