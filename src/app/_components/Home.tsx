"use client";

import { useState } from "react";
import { HAS_FULL_REEL } from "@/shared/reel";
import { enterFullscreen } from "@/shared/reel-lock";
import s from "../home.module.css";
import { ClientScatter } from "./ClientScatter";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Nav } from "./Nav";
import { People } from "./People";
import { Podcast } from "./Podcast";
import { Reel } from "./Reel";
import { SentenceBuilder } from "./SentenceBuilder";
import { ServicesTicker } from "./ServicesTicker";
import { Testimonials } from "./Testimonials";
import { TheTurn } from "./TheTurn";
import { WorkPreview } from "./WorkPreview";

/**
 * Freaky Mack Studios homepage (design/boards/Main.dc.html). It keeps its own nav and footer, as the board does.
 * Theme and accent come from the site-wide theme (CSS variables on <html>, see src/shared/theme).
 */
export function Home() {
  const [reelOpen, setReelOpen] = useState(false);
  // Opening the full reel takes the page full screen; that has to start inside the click.
  const toggleReel = () => {
    if (!reelOpen && HAS_FULL_REEL) enterFullscreen();
    setReelOpen((o) => !o);
  };

  return (
    <div className={`${s.root} min-h-screen overflow-x-clip transition-colors duration-300`}>
      <div className="relative mx-auto flex max-w-[1440px] flex-col">
        <Nav />
        <Hero reelOpen={reelOpen} onToggleReel={toggleReel} />
        <Reel open={reelOpen} onToggle={toggleReel} />
        <WorkPreview />
        <ClientScatter />
        <Testimonials />
        <SentenceBuilder />
        <ServicesTicker />
        <TheTurn />
        <Podcast />
        <People />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
