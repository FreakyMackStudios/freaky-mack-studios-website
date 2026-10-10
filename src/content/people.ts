/** People board: the crew grid and collaborator roles. Names and roles come from the content form. */
const SHAPES = ["140px 140px 24px 24px", "24px", "24px 24px 140px 140px", "160px"];
const TONES = ["var(--surface-2)", "var(--surface-3)", "var(--surface-2)", "var(--surface-4)"];
const TILT = [-3, 2, -2, 4, 2, -3, 3, -2];
const LIFT = [0, 40, 0, 24, 32, 0, 40, 0];

/** Izaan (the founder) has his own section above the grid. The studio will add two more people later. */
const PEOPLE = [
  { name: "AB Rahim Shah", role: "Director & Chief Business Officer (CBO)" },
  { name: "Ashok Kumar Naik", role: "Director & Chief Operating Officer (COO)" },
  { name: "Tridip K Maity", role: "Editor" },
  { name: "Salan Lamare", role: "Cinematographer" },
];

export const CREW = PEOPLE.map((p, i) => ({
  ...p,
  shape: SHAPES[i % 4],
  tone: TONES[i % 4],
  tilt: TILT[i],
  lift: LIFT[i],
  highlight: i === 2, // the board fills the third crew tag with the accent
}));

/** The founder's bio (content form, section 8). */
export const FOUNDER_BIO = [
  "Izaan Khan is a filmmaker and director with over a decade of experience across fashion, advertising and visual storytelling. He has directed and created work for brands including McDonald’s, Google, Adidas Originals, Mercedes-Benz, Fila, Times of India and PC Jeweller, while working with leading names across the fashion and entertainment industry.",
  "As Founder and Producer at Freaky Mack Studios, Izaan leads the creative vision across commercials, fashion films, branded content and narrative projects, bringing together strong visual language, storytelling and production.",
];

export const COLLABORATORS: { label: string; tilt: number; style?: "accent" | "inverse" | "open" }[] = [
  { label: "Directors", tilt: -2 },
  { label: "Cinematographers", tilt: 1.5 },
  { label: "Producers", tilt: -1, style: "accent" },
  { label: "Editors", tilt: 2 },
  { label: "Colourists", tilt: -2.5 },
  { label: "Sound designers", tilt: 1 },
  { label: "Stylists", tilt: -1.5, style: "inverse" },
  { label: "Casting", tilt: 2 },
  { label: "+ you?", tilt: -1, style: "open" },
];
