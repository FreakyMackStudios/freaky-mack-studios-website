import { Reveal } from "@/components/motion/Reveal";
import { PodcastComingSoon } from "@/components/site/PodcastComingSoon";
import s from "../home.module.css";
import { CHAPTER, H2, PB, PX } from "@/shared/ui";

/** Chapter 04: the podcast hasn't launched, so this is a type-only "coming soon" (no episode art or player). */
export function Podcast() {
  return (
    <section id="ch4" className={`flex shrink-0 flex-col gap-[40px] lg:gap-[64px] ${PB} ${PX}`}>
      <Reveal className="flex flex-col gap-[20px]">
        <div className={`${s.it} ${CHAPTER}`}>Chapter 04 — Voices, on the record</div>
        <h2 className={H2}>The podcast</h2>
      </Reveal>
      <PodcastComingSoon />
    </section>
  );
}
