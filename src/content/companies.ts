/**
 * Sister companies (the /sister-companies page). Only what the studio has told us: name, what it does (when
 * given), its website and whether that site is live. `shot`: a screenshot of the live site's homepage, once
 * there is one (public/companies/); until then the card shows a designed thumbnail.
 */
export type Company = {
  key: "zellar" | "luxora";
  name: string;
  what?: string;
  status: "live" | "soon";
  url?: string;
  shot?: { src: string; width: number; height: number };
};

export const COMPANIES: Company[] = [
  {
    key: "zellar",
    name: "Zellar International",
    // The site's own title: "Zellar International - The Luxury Events Company".
    what: "The luxury events company",
    status: "live",
    url: "https://zellarinternational.com/",
  },
  {
    key: "luxora",
    name: "House of Luxora",
    what: "Luxury wedding organiser",
    status: "soon",
  },
];

/** The site address without "https://" and the trailing slash, for display. */
export const displayUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
