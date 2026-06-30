"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { MagneticCursor } from "@/components/nav/MagneticCursor";
import { Preloader } from "@/components/ui/Preloader";
import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/nav/Footer";
import { AIChatAssistant } from "@/components/nav/AIChatAssistant";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";

// Code-split the heavy 3D scene — loads async after initial paint
const HeroScene = dynamic(
  () => import("@/scenes/HeroScene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <MagneticCursor />

      {!loaded && <Preloader onComplete={handlePreloaderComplete} />}

      <main className="relative">
        <Navigation />

        {/* Hero with 3D Background — scene loads behind preloader */}
        <div className="relative">
          <HeroScene />
          <HeroSection />
        </div>

        {/* Content Sections */}
        <AboutSection />
        <StatsSection />
        <ExpertiseSection />
        <ProjectsSection />
        <TechStackSection />
        <TestimonialsSection />
        <ContactSection />

        <Footer />
        <AIChatAssistant />
      </main>
    </>
  );
}
