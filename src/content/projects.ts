/**
 * Portfolio (Work board renderVals + the Project case-study template).
 * Films, categories, runtimes and aspect ratios come from the studio's content library (FILE_STRUCTURE.md,
 * 27 Sep 2026); titles, clients, directors and cast are only what the file names state.
 * Every value in [brackets] is content the client still owes — keep it visible until it arrives.
 * `videoUrl`: a YouTube/Vimeo/Stream embed URL; empty shows the board's [ FILM ] placeholder.
 * `source`: the film's path in the content library, so each upload can be matched to its project.
 */
export type Category =
  | "Ad film"
  | "Music video"
  | "Fashion film"
  | "Event film"
  | "Corporate film"
  | "Govt. ad"
  | "Documentary"
  | "Short film";

export type Project = {
  slug: string;
  title: string;
  who: string;
  category: Category;
  year: string;
  bg: string;
  logline: string;
  videoUrl: string;
  duration: string;
  /** Frame shape of the master file, e.g. "16:9", "9:16" (vertical), "2.39:1". */
  aspect: string;
  source: string;
  brief: string;
  idea: string;
  onScreen: string;
  credits: { role: string; who: string }[];
  stills: { label: string; bg: string }[];
};

const CREDIT_ROLES = ["Client", "Agency", "Director", "Producer", "Director of photography", "Editor", "Colour", "Sound"];

const BGS = [
  "linear-gradient(160deg,#3a3a3a,#111)",
  "linear-gradient(200deg,#5a5a58,#1a1a1a)",
  "linear-gradient(140deg,#2a2a2a,#6a6a66)",
  "linear-gradient(220deg,#444,#0e0e0e)",
  "linear-gradient(120deg,#777773,#222)",
  "linear-gradient(180deg,#303030,#8a8a86)",
  "linear-gradient(150deg,#1a1a1a,#5a5a58)",
  "linear-gradient(210deg,#6a6a66,#141414)",
];

type Film = {
  slug: string;
  title: string;
  category: Category;
  duration: string;
  source: string;
  /** Client, brand or artist shown next to the title. */
  who?: string;
  year?: string;
  aspect?: string;
  /** Credits the file names confirm; every other role stays [Name]. */
  client?: string;
  director?: string;
  extra?: { role: string; who: string }[];
};

const film = (f: Film, i: number): Project => ({
  slug: f.slug,
  title: f.title,
  who: f.who ?? "[Client]",
  category: f.category,
  year: f.year ?? "[Year]",
  bg: BGS[i % BGS.length],
  logline: "[One-line logline — what the film is, in a sentence.]",
  videoUrl: "",
  duration: f.duration,
  aspect: f.aspect ?? "16:9",
  source: f.source,
  brief: "[Two or three lines on what the client needed and who it was for.]",
  idea: "[How we cracked it — the concept, the look, the one decision that made the film.]",
  onScreen: "[Where it ran and what happened — only real results, shared with the client’s permission.]",
  credits: CREDIT_ROLES.flatMap((role) => {
    const who = role === "Client" ? f.client : role === "Director" ? f.director : undefined;
    const row = { role, who: who ?? "[Name]" };
    return role === "Director" && f.extra ? [row, ...f.extra] : [row];
  }),
  stills: [
    { label: "[ STILL 01 — WIDE ]", bg: "linear-gradient(160deg,#4a4a48,#141414)" },
    { label: "[ STILL 02 ]", bg: "linear-gradient(200deg,#5a5a58,#1a1a1a)" },
    { label: "[ STILL 03 ]", bg: "linear-gradient(140deg,#2a2a2a,#6a6a66)" },
  ],
});

const IZAAN = "Izaan Khan";

/** Order = the order on /work (and the homepage shows the first six): headline work first, then by format. */
const FILMS: Film[] = [
  { slug: "mercedes-benz-global-star", title: "Mercedes-Benz Global Star", category: "Ad film", duration: "1:35", who: "Mercedes-Benz", client: "Mercedes-Benz", director: IZAAN, source: "Ad. Films/Mercedes-Benz Global Star  I  Directed by Izaan Khan - Freaky Mack (1080p, h264).mp4" },
  { slug: "changa", title: "Changa", category: "Music video", duration: "3:52", who: "Aghor × IKKA", client: "Big Bang Music", extra: [{ role: "Artists", who: "Aghor × IKKA, Ashock, Inflict" }], source: "Music Videos/Changa (Official Video) Aghor x IKKA  Ashock  Inflict  Latest HipHop Song  Big Bang Music - Big Bang Music (1080p, h264).mp4" },
  { slug: "pc-jeweller-tvc", title: "PC Jeweller TVC", category: "Ad film", duration: "1:14", who: "PC Jeweller", year: "2017", client: "PC Jeweller", extra: [{ role: "Cast", who: "Akshay Kumar & Twinkle Khanna" }], source: "Ad. Films/Ad. PC Jeweller TVC 2017 featuring Akshay Kumar & Twinkle Khanna - PCJeweller (1080p, h264).mp4" },
  { slug: "india-fashion-awards", title: "India Fashion Awards", category: "Event film", duration: "3:45", source: "Event Films/India Fashion Awards I Freaky Mack Productions - Freaky Mack (1080p, h264).mp4" },
  { slug: "albela", title: "Albela", category: "Fashion film", duration: "2:56", source: "Fashion Films/Albela_Final.m4v" },
  { slug: "mcdonalds-chicken-mcwings", title: "McDonald’s Chicken McWings", category: "Ad film", duration: "0:22", who: "McDonald’s India", client: "McDonald’s India", director: IZAAN, source: "Ad. Films/McDonalds_s Chicken McWings I Director Izaan Khan I Freaky Mack Production - Freaky Mack (1080p, h264).mp4" },
  { slug: "toifa-aftermovie", title: "TOIFA Aftermovie", category: "Event film", duration: "2:02", source: "Event Films/TOIFA_Aftermovie.mov" },
  { slug: "the-midnight-hour", title: "The Midnight Hour", category: "Short film", duration: "3:11", source: "Short Films/The Midnight Hour.mp4" },
  { slug: "dbs-lifestyle", title: "DBS Lifestyle", category: "Corporate film", duration: "4:08", who: "DBS Lifestyle", year: "2023", client: "DBS Lifestyle", source: "Corporate Videos/DBS Lifestyle  I  Corporate Film 2023  I  Freaky Mack Films - Freaky Mack (1080p, h264).mp4" },
  { slug: "rudraprayag", title: "Rudraprayag", category: "Documentary", duration: "3:47", source: "Documentaries/Renew_Rudraprayag.mov" },
  { slug: "rock-it", title: "Rock.it", category: "Ad film", duration: "1:44", who: "Rock.it", client: "Rock.it", director: IZAAN, aspect: "2.39:1", source: "Ad. Films/Rock.it  I  Directed by Izaan Khan  I  Freaky Mack Productions - Freaky Mack (1080p, h264).mp4" },
  { slug: "kashi", title: "Kashi", category: "Short film", duration: "4:29", source: "Short Films/Kashi_ColorGrade.m4v" },
  { slug: "pkcc", title: "PKCC", category: "Govt. ad", duration: "2:27", source: "Govt. Ads/PKCC FINAL_1080p.mp4" },

  // Ad films
  { slug: "citta-moisturizing-baby-balm", title: "CITTA Moisturizing Baby Balm", category: "Ad film", duration: "1:00", who: "CITTA", client: "CITTA", director: IZAAN, source: "Ad. Films/CITTA Moisturizing Baby Balm  I  Directed by Izaan Khan  I  TV Commercial - Freaky Mack (1080p, h264).mp4" },
  { slug: "zypp-electric", title: "Zypp Electric App", category: "Ad film", duration: "0:58", who: "Zypp Electric", client: "Zypp Electric", director: IZAAN, source: "Ad. Films/Zypp Electric App  I  Directed by Izaan Khan  I  Freaky Mack Production - Freaky Mack (1080p, h264).mp4" },
  { slug: "mcdonalds-veg-surprise", title: "McDonald’s Veg Surprise", category: "Ad film", duration: "0:30", who: "McDonald’s India", client: "McDonald’s India", source: "Ad. Films/McDonald_s India N&E I Veg Surprise is back! - McDonaldsinIndia (1080p, h264).mp4" },
  { slug: "ptron", title: "pTron", category: "Ad film", duration: "1:00", who: "pTron", client: "pTron", extra: [{ role: "Cast", who: "Aparshakti" }], source: "Ad. Films/p tron (aparshakti)_ FINAL FULL VIDEO.MP4" },
  { slug: "film-for-ace", title: "Film for Ace", category: "Ad film", duration: "1:11", source: "Ad. Films/Film for Ace.mp4" },
  { slug: "jaldi-bidai", title: "Jaldi Bidai", category: "Ad film", duration: "1:18", source: "Ad. Films/Jaldi Bidai_Film.mov.mp4" },
  { slug: "falaknama", title: "Falaknama — Film 01", category: "Ad film", duration: "0:39", aspect: "9:16", source: "Ad. Films/Falaknama_Couple-esv2-90p-bg-0p.MOV" },
  // Two more Falaknama cuts (client's note on the content form: "same as Falaknama").
  { slug: "falaknama-02", title: "Falaknama — Film 02", category: "Ad film", duration: "0:30", aspect: "9:16", source: "Ad. Films/VIDEO-2026-02-26-21-26-33 copy.mp4" },
  { slug: "falaknama-03", title: "Falaknama — Film 03", category: "Ad film", duration: "0:23", aspect: "9:16", source: "Ad. Films/VIDEO-2026-02-26-21-26-33.mp4" },
  { slug: "zykaz-cafe", title: "Zykaz Cafe", category: "Ad film", duration: "0:35", who: "Zykaz", client: "Zykaz", aspect: "4:3", source: "Ad. Films/Zykaz_Cafe_Square.mov.mp4" },
  { slug: "zykaz-interview", title: "Zykaz Interview", category: "Ad film", duration: "0:32", who: "Zykaz", client: "Zykaz", source: "Ad. Films/Zykaz_Interview_FinalCut.mov" },

  // Corporate films
  { slug: "bharatbenz-dhingra-trucking", title: "BharatBenz × Dhingra Trucking", category: "Corporate film", duration: "7:42", who: "Dhingra Trucking", client: "Dhingra Trucking", source: "Corporate Videos/Bharat Benz   Dhingra Trucking - DHINGRA TRUCKING (1080p, h264).mp4" },

  // Documentaries
  { slug: "soanbhadra", title: "Soanbhadra", category: "Documentary", duration: "9:45", source: "Documentaries/DA_Soanbhadra.mp4" },

  // Event films
  { slug: "bombay-times-fashion-week", title: "Bombay Times Fashion Week — Green Room", category: "Event film", duration: "3:13", who: "Bombay Times", year: "2020", client: "Bombay Times", source: "Event Films/Bombay Times Fashion Week  I  March 2020  I  Green Room  I  Film by Freaky Mack_720p.mp4" },
  { slug: "sawe-international-excellence-awards", title: "SAWE International Excellence Awards", category: "Event film", duration: "1:24", who: "SAWE", client: "SAWE", source: "Event Films/SAWE International Excellence Awards  I  Dubai  I  Creative Partner - Freaky Mack.mp4" },
  { slug: "noughtone-show", title: "NoughtOne Show", category: "Event film", duration: "0:54", who: "NoughtOne", client: "NoughtOne", aspect: "9:16", source: "Event Films/NoughtOne Show.mp4" },

  // Fashion films
  { slug: "pc-jeweller-sonalika-sahay", title: "PC Jeweller × Sonalika Sahay", category: "Fashion film", duration: "0:46", who: "PC Jeweller", client: "PC Jeweller", extra: [{ role: "Cast", who: "Sonalika Sahay" }], source: "Fashion Films/PC Jeweller  I  Sonalika Sahay  I  Freaky Mack - Advertising Agency - Freaky Mack (1080p, h264) (1).mp4" },
  { slug: "noughtone", title: "NoughtOne", category: "Fashion film", duration: "1:21", who: "NoughtOne", client: "NoughtOne", source: "Fashion Films/NoughtOne.mp4" },
  { slug: "harshita-gaur", title: "Harshita Gaur", category: "Fashion film", duration: "0:52", aspect: "9:16", extra: [{ role: "Cast", who: "Harshita Gaur" }], source: "Fashion Films/Film Harshita Gaur.mp4" },
  { slug: "fabindia-01", title: "Fabindia — Film 01", category: "Fashion film", duration: "1:00", who: "Fabindia", client: "Fabindia", source: "Fashion Films/Fabindia.mp4" },
  { slug: "fabindia-02", title: "Fabindia — Film 02", category: "Fashion film", duration: "0:58", who: "Fabindia", client: "Fabindia", source: "Fashion Films/Fabindia 2.mp4" },

  // Govt. ads
  { slug: "sex-sorted", title: "Sex Sorted", category: "Govt. ad", duration: "2:32", who: "Haryana Government", client: "Haryana Government", source: "Govt. Ads/SEX SORTED whats app file_1080p.mp4" },
  { slug: "sexual-harassment-haryana", title: "Sexual Harassment", category: "Govt. ad", duration: "2:49", who: "Haryana Government", client: "Haryana Government", aspect: "2.35:1", source: "Govt. Ads/Saxual Harrasment for Haryana Govt.mov" },
  { slug: "voting-campaign", title: "Voting Campaign", category: "Govt. ad", duration: "1:41", who: "Haryana Government", client: "Haryana Government", source: "Govt. Ads/Voting Campaign - Freaky Mack (480p, h264).mp4" },

  // Short films
  { slug: "happy-republic-day", title: "Happy Republic Day", category: "Short film", duration: "2:19", director: IZAAN, source: "Short Films/Happy Republic Day  I  Directed by Izaan Khan  I  Freaky Mack Productions - Freaky Mack (1080p, h264).mp4" },
  { slug: "nayi-soch-wali-azadi", title: "Nayi Soch Wali Azadi", category: "Short film", duration: "3:58", aspect: "4:3", source: "Short Films/Nayi Soch Wali Azadi_Final Cut.mp4" },
  { slug: "s-and-s-trailer", title: "S&S — Trailer", category: "Short film", duration: "1:00", source: "Short Films/S&S_Trailer.mov" },
  { slug: "tlp-teaser", title: "TLP — Teaser", category: "Short film", duration: "1:26", source: "Short Films/TLP_Teaser_Final.mp4" },
];

export const PROJECTS: Project[] = FILMS.map(film);

export const projectHref = (slug: string) => `/work/${slug}`;
export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
/** The project after this one (wraps around) — the "Next up" band. */
/** 1-based position in the list, for "Film 03 of 41". */
export const projectNumber = (slug: string) => PROJECTS.findIndex((p) => p.slug === slug) + 1;
export const nextProject = (slug: string) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
};

/** Work filter chips: category → chip label (Work board `labels`). */
export const FILTERS: { id: "All" | Category; label: string }[] = [
  { id: "All", label: "All work" },
  { id: "Ad film", label: "Ad films" },
  { id: "Music video", label: "Music videos" },
  { id: "Fashion film", label: "Fashion films" },
  { id: "Event film", label: "Event films" },
  { id: "Corporate film", label: "Corporate films" },
  { id: "Govt. ad", label: "Govt. ads" },
  { id: "Documentary", label: "Documentaries" },
  { id: "Short film", label: "Short films & series" },
];
