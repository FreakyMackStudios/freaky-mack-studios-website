/** Originals board: the slate of our own films. (The podcast shows as "coming soon" until it launches.) */
export const SLATE = [
  { kind: "Short film", bg: "linear-gradient(160deg,#3a3a3a,#111)", tilt: -1.5, lift: false },
  { kind: "Web series", bg: "linear-gradient(200deg,#5a5a58,#1a1a1a)", tilt: 1.2, lift: true },
  { kind: "Documentary", bg: "linear-gradient(140deg,#2a2a2a,#6a6a66)", tilt: -0.6, lift: false },
].map((s) => ({
  ...s,
  title: "[Title]",
  logline: "[One-line logline.]",
  status: "[Status]",
  // The board links each slate card to a project page; until these films exist, send people to the work.
  href: "/work",
}));
