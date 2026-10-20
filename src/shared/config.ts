/** Absolute site URL for metadata (Open Graph, sitemap). On Vercel the production domain is used automatically. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const CONTACT = {
  email: "freakymackstudios@gmail.com",
  /** The studio's three numbers (content form, section 1), in the order given. */
  phones: [
    { label: "+91 80561 88076", href: "tel:+918056188076" },
    { label: "+91 88268 64052", href: "tel:+918826864052" },
    { label: "+91 97115 42274", href: "tel:+919711542274" },
  ],
  whatsappNumber: "+91 93184 65829",
  whatsapp: "https://wa.me/919318465829",
  /** "We'll be in touch within …" on Start a project and Thanks. */
  replyTime: "24 hours",
  /**
   * Where both enquiry forms send: the Google Apps Script web app that emails freakymackstudios@gmail.com
   * and saves a row in the Google Sheet on zellarinternational@gmail.com (setup:
   * docs/enquiry-form-google-sheet.md). Paste its
   * ".../exec" address here, or set NEXT_PUBLIC_ENQUIRY_ENDPOINT. It isn't secret: it ships in the page.
   * Empty: "Send it over" opens the visitor's email app with the enquiry filled in instead.
   */
  enquiryEndpoint:
    process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT ||
    "https://script.google.com/macros/s/AKfycbxMQOiT0qjLX2jbjlMRdNaEtNHGDPoQKpSOH0xWaazROUzB9Fw2vJj5P8bYvys4Vfod/exec",
};

/**
 * Analytics, loaded only after the visitor accepts in the cookie banner (src/components/site/CookieBanner.tsx).
 * gaId: the Google Analytics 4 measurement ID ("G-…", from GA → Admin → Data streams). Empty: Google
 * Analytics stays off. Vercel Analytics needs no ID; it's switched on in the Vercel project (Analytics tab).
 */
export const ANALYTICS = {
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
};

/**
 * Originals page: false shows "Coming soon" at /originals (kept out of search and the sitemap); true brings
 * back the full page (hero, podcast, slate, pitch), parked in src/app/(site)/originals/_components/OriginalsFull.tsx.
 */
export const ORIGINALS_LIVE = false;

/** The studio (content form, section 1). */
export const STUDIO = {
  name: "Freaky Mack Studios Pvt. Ltd.",
  address: ["1402, Arc One, Oshiwara", "Andheri West, Mumbai 400053"],
  /** Where the studio works, shown under the address in the footers ("India | UAE | France"). */
  locations: ["India", "UAE", "France"],
};

/**
 * Showreel media. Empty values show the board's [ PLACEHOLDER ] blocks instead.
 * loop: the silent homepage loop (FM_Showreel_15Sec_V_01, 14.75s, re-encoded without audio), as WebM (VP9,
 * smaller) with an MP4 (H.264) fallback, at 720p (≈ 1.8–2 MB) and 1080p for wide windows (≈ 3.1–3.9 MB).
 * poster: a still from it.
 * full: the complete showreel (1:30, sound on), opened from the card or the hero's "Press play". Served from
 * the studio's S3 bucket through CloudFront, with the bucket itself as the fallback. Sources are tried in
 * order: the 720p MP4 on phones, then the full-quality MP4 (the original's video and audio, losslessly
 * repackaged with the index at the front so it starts and seeks quickly). `original` (the source .mov) is
 * only a fallback for when the MP4s aren't uploaded; they are, so it stays empty.
 * fullEmbedUrl: a YouTube/Vimeo embed instead, only used when `full` has no files.
 */
export const REEL = {
  loopSrc: "/reel/reel-loop-720.mp4",
  loop: {
    sd: { webm: "/reel/reel-loop-720.webm", mp4: "/reel/reel-loop-720.mp4" },
    hd: { webm: "/reel/reel-loop-1080.webm", mp4: "/reel/reel-loop-1080.mp4" },
  },
  poster: "/reel/reel-poster.jpg",
  full: {
    hosts: ["https://d12r07g6j7a5zr.cloudfront.net", "https://freaky-media-website-d621b1.s3.us-east-1.amazonaws.com"],
    mobile: "showreel/Freaky-Mack_Showreel_Complete_Showreel_720p.mp4",
    main: "showreel/Freaky-Mack_Showreel_Complete_Showreel.mp4",
    original: "",
    poster: "/reel/full-poster.jpg",
  },
  fullEmbedUrl: "",
  /** Running time of the full reel (Freaky Mack_Showreel.mov). */
  duration: "1:30",
};

/** Social profiles from the content form. Vimeo and LinkedIn weren't given, so they aren't linked. */
export const SOCIAL = {
  instagram: "https://www.instagram.com/freakymackstudios/",
  youtube: "https://www.youtube.com/@FreakyMack",
  founderInstagram: "https://www.instagram.com/izaankhan.official/",
};
