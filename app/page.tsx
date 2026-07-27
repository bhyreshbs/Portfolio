import Scene from "@/components/webgl/Scene";
import LiquidNav from "@/components/ui/LiquidNav";
import CinematicHero from "@/components/hero/CinematicHero";
import HorizontalShowcase from "@/components/projects/HorizontalShowcase";

export default function Home() {
  return (
    <main className="relative bg-[#050505] overflow-x-hidden selection:bg-white/20 selection:text-white text-white">
      {/* 3D Background Layer - Fixed to viewport */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Scene />
      </div>

      {/* Foreground UI Layer */}
      <LiquidNav />
      
      {/* Scroll-Driven Cinematic Hero */}
      <CinematicHero />

      {/* About Section */}
      <section id="about" className="relative z-10 min-h-screen flex items-center justify-center bg-black/80 backdrop-blur-sm border-t border-white/[0.05]">
        <h2 className="text-4xl font-light text-white/40 tracking-widest uppercase">About (Next)</h2>
      </section>

      {/* Projects Horizontal Scroll Section */}
      <div className="relative z-10">
        <HorizontalShowcase />
      </div>
      
      {/* Skills Section */}
      <section id="skills" className="relative z-10 min-h-screen flex items-center justify-center bg-[#050505] border-t border-white/[0.05]">
        <h2 className="text-4xl font-light text-white/40 tracking-widest uppercase">Skills Universe</h2>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="relative z-10 min-h-screen flex items-center justify-center bg-black border-t border-white/[0.05]">
        <h2 className="text-4xl font-light text-white/40 tracking-widest uppercase">Contact</h2>
      </section>
    </main>
  );
}
