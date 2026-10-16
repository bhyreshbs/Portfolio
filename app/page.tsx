import AmbientBackground from "@/components/ui/AmbientBackground";
import LiquidNav from "@/components/ui/LiquidNav";
import CinematicHero from "@/components/hero/CinematicHero";
import ProjectsSection from "@/components/projects/ProjectsSection";
import Preloader from "@/components/ui/preloader/Preloader";
import AboutSection from "@/components/about/AboutSection";
import SkillsUniverse from "@/components/skills/SkillsUniverse";
import SiteFooter from "@/components/ui/SiteFooter";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    // overflow-x-clip (not hidden): hidden would make <main> a scroll container and break the hero's position: sticky
    <main className="relative bg-canvas overflow-x-clip selection:bg-white/20 selection:text-white text-white">
      <Preloader />
      <AmbientBackground />
      <LiquidNav />

      <CinematicHero />
      <AboutSection />
      <SkillsUniverse />
      <ProjectsSection />
      <SiteFooter />
      <ChatWidget />
    </main>
  );
}
