import { Reveal } from "@/components/motion/Reveal";
import { PodcastComingSoon } from "@/components/site/PodcastComingSoon";
import { Label, PX } from "@/components/site/ui";

/** The Freaky Mack Podcast: not launched yet, so a type-only "coming soon" instead of a player and episode list. */
export function Podcast() {
  return (
    <section
      id="podcast"
      aria-label="The podcast"
      className={`flex scroll-mt-[24px] flex-col gap-[28px] pb-[96px] lg:gap-[40px] lg:pb-[180px] ${PX}`}
    >
      <Reveal>
        <Label size="text-[20px] lg:text-[24px]">The Freaky Mack Podcast</Label>
      </Reveal>
      <PodcastComingSoon expect heading="h2" />
    </section>
  );
}
