/**
 * Pitch-only UI: the floating theme / accent picker on the homepage.
 * Set NEXT_PUBLIC_PITCH_MODE=off (or make this false) once the client has locked in a look.
 */
export const PITCH_MODE = process.env.NEXT_PUBLIC_PITCH_MODE !== "off";

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
 * poster: a still from it. fullEmbedUrl: the full reel's YouTube/Vimeo/Stream embed URL, opened on click.
 */
export const REEL = {
  loopSrc: "/reel/reel-loop-720.mp4",
  loop: {
    sd: { webm: "/reel/reel-loop-720.webm", mp4: "/reel/reel-loop-720.mp4" },
    hd: { webm: "/reel/reel-loop-1080.webm", mp4: "/reel/reel-loop-1080.mp4" },
  },
  poster: "/reel/reel-poster.jpg",
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
