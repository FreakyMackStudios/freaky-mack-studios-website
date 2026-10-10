/** Studio board content: timeline, beliefs, services, process. (The client cloud is shared with the homepage: src/content/brands.ts.) */
export const TIMELINE = [
  { label: "Chapter 1", text: "Freaky Mack begins, making advertising films for brands.", h: 300, tilt: -1.5, tone: "surface" },
  { label: "Chapter 2", text: "McDonald’s, Google and Adidas Originals come on board.", h: 340, tilt: 1, tone: "surface" },
  { label: "Chapter 3", text: "Mercedes-Benz, Fila, PC Jewellers, Times of India — and many more.", h: 380, tilt: -0.8, tone: "inverse" },
  { label: "Chapter 4", text: "Freaky Mack Studios — originals, series, documentaries and a podcast, alongside the brand work.", h: 420, tilt: 1.6, tone: "accent" },
] as const;

export const BELIEFS = [
  { no: "01", title: "Precision", text: "Six years of commercial sets taught us discipline: on time, on brief, on brand." },
  { no: "02", title: "Appetite", text: "The creative ambition of independent cinema, brought to every brief we take on." },
  { no: "03", title: "Story", text: "A home for filmmakers, creators and ideas that deserve to become films." },
];

export const SERVICES = [
  { name: "Ad films", text: "Commercials and brand films for TV, digital and cinema." },
  { name: "Music videos", text: "For artists and labels, from concept to final cut." },
  { name: "Fashion films", text: "Campaign and lookbook films for fashion labels." },
  { name: "Event films", text: "Launches and events, captured and cut to last." },
  { name: "Documentaries", text: "Long-form stories for brands and cultural platforms." },
  { name: "Short films & web series", text: "Original narratives and digital series." },
  { name: "Podcast & YouTube", text: "Studio-produced episodes and channel content." },
  { name: "Post-production", text: "Edit, grade, sound and finishing." },
];

export const PROCESS = [
  { no: "01", title: "Development & direction", text: "Idea, treatment and script — the story before the camera rolls.", tilt: -1, lift: false },
  { no: "02", title: "Production", text: "Crew, camera and the discipline of commercial sets.", tilt: 1, lift: true },
  { no: "03", title: "Post-production", text: "Edit, grade, sound and delivery — cut for every platform.", tilt: -0.6, lift: false },
];
