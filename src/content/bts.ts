import type { Still } from "./stills";

/**
 * Behind-the-scenes photos from the studio's shoots (the "image" folder, Oct 2026), placed across the site
 * outside the project pages. Each is a web copy of the full-resolution original (public/bts/), with its
 * metadata stripped. Alt text describes what is happening; nobody is named, since the photos came without
 * names. Close-ups of talent are left out until the talent has agreed.
 */
const bts = (name: string, width: number, height: number, alt: string): Still => ({ src: `/bts/${name}.webp`, width, height, alt });

/** Studio: the slideshow of the crew at the camera, under the big photo (WhatsApp Images, 17 Oct 2026, 12.32.18–12.32.25 PM). */
export const SET_REEL: Still[] = [
  bts("set-reel-01", 1280, 960, "The camera operator lines up a shot on the tripod, the crew watching over his shoulder"),
  bts("set-reel-02", 1280, 960, "A close look at the shot, eyes on the camera"),
  bts("set-reel-03", 1280, 960, "A run-through on a black-draped set, the camera rolling in the corner"),
  bts("set-reel-04", 1280, 960, "The crew crowds round the camera as the operator frames up"),
  bts("set-reel-05", 1280, 960, "Sitting down with the camera between set-ups, the crew gathered behind"),
  bts("set-reel-06", 1072, 804, "Checking the frame through the camera's eyepiece"),
  bts("set-reel-07", 1280, 960, "Crouched at the camera outdoors, the crew looking on"),
  bts("set-reel-08", 896, 1600, "Two of the crew watching the monitor together"),
];

/** People: the crew together. */
export const CREW_TOGETHER = bts("crew-together", 1200, 1600, "The Freaky Mack crew together on set");

/** Homepage, Chapter 06: directing on location. */
export const ON_LOCATION = bts("home-on-location", 1800, 1013, "Directing on location in a mustard field");

/** Start a project: the shot list. */
export const SHOT_LIST = bts("start-shot-list", 1400, 1050, "Writing up the shot list beside the camera");

/** Thanks: the wrap photo. */
export const WRAP = bts("thanks-wrap", 506, 900, "The crew at the wrap of a shoot");

/** 404: a frame that didn't make the edit. */
export const OUT_OF_FOCUS = bts("not-found-monitor", 1800, 1013, "An out-of-focus shot of the video monitor on set");
