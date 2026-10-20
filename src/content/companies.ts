/**
 * Sister companies (the /sister-companies page). Only what the studio has told us: name, what it does (when
 * given), its website and whether that site is live. `shot`: a screenshot of the live site's homepage, once
 * there is one (public/companies/); until then the card shows a designed thumbnail. `listed: false` keeps a
 * company (and its card design) ready but off the page.
 */
export type Company = {
  key: "zellar" | "luxora";
  name: string;
  what?: string;
  status: "live" | "soon";
  url?: string;
  shot?: { src: string; width: number; height: number };
  listed: boolean;
};

export const COMPANIES: Company[] = [
  {
    key: "zellar",
    name: "Zellar International",
    // The site's own title: "Zellar International - The Luxury Events Company".
    what: "The luxury events company",
    status: "live",
    url: "https://zellarinternational.com/",
    // Its homepage at 1440×900 (Oct 2026).
    shot: { src: "/companies/zellar-international.webp", width: 1440, height: 900 },
    listed: true,
  },
  {
    key: "luxora",
    name: "House of Luxora",
    what: "Luxury wedding organiser",
    status: "soon",
    // Off the page for now (the studio's call, Oct 2026); set to true to show its "Coming soon" card again.
    listed: false,
  },
];

/** The companies shown on the page. */
export const LISTED = COMPANIES.filter((c) => c.listed);

/** The site address without "https://" and the trailing slash, for display. */
export const displayUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
