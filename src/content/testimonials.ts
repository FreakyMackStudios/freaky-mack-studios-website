/**
 * Client testimonials on the homepage (Chapter 03), shown as two tilted cards.
 * Only real quotes, used with the client's permission. `role` is optional: leave it out rather than guess.
 * The second card keeps the board's placeholder until the next quote arrives.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  brand: string;
};

export const TESTIMONIALS: [Testimonial, Testimonial] = [
  {
    quote:
      "Freaky Mack Productions is a one-stop solution for premium fashion photography and films, offering tailor-made packages with exceptional attention to detail. Their talented team consistently delivers high-quality content on time, making them a highly reliable partner for any fashion brand.",
    name: "Abhishek Patni",
    brand: "NoughtOne",
  },
  {
    quote: "[Client testimonial — two or three lines in their own words.]",
    name: "[Name]",
    role: "[Role]",
    brand: "[Brand]",
  },
];
