import type { Still } from "./stills";

/**
 * Behind-the-scenes photos from the studio's shoots (the "image" folder, Oct 2026), placed across the site
 * outside the project pages. Each is a web copy of the full-resolution original (public/bts/), with its
 * metadata stripped. Alt text describes what is happening; nobody is named, since the photos came without
 * names. Close-ups of talent are left out until the talent has agreed.
 */
const bts = (name: string, width: number, height: number, alt: string): Still => ({ src: `/bts/${name}.webp`, width, height, alt });

/** Studio: the big "on set" photo. */
export const ON_SET = bts("on-set-hero", 2400, 1350, "On set: the director talks a scene through with an actor, the camera rig in the foreground");

/** Studio: the strip of frames from set, under the big photo. */
export const ON_SET_STRIP: Still[] = [
  bts("strip-cafe-crew", 1600, 900, "A café set lit for a scene, the crew gathered by the bar"),
  bts("strip-over-the-shoulder", 1600, 900, "Over the camera operator’s shoulder: the monitor, the boom and the actor"),
  bts("strip-makeup-window", 1600, 900, "A make-up touch-up by the window between shots"),
  bts("strip-cafe-lights", 1600, 900, "Lights and a bounce board rigged in the café before a take"),
  bts("strip-cafe-cast", 1600, 900, "Cast in position at a café table, waiting for action"),
  bts("strip-makeup-room", 1600, 900, "Make-up on set, in a room dressed for the scene"),
  bts("strip-monitor-boom", 1600, 900, "The monitor and the boom mic during a take"),
  bts("strip-between-takes", 1600, 900, "Cast and crew between takes"),
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
