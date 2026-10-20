/**
 * Each film's YouTube link, from the studio's "Videos_Links.xlsx" (Oct 2026). The project page plays the
 * film from YouTube, /work and the brand cloud link to it, and a film without its own stills uses the
 * video's YouTube thumbnail as its cover (src/content/projects.ts).
 *
 * Matched to the site's films by title. Where the sheet was ambiguous the pick is noted; films not listed
 * here have no link in the sheet.
 */
export const YOUTUBE_LINKS: Record<string, string> = {
  // Ad films
  "mcdonalds-veg-surprise": "https://youtu.be/WOgOhSZxrfg",
  "mcdonalds-chicken-mcwings": "https://youtu.be/-Qhrky4ojhw",
  "pc-jeweller-tvc": "https://youtu.be/5ipbxOaRezE",
  "jaldi-bidai": "https://youtu.be/5UkQaHWmi5o",
  "rock-it": "https://youtu.be/HThRnNgSOE0",
  "citta-moisturizing-baby-balm": "https://youtu.be/BXYSlNS4Ohs",
  ptron: "https://youtu.be/C6qfJ5-5CkM",
  // The sheet has two "Zypp Electric App" links: the first is this film, the second is "Film 02".
  "zypp-electric": "https://youtu.be/bNX-cA5DBhM",
  "zypp-electric-02": "https://youtu.be/mABUU0uFSIQ",
  "sexual-harassment-haryana": "https://youtu.be/jI8Cu-eStSA",
  "mercedes-benz-global-star": "https://youtu.be/nbpE1OmMjmU",
  // Sheet: "Ace Realty".
  "film-for-ace": "https://youtu.be/ra4O6TQOe1A",
  pkcc: "https://youtu.be/0zdCUsBoWPs",
  "sex-sorted": "https://youtu.be/utMzpIYwSqA",
  // Sheet: "Zykaz" (one link): taken to be Zykaz Cafe, the published Zykaz film.
  "zykaz-cafe": "https://youtu.be/oaxtZ556C8Y",
  // Sheet: three "Falaknama" Shorts, in the sheet's order.
  falaknama: "https://www.youtube.com/shorts/3ZjtAiODNF4",
  "falaknama-02": "https://www.youtube.com/shorts/iKEMRm3Cu8I",
  "falaknama-03": "https://www.youtube.com/shorts/sSbJNIvZC0c",
  // Corporate films
  "bharatbenz-dhingra-trucking": "https://youtu.be/a9OFkaLhtlg",
  "dbs-lifestyle": "https://youtu.be/rK-ii6mRMoU",
  // Event films
  "toifa-aftermovie": "https://youtu.be/3uGImWIEQjo",
  "noughtone-show": "https://www.youtube.com/shorts/lODsIaACoW0",
  "neeta-lulla-show": "https://youtu.be/ii-EsNFShMY",
  "times-power-women-awards": "https://youtu.be/i0r-s6Xkseo",
  "times-men-of-the-year": "https://youtu.be/JI03yVXZwHk",
  "india-fashion-awards": "https://youtu.be/sPjeU0buSIc",
  // Sheet: "SAWE Dubai Awards".
  "sawe-international-excellence-awards": "https://youtu.be/Z8FOlMKTQQw",
  "bombay-times-fashion-week": "https://youtu.be/o5BHaTJm8FA",
  // Fashion films
  // Sheet: "Albela Sajan".
  albela: "https://youtu.be/H-FayGeMV2g",
  // Sheet: "Shringaar I Harshita Gaur".
  "harshita-gaur": "https://www.youtube.com/shorts/4pFMtC8EwZs",
  noughtone: "https://youtu.be/TjYc0IAO-PM",
  "narendra-kumar": "https://youtu.be/Wqh0zOkoz94",
  // Short films
  "the-midnight-hour": "https://youtu.be/QzHHWbt3Sns",
  "happy-republic-day": "https://youtu.be/Tw0fpgazTH0",
  // Sheet: "Kaashi".
  kashi: "https://youtu.be/q2I-NpWcYNc",
  "nayi-soch-wali-azadi": "https://youtu.be/yyQQ7sf023c",
  // Trailers. "The Last Presence" has only a YouTube Studio (private) link in the sheet, so no public video yet.
  "s-and-s-trailer": "https://youtu.be/iEdKTvtTq-U",
  // Music videos. Sheet: "Changa Kara Feel".
  changa: "https://youtu.be/hnjOHZ5qeZI",
  "sang-tu-chalen": "https://youtu.be/33l91eEs1OI",
};

/** The video ID from a youtu.be, youtube.com/watch?v= or youtube.com/shorts/ link. */
export function youtubeId(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const m = url.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/)([\w-]{11})/);
  return m?.[1];
}
