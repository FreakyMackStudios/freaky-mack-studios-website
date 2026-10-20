import type { Metadata } from "next";
import { ORIGINALS_LIVE } from "@/shared/config";
import { ComingSoon } from "./_components/ComingSoon";
import { OriginalsFull } from "./_components/OriginalsFull";

export const metadata: Metadata = ORIGINALS_LIVE
  ? {
      title: "Originals & podcast",
      description:
        "Short films, web series, documentaries and The Freaky Mack Podcast — the films Freaky Mack Studios makes for itself.",
      alternates: { canonical: "/originals" },
    }
  : {
      title: "Originals — coming soon",
      description: "Freaky Mack Studios’ own films and podcast are on their way.",
      alternates: { canonical: "/originals" },
      // Kept out of search results until the real page is up.
      robots: { index: false },
    };

/** /originals: "Coming soon" for now; the full page (OriginalsFull) once ORIGINALS_LIVE is on. */
export default function OriginalsPage() {
  return ORIGINALS_LIVE ? <OriginalsFull /> : <ComingSoon />;
}
