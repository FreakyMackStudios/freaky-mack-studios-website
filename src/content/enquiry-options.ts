/**
 * The enquiry chip questions (Contact board renderVals, also the homepage sentence builder).
 * Ids are stable so the homepage can pre-fill /start-a-project?fmt=…&who=….
 */
export const FORMATS = [
  { id: "ad-film", phrase: "an ad film" },
  { id: "music-video", phrase: "a music video" },
  { id: "fashion-film", phrase: "a fashion film" },
  { id: "event-film", phrase: "an event film" },
  { id: "documentary", phrase: "a documentary" },
  { id: "short-film", phrase: "a short film" },
  { id: "web-series", phrase: "a web series" },
  { id: "podcast", phrase: "a podcast" },
] as const;

export const AUDIENCES = [
  { id: "brand", phrase: "a brand" },
  { id: "agency", phrase: "an agency" },
  { id: "music-label", phrase: "a music label" },
  { id: "fashion-label", phrase: "a fashion label" },
  { id: "face-on-screen", phrase: "a face on screen" },
] as const;

export const WHENS = [
  { id: "asap", label: "As soon as possible", phrase: "as soon as possible" },
  { id: "1-2-months", label: "In 1–2 months", phrase: "in the next month or two" },
  { id: "3-months", label: "In 3+ months", phrase: "in three months or more" },
  { id: "flexible", label: "Flexible", phrase: "whenever it’s right" },
] as const;

/** Chip label: the phrase without its article ("an ad film" → "ad film"). */
export const bare = (phrase: string) => phrase.replace(/^an? /, "");

/** Link to the enquiry page with chips pre-selected. */
export const startProjectHref = (fmt?: string, who?: string) => {
  const q = new URLSearchParams();
  if (fmt) q.set("fmt", fmt);
  if (who) q.set("who", who);
  const qs = q.toString();
  return `/start-a-project${qs ? `?${qs}` : ""}`;
};
