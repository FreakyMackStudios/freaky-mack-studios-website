/**
 * Client testimonials on the homepage, shown as a row of equal cards you can scroll through.
 * Only real quotes, in the words the client sent, used with their permission. `role` and `brand` are
 * optional: leave them out rather than guess.
 *
 * `photo`: a square headshot (at least 240px) in public/testimonials/. Only use a photo the person (or
 * their team) has provided or approved, or one with a licence that allows it. Without one, the card
 * shows their initials.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  brand?: string;
  photo?: { src: string; alt: string };
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Freaky Mack Productions is a one-stop solution for premium fashion photography and films, offering tailor-made packages with exceptional attention to detail. Their talented team consistently delivers high-quality content on time, making them a highly reliable partner for any fashion brand.",
    name: "Abhishek Patni",
    brand: "NoughtOne",
  },
  {
    quote:
      "A good team makes all the difference on set, and Freaky Mack understands that. The atmosphere was comfortable, the crew was well prepared, and everyone knew their role. It was a pleasure working with a team that combines creativity with such a professional approach.",
    name: "Rajpal Yadav",
    role: "Actor",
  },
  {
    quote:
      "What I really appreciate about Freaky Mack is how involved they are in the entire process. They don’t just execute a brief; they understand the idea behind it and work towards making it better. The team is creative, professional, and genuinely invested in the final film.",
    name: "Mallika Ghoshal",
    brand: "Development Alternatives",
  },
  {
    quote:
      "Freaky Mack is a team that understands the balance between creative ambition and professional execution. The communication was clear, the shoot was well organised, and everyone was focused on making the film the best it could be. I’d be happy to work with them again.",
    name: "Prabhsimran Singh",
    role: "Cricketer",
  },
  {
    quote:
      "Freaky Mack has a good understanding of what brands need from a film. They balance creativity with the practical requirements of a campaign, ensuring the final output looks great while staying true to the brief. A team we’d happily recommend to other brands.",
    name: "Fila Team",
    brand: "Fila",
  },
  {
    quote:
      "As an artist, it’s important to work with people who understand your vision and give you the space to express yourself. Freaky Mack did exactly that. They brought their own creative perspective while making sure the final film felt authentic to me and my work.",
    name: "Kashif Mirani",
    role: "Singer",
  },
  {
    quote:
      "I’ve worked on several shoots, and what stood out about Freaky Mack was their attention to detail and the way they approached the film creatively. The team knew exactly what they wanted to achieve while keeping the environment comfortable and fun throughout the shoot.",
    name: "Pradhyumn Jaat",
    role: "Model",
  },
  {
    quote:
      "It’s always great working with a team that understands your expectations without needing everything explained repeatedly. Freaky Mack brings consistency, creative thinking, and a genuine passion for filmmaking to every project. They’ve been a dependable creative partner throughout.",
    name: "Bombay Times Team",
    brand: "Bombay Times",
  },
];

/** "Role, Brand", or whichever is given. A brand team's name already carries the brand, so it reads "Client". */
export const byline = (t: Testimonial) =>
  t.name.endsWith(" Team") && !t.role ? "Client" : [t.role, t.brand].filter(Boolean).join(", ");
