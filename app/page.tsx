import Scene from "@/components/webgl/Scene";
import LiquidNav from "@/components/ui/LiquidNav";
import CinematicHero from "@/components/hero/CinematicHero";
import HorizontalShowcase from "@/components/projects/HorizontalShowcase";
import Preloader from "@/components/ui/preloader/Preloader";
import AboutSection from "@/components/about/AboutSection";
import ExperienceControls from "@/components/hero/ExperienceControls";
import SkillsUniverse from "@/components/skills/SkillsUniverse";
import ScrollRestorer from "@/components/utils/ScrollRestorer";

export default function Home() {
  return (
    <main className="relative bg-[#050505] overflow-x-hidden selection:bg-white/20 selection:text-white text-white">
      {/* Handles scroll restoration after returning from another route */}
      <ScrollRestorer />

      {/* Initial Welcome Animation */}
      <Preloader />

      {/* 3D Background Layer - Fixed to viewport */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Scene />
      </div>

      {/* Foreground UI Layer */}
      <LiquidNav />
      <ExperienceControls />

      {/* Scroll-Driven Cinematic Hero */}
      <CinematicHero />

      {/* About Section */}
      <AboutSection />

      {/* Skills Section */}
      <SkillsUniverse />

      {/* Projects Horizontal Scroll Section */}
      <div className="relative z-10">
        <HorizontalShowcase />
      </div>
    </main>
  );
}
