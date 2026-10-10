/** Absolute site URL for metadata (Open Graph, sitemap). On Vercel the production domain is used automatically. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const CONTACT = {
  email: "freakymackstudios@gmail.com",
  phone: "+91 97115 42274",
  phoneHref: "tel:+919711542274",
  whatsapp: "https://wa.me/919711542274",
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

/** Social profiles. The client still owes the real handles, so these point at the platforms for now. */
export const SOCIAL = {
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  vimeo: "https://vimeo.com",
  linkedin: "https://linkedin.com",
  founderInstagram: "https://instagram.com",
  founderLinkedin: "https://linkedin.com",
};
