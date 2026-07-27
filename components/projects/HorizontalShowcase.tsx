"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const DUMMY_PROJECTS = [
  { id: 1, title: "Nexus", desc: "A sentient task orchestration engine.", tags: ["React", "Python", "LLMs"] },
  { id: 2, title: "Aether", desc: "Real-time volumetric rendering on the web.", tags: ["WebGL", "Three.js", "GLSL"] },
  { id: 3, title: "Oblivion", desc: "Zero-knowledge proof authentication protocol.", tags: ["Cryptography", "Rust", "Next.js"] },
  { id: 4, title: "Genesis", desc: "Generative design system for architects.", tags: ["AI", "Figma API", "TypeScript"] },
  { id: 5, title: "Monolith", desc: "High-frequency trading terminal UI.", tags: ["FinTech", "WebSockets", "React"] },
];

export default function HorizontalShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !scrollWrapperRef.current) return;

    const sections = gsap.utils.toArray(".project-card");
    
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        // The total scroll distance determines the speed. We make it long so it feels smooth.
        end: () => "+=" + scrollWrapperRef.current?.offsetWidth,
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="projects" className="relative h-screen w-full overflow-hidden bg-black flex items-center">
      
      {/* Background Lighting for the section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute top-10 left-10 z-20">
        <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white/90">Selected Works</h2>
      </div>

      <div ref={scrollWrapperRef} className="flex h-full w-[500vw] items-center px-[10vw]">
        
        {DUMMY_PROJECTS.map((project, i) => (
          <div key={project.id} className="project-card w-screen h-full flex items-center justify-center flex-shrink-0">
            <div className="relative w-full max-w-5xl aspect-[16/9] group cursor-pointer">
              
              {/* Premium Glass Card */}
              <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                
                {/* Image Placeholder (Wait for real images) */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent"></div>
                
                {/* Content */}
                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">{project.title}</h3>
                    <p className="text-xl text-white/60 max-w-2xl mb-8">{project.desc}</p>
                    
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-4 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-sm text-white/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
              </div>

            </div>
          </div>
        ))}

        {/* View All Projects Ending Card */}
        <div className="project-card w-screen h-full flex items-center justify-center flex-shrink-0">
          <button className="group relative px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-4 overflow-hidden">
            <span className="text-xl text-white font-light relative z-10">View All Projects</span>
            <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>

      </div>
    </section>
  );
}
