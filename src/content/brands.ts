/**
 * The homepage brand cloud ("…and the brands that trusted us with the yes"): the studio's headline clients
 * plus every client from the published films. `project` (a film slug) gives the brand a hover card with that
 * film's cover, linking to the film on YouTube (tablets and up). Brands without a published film are plain tags.
 * Phones show only the ten `major` brands, as plain tags.
 */
export type Brand = { name: string; project?: string; accent?: boolean; major?: boolean };

export const BRANDS: Brand[] = [
  { name: "McDonald’s", project: "mcdonalds-chicken-mcwings", major: true },
  { name: "Google", accent: true, major: true },
  { name: "Mercedes-Benz", project: "mercedes-benz-global-star", major: true },
  { name: "Adidas Originals", major: true },
  { name: "PC Jewellers", project: "pc-jeweller-tvc", major: true },
  { name: "Rock.it", project: "rock-it", accent: true, major: true },
  { name: "Fila", major: true },
  { name: "DBS Lifestyle", project: "dbs-lifestyle" },
  { name: "Times of India", major: true },
  { name: "Government of Haryana", project: "pkcc", major: true },
  { name: "CITTA", project: "citta-moisturizing-baby-balm" },
  { name: "Zypp Electric", project: "zypp-electric", accent: true },
  { name: "Fabindia", project: "fabindia-01", major: true },
  { name: "Ace Group", project: "film-for-ace" },
  { name: "Siddhidhata Ayurveda", project: "jaldi-bidai" },
  { name: "NoughtOne", project: "noughtone", accent: true },
  { name: "Falaknama", project: "falaknama-02" },
  { name: "Bombay Times", project: "bombay-times-fashion-week" },
  { name: "Zykaz Clothing", project: "zykaz-cafe" },
  { name: "SAWE Awards", project: "sawe-international-excellence-awards" },
];
