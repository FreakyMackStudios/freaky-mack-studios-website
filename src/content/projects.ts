/**
 * Portfolio (Work board renderVals + the Project case-study template).
 * Films, categories, runtimes and aspect ratios come from the studio's content library (FILE_STRUCTURE.md);
 * titles, clients, credits and descriptions come from the client's filled-in content form (Oct 2026).
 * Only what the studio has confirmed is listed: a missing field (year, logline, brief, a credit) is left
 * out and the page simply doesn't show it. Films the studio filled in completely carry all three story
 * sections; the copy expands their answers but sticks to the facts they gave.
 * `videoUrl`: the film's YouTube embed (from src/content/youtube.ts); empty shows the board's [ FILM ] placeholder.
 * `source`: the film's path in the content library, so each upload can be matched to its project.
 */
import { STILLS, type Still } from "./stills";
import { YOUTUBE_LINKS, youtubeId } from "./youtube";

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
  /** Client, brand or artist shown next to the title. */
  who?: string;
  category: Category;
  year?: string;
  bg: string;
  logline?: string;
  videoUrl: string;
  /** Running time, when known (films added from the YouTube links sheet don't have one yet). */
  duration?: string;
  /** Frame shape of the master file, e.g. "16:9", "9:16" (vertical), "2.39:1". */
  aspect: string;
  /** The film's path in the content library, when it has one. */
  source?: string;
  brief?: string;
  idea?: string;
  onScreen?: string;
  credits: { role: string; who: string }[];
  /**
   * Frames from the film (src/content/stills.ts); the first is the cover. A film without its own stills
   * uses its YouTube thumbnail as the cover (marked by `fallback`), and has no frames gallery.
   */
  stills: Still[];
  /**
   * On the site when it can be watched (it has a YouTube video), or when it has both stills and written
   * content; otherwise it's listed by name under "Publishing soon".
   */
  published: boolean;
  /** The film on YouTube (src/content/youtube.ts); YouTube's home page for films without a link yet. */
  youtube: string;
};

/** Placeholder for a film's YouTube link, until the real one is filled in per film (`youtube` below). */
export const YOUTUBE_PLACEHOLDER = "https://www.youtube.com/";

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

type Film = Omit<Project, "bg" | "videoUrl" | "aspect" | "credits" | "stills" | "published" | "youtube"> & {
  youtube?: string;
  aspect?: string;
  /** The studio left this film blank on the content form: only the file name is known, so no written content. */
  blank?: true;
  /** [role, name] pairs, in the order they show. */
  credits: [string, string][];
};

/**
 * A film's YouTube thumbnail as its cover. "maxresdefault" (1280×720) is the sharpest; YouTube serves a
 * small grey stand-in when a video has none, so `fallback` ("hqdefault", always there, letterboxed to 4:3
 * and trimmed back to 16:9 by the cover box) takes over then (src/components/site/Still.tsx).
 */
const youtubeCover = (id: string, title: string): Still => ({
  src: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  fallback: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  width: 1280,
  height: 720,
  alt: `${title}: the film’s YouTube thumbnail`,
});

/**
 * Project images are shown in film shapes only: 16:9, or 9:16 for vertical films. A frame of another shape
 * (cinemascope 2.39:1, 4:3…) fills that shape, centred, so its edges are trimmed (the studio's call, Oct
 * 2026: one clean grid over every frame shown whole).
 */
const filmShape = (st: Still): Still => (st.height > st.width ? { ...st, width: 1080, height: 1920 } : { ...st, width: 1920, height: 1080 });

const film = ({ blank, ...f }: Film, i: number): Project => {
  const link = f.youtube ?? YOUTUBE_LINKS[f.slug];
  const id = youtubeId(link);
  const own = STILLS[f.slug] ?? [];
  return {
    ...f,
    bg: BGS[i % BGS.length],
    // Played on the project page from YouTube (privacy-enhanced embed, no related videos from other channels).
    videoUrl: id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1` : "",
    aspect: f.aspect ?? "16:9",
    credits: f.credits.map(([role, who]) => ({ role, who })),
    stills: (own.length ? own : id ? [youtubeCover(id, f.title)] : []).map(filmShape),
    published: !!id || (own.length > 0 && !blank),
    youtube: link ?? YOUTUBE_PLACEHOLDER,
  };
};

// People who recur across the credits.
const IZAAN = "Izaan Khan";
const FM = "Freaky Mack";
const POST = "Post-production";
const DOP = "Director of photography";

// The Haryana Government campaign: the studio confirmed the same team made all four films.
const HARYANA: [string, string][] = [
  ["Client", "Government of Haryana"],
  ["Agency", FM],
  ["Director", IZAAN],
  ["Producer", "Sumedha Ganotra"],
  [DOP, "Shoeb Siddiqui"],
];
// Falaknama: three vertical cuts by one team.
const FALAKNAMA: [string, string][] = [
  ["Client", "Falaknama"],
  ["Agency", FM],
  ["Director", IZAAN],
  ["Producer", "Aqib Khan"],
  [DOP, "Afzal"],
  [POST, "Afzal"],
];
// Fabindia: two films by one team.
const FABINDIA: [string, string][] = [
  ["Client", "Fabindia"],
  ["Agency", FM],
  ["Director", IZAAN],
  ["Producer", "Sameer"],
  [DOP, "Damandeep Singh"],
  [POST, "Damandeep Singh"],
];

/**
 * Order = the order on /work. The homepage shows the first six: the studio's pick of McDonald's (both),
 * PC Jeweller, pTron, Rock.it and Changa.
 */
const FILMS: Film[] = [
  {
    slug: "mcdonalds-chicken-mcwings",
    title: "McDonald’s Chicken McWings",
    category: "Ad film",
    duration: "0:22",
    who: "McDonald’s India",
    logline: "A 22-second digital spot for McDonald’s India’s Chicken McWings, made with DDB Mudra.",
    brief:
      "McDonald’s India and its agency, DDB Mudra, needed a short film for the Chicken McWings campaign on digital: one that sells the product in the few seconds a feed gives you.",
    idea:
      "The idea came from the client; our job was to bring it to the screen. Izaan Khan directed and produced, Shoeb Siddiqui shot it, and the film was cut and finished in-house by Izaan with Sumedh Jagtap and Rahul.",
    onScreen: "Made for McDonald’s India’s digital campaign for Chicken McWings.",
    credits: [
      ["Client", "McDonald’s India"],
      ["Agency", "DDB Mudra"],
      ["Director", IZAAN],
      ["Producer", IZAAN],
      [DOP, "Shoeb Siddiqui"],
      [POST, "Izaan Khan, Sumedh Jagtap, Rahul"],
    ],
    source: "Ad. Films/McDonalds_s Chicken McWings I Director Izaan Khan I Freaky Mack Production - Freaky Mack (1080p, h264).mp4",
  },
  {
    slug: "mcdonalds-veg-surprise",
    title: "McDonald’s Veg Surprise",
    category: "Ad film",
    duration: "0:30",
    who: "McDonald’s India",
    logline: "Veg Surprise is back: a 30-second film for McDonald’s India announcing the burger’s return.",
    brief:
      "McDonald’s India was bringing the Veg Surprise burger back to its menu, and needed a film to announce its return.",
    idea:
      "Freaky Mack made it end to end as the agency. Izaan Khan directed, Asish Kumar Das was director of photography, and Atul Bhati and Sumedh Jagtap finished it in post: thirty seconds with one clear message.",
    onScreen: "Released by McDonald’s India (North & East) as “Veg Surprise is back!”",
    credits: [
      ["Client", "McDonald’s India"],
      ["Agency", FM],
      ["Director", IZAAN],
      [DOP, "Asish Kumar Das"],
      [POST, "Atul Bhati, Sumedh Jagtap"],
    ],
    source: "Ad. Films/McDonald_s India N&E I Veg Surprise is back! - McDonaldsinIndia (1080p, h264).mp4",
  },
  {
    slug: "pc-jeweller-tvc",
    title: "PC Jeweller TVC",
    category: "Ad film",
    duration: "1:14",
    who: "PC Jeweller",
    year: "2017",
    logline: "A 2017 TV commercial for PC Jeweller, directed by R Balki and starring Akshay Kumar and Twinkle Khanna.",
    credits: [
      ["Client", "PC Jeweller"],
      ["Director", "R Balki"],
      ["Cast", "Akshay Kumar & Twinkle Khanna"],
    ],
    source: "Ad. Films/Ad. PC Jeweller TVC 2017 featuring Akshay Kumar & Twinkle Khanna - PCJeweller (1080p, h264).mp4",
  },
  {
    slug: "ptron",
    title: "pTron",
    category: "Ad film",
    duration: "1:00",
    who: "pTron",
    logline: "A one-minute digital ad film for pTron, starring Aparshakti Khurana.",
    brief: "pTron, the Indian audio and accessories brand, wanted a digital ad film with a familiar face at its centre: actor Aparshakti Khurana.",
    idea:
      "Freaky Mack made it as the agency. Izaan Khan directed and Abhishek Patni produced, with Abhishek Mewati and Damandeep Singh behind the camera. Damandeep also cut and finished the film, keeping it to a tight sixty seconds.",
    onScreen: "Made for pTron’s digital channels.",
    credits: [
      ["Client", "pTron"],
      ["Agency", FM],
      ["Director", IZAAN],
      ["Cast", "Aparshakti Khurana"],
      ["Producer", "Abhishek Patni"],
      [DOP, "Abhishek Mewati & Damandeep Singh"],
      [POST, "Damandeep Singh"],
    ],
    source: "Ad. Films/p tron (aparshakti)_ FINAL FULL VIDEO.MP4",
  },
  {
    slug: "rock-it",
    title: "Rock.it",
    category: "Ad film",
    duration: "1:44",
    who: "Rock.it",
    aspect: "2.39:1",
    logline: "A digital ad film for Rock.it, shot in the 2.39:1 widescreen frame and directed by Izaan Khan.",
    brief: "Rock.it came to Freaky Mack for a digital ad film: a brand piece with the room to run 1 minute 44 seconds.",
    idea:
      "We framed it like cinema, in the 2.39:1 widescreen format usually kept for feature films. Izaan Khan directed, Shoeb Siddiqui shot it, Anant Yadav line-produced, and Izaan and Afzal cut and finished it.",
    onScreen: "Made for Rock.it’s digital channels.",
    credits: [
      ["Client", "Rock.it"],
      ["Director", IZAAN],
      ["Line producer", "Anant Yadav"],
      [DOP, "Shoeb Siddiqui"],
      [POST, "Izaan Khan & Afzal"],
    ],
    source: "Ad. Films/Rock.it  I  Directed by Izaan Khan  I  Freaky Mack Productions - Freaky Mack (1080p, h264).mp4",
  },
  {
    slug: "changa",
    blank: true,
    title: "Changa",
    category: "Music video",
    duration: "3:52",
    who: "Aghor × IKKA",
    logline: "The official music video for “Changa” by Aghor × IKKA, with Ashock and Inflict, released by Big Bang Music.",
    credits: [
      ["Label", "Big Bang Music"],
      ["Artists", "Aghor × IKKA, Ashock, Inflict"],
    ],
    source: "Music Videos/Changa (Official Video) Aghor x IKKA  Ashock  Inflict  Latest HipHop Song  Big Bang Music - Big Bang Music (1080p, h264).mp4",
  },
  {
    slug: "mercedes-benz-global-star",
    title: "Mercedes-Benz Global Star",
    category: "Ad film",
    duration: "1:35",
    who: "Mercedes-Benz",
    logline: "An ad film for Global Star, Mercedes-Benz, directed by Izaan Khan.",
    credits: [
      ["Client", "Global Star, Mercedes-Benz"],
      ["Director", IZAAN],
      [DOP, "Abhishek Mewati"],
      [POST, "Damandeep Singh"],
    ],
    source: "Ad. Films/Mercedes-Benz Global Star  I  Directed by Izaan Khan - Freaky Mack (1080p, h264).mp4",
  },
  {
    slug: "india-fashion-awards",
    title: "India Fashion Awards",
    category: "Event film",
    duration: "3:45",
    who: "FEF India Fashion Awards",
    logline: "The after-movie for the India Fashion Awards show.",
    credits: [
      ["Client", "FEF India Fashion Awards & Fashion Entrepreneur Fund"],
      [DOP, "Damandeep Singh"],
    ],
    source: "Event Films/India Fashion Awards I Freaky Mack Productions - Freaky Mack (1080p, h264).mp4",
  },
  {
    slug: "albela",
    title: "Albela",
    category: "Fashion film",
    duration: "2:56",
    who: "Albela Sajan",
    logline: "A fashion concept film made with stylist Chandan Kumar: collaborative, experimental and just under three minutes long.",
    brief: "Albela started as a collaboration: an experimental fashion film for Albela Sajan, made together with stylist Chandan Kumar.",
    idea:
      "The concept came from Chandan Kumar, who also styled the film. Izaan Khan directed and produced it, Abhishek Mewati shot it, and Izaan edited it into a 2:56 fashion film built around the styling.",
    onScreen: "Part of Freaky Mack’s fashion work, alongside films for Fabindia, NoughtOne and PC Jeweller.",
    credits: [
      ["Client", "Albela Sajan"],
      ["Agency", FM],
      ["Concept & styling", "Chandan Kumar"],
      ["Director", IZAAN],
      ["Producer", IZAAN],
      [DOP, "Abhishek Mewati"],
      [POST, IZAAN],
    ],
    source: "Fashion Films/Albela_Final.m4v",
  },
  {
    slug: "toifa-aftermovie",
    title: "TOIFA Aftermovie",
    category: "Event film",
    duration: "2:02",
    who: "Times of India",
    logline: "The event after-movie for the TOIFA OTT Awards.",
    credits: [
      ["Client", "Times of India"],
      ["Producer", "Zellar International"],
    ],
    source: "Event Films/TOIFA_Aftermovie.mov",
  },
  {
    slug: "the-midnight-hour",
    title: "The Midnight Hour",
    category: "Short film",
    duration: "3:11",
    who: "Freaky Mack original",
    logline: "An in-house short film made for Independence Day, 15 August.",
    brief: "No client on this one. The Midnight Hour is a Freaky Mack original, made in-house for India’s Independence Day.",
    idea: "Izaan Khan directed and produced it, and Afzal Siddiqui shot and edited it: a three-minute film made by a small team, start to finish.",
    onScreen: "Released by Freaky Mack for Independence Day.",
    credits: [
      ["Production", FM],
      ["Director", IZAAN],
      ["Producer", IZAAN],
      [DOP, "Afzal Siddiqui"],
      [POST, "Afzal Siddiqui"],
    ],
    source: "Short Films/The Midnight Hour.mp4",
  },
  {
    slug: "dbs-lifestyle",
    title: "DBS Lifestyle",
    category: "Corporate film",
    duration: "4:08",
    who: "DBS Lifestyle",
    year: "2023",
    logline: "A four-minute corporate film for DBS Lifestyle, made in 2023.",
    brief: "DBS Lifestyle needed a corporate film: a longer piece that presents the company and its work.",
    idea:
      "Izaan Khan directed, with Dipit Anand producing. Sandeep Khasariya both shot and edited the film, so the look and the cut stayed in one pair of hands from set to final delivery.",
    onScreen: "Delivered in 2023 as DBS Lifestyle’s corporate film.",
    credits: [
      ["Client", "DBS Lifestyle"],
      ["Director", IZAAN],
      ["Producer", "Dipit Anand"],
      [DOP, "Sandeep Khasariya"],
      [POST, "Sandeep Khasariya"],
    ],
    source: "Corporate Videos/DBS Lifestyle  I  Corporate Film 2023  I  Freaky Mack Films - Freaky Mack (1080p, h264).mp4",
  },
  {
    slug: "rudraprayag",
    title: "Rudraprayag",
    category: "Documentary",
    duration: "3:47",
    who: "Renew & Development Alternatives",
    logline: "A short documentary for Renew and Development Alternatives about their work with communities in rural India.",
    brief:
      "A short film on Development Alternatives and its work in rural India, empowering communities through sustainable livelihoods, employment and grassroots solutions.",
    idea:
      "Real people, real stories: the film shows how these efforts are creating meaningful change in people’s lives. Izaan Khan directed, and Sandeep Khasariya shot and edited it.",
    onScreen: "Made for Renew and Development Alternatives, and a companion to Soanbhadra, our longer documentary for Development Alternatives.",
    credits: [
      ["Client", "Renew & Development Alternatives"],
      ["Director", IZAAN],
      [DOP, "Sandeep Khasariya"],
      [POST, "Sandeep Khasariya"],
    ],
    source: "Documentaries/Renew_Rudraprayag.mov",
  },
  {
    slug: "kashi",
    title: "Kashi",
    category: "Short film",
    duration: "4:29",
    who: "Freaky Mack original",
    logline: "An experimental short film shot in Banaras.",
    brief: "Kashi is one of Freaky Mack’s own films: an experiment, shot in Banaras, the city also known as Kashi.",
    idea:
      "Abhishek Mewati directed and shot it, from a script he wrote with Izaan Khan, and Izaan edited the film. At four and a half minutes, it’s the longest of our own short films.",
    onScreen: "A Freaky Mack original short film.",
    credits: [
      ["Production", FM],
      ["Director", "Abhishek Mewati"],
      ["Writers", "Abhishek Mewati & Izaan Khan"],
      [DOP, "Abhishek Mewati"],
      [POST, IZAAN],
    ],
    source: "Short Films/Kashi_ColorGrade.m4v",
  },
  {
    slug: "pkcc",
    title: "PKCC",
    category: "Govt. ad",
    duration: "2:27",
    who: "Government of Haryana",
    logline: "A campaign film for the Government of Haryana’s PKCC (Pashu Kisan Credit Card) scheme.",
    brief: "The Government of Haryana commissioned a campaign film for its PKCC card scheme.",
    idea:
      "Freaky Mack made it as the agency. Izaan Khan directed, Sumedha Ganotra produced and Shoeb Siddiqui shot it: the same team behind all of our campaign films for Haryana.",
    onScreen: "One of four campaign films Freaky Mack has made for the Government of Haryana, alongside Sex Sorted, Sexual Harassment at Workplace and the Voting Campaign.",
    credits: HARYANA,
    source: "Govt. Ads/PKCC FINAL_1080p.mp4",
  },

  // Ad films
  {
    slug: "citta-moisturizing-baby-balm",
    title: "CITTA Moisturizing Baby Balm",
    category: "Ad film",
    duration: "1:00",
    who: "CITTA",
    logline: "A one-minute commercial for CITTA Moisturizing Baby Balm, directed by Izaan Khan.",
    brief: "CITTA needed a film for its Moisturizing Baby Balm, made to run as a TV commercial and as a digital ad.",
    idea: "Freaky Mack made it as the agency, with Izaan Khan directing, Anant Yadav as line producer and Kartik Sahani as director of photography.",
    onScreen: "Made as a TV commercial and digital ad for CITTA.",
    credits: [
      ["Client", "CITTA"],
      ["Agency", FM],
      ["Director", IZAAN],
      ["Line producer", "Anant Yadav"],
      [DOP, "Kartik Sahani"],
    ],
    source: "Ad. Films/CITTA Moisturizing Baby Balm  I  Directed by Izaan Khan  I  TV Commercial - Freaky Mack (1080p, h264).mp4",
  },
  {
    slug: "zypp-electric",
    title: "Zypp Electric App",
    category: "Ad film",
    duration: "0:58",
    who: "Zypp Electric",
    logline: "A digital ad film for the Zypp Electric app.",
    brief: "Zypp Electric, the electric-scooter platform, wanted a digital ad film for its app.",
    idea: "Freaky Mack made it as the agency. Izaan Khan directed, Tarun Kumar produced, and Abhishek Mewati both shot and edited it: 58 seconds, made for the feed.",
    onScreen: "Made for Zypp Electric’s digital channels.",
    credits: [
      ["Client", "Zypp Electric"],
      ["Agency", FM],
      ["Director", IZAAN],
      ["Producer", "Tarun Kumar"],
      [DOP, "Abhishek Mewati"],
      [POST, "Abhishek Mewati"],
    ],
    source: "Ad. Films/Zypp Electric App  I  Directed by Izaan Khan  I  Freaky Mack Production - Freaky Mack (1080p, h264).mp4",
  },
  {
    slug: "film-for-ace",
    title: "Film for Ace",
    category: "Ad film",
    duration: "1:11",
    who: "Ace Group",
    logline: "A digital ad film for Ace Group.",
    brief: "Ace Group came to Freaky Mack for a digital ad film.",
    idea: "This one was directed by Shekhar Ujjainwal, with Izaan Khan producing for Freaky Mack and Zaheer as director of photography.",
    onScreen: "Made for Ace Group’s digital channels.",
    credits: [
      ["Client", "Ace Group"],
      ["Agency", FM],
      ["Director", "Shekhar Ujjainwal"],
      ["Producer", IZAAN],
      [DOP, "Zaheer"],
    ],
    source: "Ad. Films/Film for Ace.mp4",
  },
  {
    slug: "jaldi-bidai",
    title: "Jaldi Bidai",
    category: "Ad film",
    duration: "1:18",
    who: "Siddhidhata Ayurveda",
    logline: "A digital ad film for Jaldi Bidai, from Siddhidhata Ayurveda.",
    brief: "Siddhidhata Ayurveda needed a digital ad film for Jaldi Bidai.",
    idea: "Freaky Mack made it as the agency. Izaan Khan directed and edited it, Anant Yadav was line producer, and Antonio was director of photography.",
    onScreen: "Made for Siddhidhata Ayurveda’s digital channels.",
    credits: [
      ["Client", "Siddhidhata Ayurveda"],
      ["Agency", FM],
      ["Director", IZAAN],
      ["Line producer", "Anant Yadav"],
      [DOP, "Antonio"],
      [POST, IZAAN],
    ],
    source: "Ad. Films/Jaldi Bidai_Film.mov.mp4",
  },
  {
    slug: "falaknama",
    title: "Falaknama — Film 01",
    category: "Ad film",
    duration: "0:39",
    who: "Falaknama",
    aspect: "9:16",
    logline: "A vertical digital ad film for Falaknama, the first of three.",
    brief: "Falaknama needed vertical films for digital. This is the first of three cuts Freaky Mack made for the brand.",
    idea: "Shot for the phone screen, in 9:16. Izaan Khan directed, Aqib Khan produced, and Afzal shot and edited all three films.",
    onScreen: "Made for vertical, mobile-first platforms, alongside Falaknama — Film 02 and Film 03.",
    credits: FALAKNAMA,
    source: "Ad. Films/Falaknama_Couple-esv2-90p-bg-0p.MOV",
  },
  {
    slug: "falaknama-02",
    title: "Falaknama — Film 02",
    category: "Ad film",
    duration: "0:30",
    who: "Falaknama",
    aspect: "9:16",
    logline: "A vertical digital ad film for Falaknama, the second of three.",
    credits: FALAKNAMA,
    source: "Ad. Films/VIDEO-2026-02-26-21-26-33 copy.mp4",
  },
  {
    slug: "falaknama-03",
    title: "Falaknama — Film 03",
    category: "Ad film",
    duration: "0:23",
    who: "Falaknama",
    aspect: "9:16",
    logline: "A vertical digital ad film for Falaknama, the third of three.",
    credits: FALAKNAMA,
    source: "Ad. Films/VIDEO-2026-02-26-21-26-33.mp4",
  },
  {
    slug: "zykaz-cafe",
    title: "Zykaz Cafe",
    category: "Ad film",
    duration: "0:35",
    who: "Zykaz Clothing",
    aspect: "4:3",
    logline: "A digital ad film for Zykaz Clothing.",
    credits: [
      ["Client", "Zykaz Clothing"],
      ["Agency", "Snapbox Studio"],
      ["Director", IZAAN],
      ["Producers", "Upkar Kaur & Jeet Singh"],
      [DOP, "Sandeep Khasariya"],
      [POST, IZAAN],
    ],
    source: "Ad. Films/Zykaz_Cafe_Square.mov.mp4",
  },
  {
    slug: "zykaz-interview",
    blank: true,
    title: "Zykaz Interview",
    category: "Ad film",
    duration: "0:32",
    who: "Zykaz Clothing",
    credits: [["Client", "Zykaz Clothing"]],
    source: "Ad. Films/Zykaz_Interview_FinalCut.mov",
  },

  // Corporate films
  {
    slug: "bharatbenz-dhingra-trucking",
    title: "BharatBenz × Dhingra Trucking",
    category: "Corporate film",
    duration: "7:42",
    who: "Dhingra Trucking",
    logline: "A long-form corporate film for Dhingra Trucking.",
    brief: "Dhingra Trucking needed a corporate film that tells its story at length. At 7 minutes 42 seconds, it’s one of the longest films on this site.",
    idea: "Freaky Mack made it as the agency. Izaan Khan directed and produced it, and Damandeep Singh shot and edited it.",
    onScreen: "Delivered as Dhingra Trucking’s corporate film.",
    credits: [
      ["Client", "Dhingra Trucking"],
      ["Agency", FM],
      ["Director", IZAAN],
      ["Producer", IZAAN],
      [DOP, "Damandeep Singh"],
      [POST, "Damandeep Singh"],
    ],
    source: "Corporate Videos/Bharat Benz   Dhingra Trucking - DHINGRA TRUCKING (1080p, h264).mp4",
  },

  // Documentaries
  {
    slug: "soanbhadra",
    title: "Soanbhadra",
    category: "Documentary",
    duration: "9:45",
    who: "Development Alternatives",
    logline: "A documentary for Development Alternatives. At 9:45, it’s the longest film on this site.",
    brief:
      "Development Alternatives works with rural communities across India on sustainable livelihoods, employment and grassroots solutions. It commissioned a documentary on that work.",
    idea:
      "Izaan Khan directed, with Ekta and Mallika producing. Afzal and Abhishek Mewati shared the camera, and Afzal and Izaan edited nearly ten minutes of film.",
    onScreen: "Made for Development Alternatives, and a companion to Rudraprayag, our shorter film for Renew and Development Alternatives.",
    credits: [
      ["Client", "Development Alternatives"],
      ["Agency", FM],
      ["Director", IZAAN],
      ["Producers", "Ekta & Mallika"],
      [DOP, "Afzal & Abhishek Mewati"],
      [POST, "Afzal & Izaan Khan"],
    ],
    source: "Documentaries/DA_Soanbhadra.mp4",
  },

  // Event films
  {
    slug: "bombay-times-fashion-week",
    title: "Bombay Times Fashion Week — Green Room",
    category: "Event film",
    duration: "3:13",
    who: "Bombay Times",
    year: "2020",
    logline: "A fashion week after-movie from the green room of Bombay Times Fashion Week, March 2020.",
    credits: [
      ["Client", "Bombay Times"],
      ["Agency", FM],
    ],
    source: "Event Films/Bombay Times Fashion Week  I  March 2020  I  Green Room  I  Film by Freaky Mack_720p.mp4",
  },
  {
    slug: "sawe-international-excellence-awards",
    title: "SAWE International Excellence Awards",
    category: "Event film",
    duration: "1:24",
    who: "SAWE",
    logline: "The after-movie for the SAWE International Excellence Awards in Dubai, with Freaky Mack as creative partner.",
    credits: [
      ["Client", "SAWE Awards, Dubai"],
      ["Creative partner", FM],
    ],
    source: "Event Films/SAWE International Excellence Awards  I  Dubai  I  Creative Partner - Freaky Mack.mp4",
  },
  {
    slug: "noughtone-show",
    title: "NoughtOne Show",
    category: "Event film",
    duration: "0:54",
    who: "NoughtOne",
    aspect: "9:16",
    logline: "A fashion show after-movie for NoughtOne.",
    credits: [["Client", "NoughtOne"]],
    source: "Event Films/NoughtOne Show.mp4",
  },

  // Fashion films
  {
    slug: "pc-jeweller-sonalika-sahay",
    blank: true,
    title: "PC Jeweller × Sonalika Sahay",
    category: "Fashion film",
    duration: "0:46",
    who: "PC Jeweller",
    logline: "A fashion film for PC Jeweller with Sonalika Sahay.",
    credits: [
      ["Client", "PC Jeweller"],
      ["Cast", "Sonalika Sahay"],
    ],
    source: "Fashion Films/PC Jeweller  I  Sonalika Sahay  I  Freaky Mack - Advertising Agency - Freaky Mack (1080p, h264) (1).mp4",
  },
  {
    slug: "noughtone",
    title: "NoughtOne",
    category: "Fashion film",
    duration: "1:21",
    who: "NoughtOne",
    logline: "A fashion film for NoughtOne.",
    brief: "NoughtOne came to Freaky Mack for a fashion film for the label.",
    idea: "Izaan Khan directed, Devesh Patni produced, and Afzal shot and edited the 1:21 film.",
    onScreen:
      "One of two films for NoughtOne, with the NoughtOne Show after-movie. In the words of NoughtOne’s Abhishek Patni, Freaky Mack is “a highly reliable partner for any fashion brand.”",
    credits: [
      ["Client", "NoughtOne"],
      ["Director", IZAAN],
      ["Producer", "Devesh Patni"],
      [DOP, "Afzal"],
      [POST, "Afzal"],
    ],
    source: "Fashion Films/NoughtOne.mp4",
  },
  {
    slug: "harshita-gaur",
    title: "Harshita Gaur",
    category: "Fashion film",
    duration: "0:52",
    who: "Freaky Mack original",
    aspect: "9:16",
    logline: "An experimental vertical fashion film starring actor Harshita Gaur.",
    brief: "A Freaky Mack fashion experiment, written and directed by Izaan Khan, with Harshita Gaur in front of the camera.",
    idea: "Made in 9:16 for the phone screen. Chandan Kumar produced, Sandeep Khasariya shot it, and Izaan edited it down to 52 seconds.",
    onScreen: "A Freaky Mack fashion film, made vertical for social.",
    credits: [
      ["Agency", FM],
      ["Writer & director", IZAAN],
      ["Cast", "Harshita Gaur"],
      ["Producer", "Chandan Kumar"],
      [DOP, "Sandeep Khasariya"],
      [POST, IZAAN],
    ],
    source: "Fashion Films/Film Harshita Gaur.mp4",
  },
  {
    slug: "fabindia-01",
    title: "Fabindia — Film 01",
    category: "Fashion film",
    duration: "1:00",
    who: "Fabindia",
    logline: "A fashion film for Fabindia, the first of two.",
    credits: FABINDIA,
    source: "Fashion Films/Fabindia.mp4",
  },
  {
    slug: "fabindia-02",
    title: "Fabindia — Film 02",
    category: "Fashion film",
    duration: "0:58",
    who: "Fabindia",
    logline: "A fashion film for Fabindia, the second of two.",
    credits: FABINDIA,
    source: "Fashion Films/Fabindia 2.mp4",
  },

  // Govt. ads
  {
    slug: "sex-sorted",
    title: "Sex Sorted",
    category: "Govt. ad",
    duration: "2:32",
    who: "Government of Haryana",
    logline: "A campaign film for the Government of Haryana.",
    credits: HARYANA,
    source: "Govt. Ads/SEX SORTED whats app file_1080p.mp4",
  },
  {
    slug: "sexual-harassment-haryana",
    title: "Sexual Harassment at Workplace",
    category: "Govt. ad",
    duration: "2:49",
    who: "Government of Haryana",
    aspect: "2.35:1",
    logline: "A campaign film for the Government of Haryana on sexual harassment at the workplace.",
    credits: HARYANA,
    source: "Govt. Ads/Saxual Harrasment for Haryana Govt.mov",
  },
  {
    slug: "voting-campaign",
    title: "Voting Campaign",
    category: "Govt. ad",
    duration: "1:41",
    who: "Government of Haryana",
    logline: "A campaign film for the Government of Haryana, encouraging people to vote.",
    credits: HARYANA,
    source: "Govt. Ads/Voting Campaign - Freaky Mack (480p, h264).mp4",
  },

  // Short films
  {
    slug: "happy-republic-day",
    title: "Happy Republic Day",
    category: "Short film",
    duration: "2:19",
    who: "Freaky Mack original",
    logline: "An experimental short film made for Republic Day.",
    brief: "Our own film for Republic Day, 26 January: written and directed by Izaan Khan as a Freaky Mack original.",
    idea: "Anant Yadav line-produced, and Afzal Siddiqui shot and edited the film, keeping it to 2 minutes 19 seconds.",
    onScreen: "Released by Freaky Mack for Republic Day.",
    credits: [
      ["Production", FM],
      ["Writer & director", IZAAN],
      ["Line producer", "Anant Yadav"],
      [DOP, "Afzal Siddiqui"],
      [POST, "Afzal Siddiqui"],
    ],
    source: "Short Films/Happy Republic Day  I  Directed by Izaan Khan  I  Freaky Mack Productions - Freaky Mack (1080p, h264).mp4",
  },
  {
    slug: "nayi-soch-wali-azadi",
    title: "Nayi Soch Wali Azadi",
    category: "Short film",
    duration: "3:58",
    who: "Freaky Mack original",
    aspect: "4:3",
    logline: "An experimental short film made for Republic Day.",
    credits: [
      ["Production", FM],
      ["Writer & director", IZAAN],
      ["Line producer", "Anant Yadav"],
      [DOP, "Abhishek Mewati"],
      [POST, IZAAN],
    ],
    source: "Short Films/Nayi Soch Wali Azadi_Final Cut.mp4",
  },
  {
    slug: "s-and-s-trailer",
    title: "Shadows & Spark — Trailer",
    category: "Short film",
    duration: "1:00",
    who: "Freaky Mack original",
    logline: "The trailer for Shadows & Spark, an upcoming Freaky Mack short film.",
    brief: "Shadows & Spark is one of our own films, made by Freaky Mack as the production house rather than for a client.",
    idea: "Izaan Khan directs and Anuj Arora produces, with Abhishek Mewati as director of photography and Izaan Khan and Sumedh Jagtap in the edit.",
    onScreen: "The film is on its way. This trailer is the first look.",
    credits: [
      ["Production", FM],
      ["Director", IZAAN],
      ["Producer", "Anuj Arora"],
      [DOP, "Abhishek Mewati"],
      [POST, "Izaan Khan, Sumedh Jagtap"],
    ],
    source: "Short Films/S&S_Trailer.mov",
  },
  {
    slug: "tlp-teaser",
    title: "The Last Presence — Teaser",
    category: "Short film",
    duration: "1:26",
    who: "Freaky Mack original",
    logline: "The teaser for The Last Presence, an upcoming Freaky Mack short film.",
    brief: "The Last Presence is an upcoming short film from Freaky Mack, made in-house with Freaky Mack as the production house.",
    idea: "Izaan Khan is directing, producing and editing the film himself.",
    onScreen: "Coming soon. This teaser is the first look.",
    credits: [
      ["Production", FM],
      ["Director", IZAAN],
      ["Producer", IZAAN],
      [POST, IZAAN],
    ],
    source: "Short Films/TLP_Teaser_Final.mp4",
  },
  // Added from the studio's video links sheet (Oct 2026): only the title, the format and the film on
  // YouTube so far, so their pages show the film and nothing else until the studio sends more.
  { slug: "zypp-electric-02", title: "Zypp Electric App — Film 02", who: "Zypp Electric", category: "Ad film", credits: [["Client", "Zypp Electric"]] },
  { slug: "neeta-lulla-show", title: "Neeta Lulla Show", category: "Event film", credits: [] },
  { slug: "times-power-women-awards", title: "Times Power Women Awards", category: "Event film", credits: [] },
  { slug: "times-men-of-the-year", title: "Times Men of the Year", category: "Event film", credits: [] },
  { slug: "narendra-kumar", title: "Narendra Kumar", category: "Fashion film", credits: [] },
  { slug: "sang-tu-chalen", title: "Sang Tu Chalen", category: "Music video", credits: [] },
];

const ALL_PROJECTS: Project[] = FILMS.map(film);
/**
 * The films on the site: those with a YouTube video, plus those with both stills and written content.
 * Their pages, the Work grid, the homepage six, "Film 03 of N" and Next up all use this list.
 */
export const PROJECTS: Project[] = ALL_PROJECTS.filter((p) => p.published);
/** Everything else waits, shown on /work by name only under "Publishing soon". */
export const PUBLISHING_SOON = ALL_PROJECTS.filter((p) => !p.published).map(({ slug, title, category }) => ({ slug, title, category }));

export const projectHref = (slug: string) => `/work/${slug}`;
/** "Client · Year" (or whichever of the two the studio confirmed). */
export const whoAndYear = (p: Project) => [p.who, p.year].filter(Boolean).join(" · ");
export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
/** The project after this one (wraps around) — the "Next up" band. */
/** 1-based position in the list, for "Film 03 of 41". */
export const projectNumber = (slug: string) => PROJECTS.findIndex((p) => p.slug === slug) + 1;
export const nextProject = (slug: string) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
};

/** Work filter chips: category → chip label (Work board `labels`). */
const ALL_FILTERS: { id: "All" | Category; label: string }[] = [
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
/** Only the formats that have a published film. */
export const FILTERS = ALL_FILTERS.filter((f) => f.id === "All" || PROJECTS.some((p) => p.category === f.id));
