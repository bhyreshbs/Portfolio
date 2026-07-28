"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const DUMMY_PROJECTS = [
  { id: 1, title: "Nexus", desc: "A sentient task orchestration engine.", tags: ["React", "Python", "LLMs"], image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop" },
  { id: 2, title: "Aether", desc: "Real-time volumetric rendering on the web.", tags: ["WebGL", "Three.js", "GLSL"], image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" },
  { id: 3, title: "Oblivion", desc: "Zero-knowledge proof authentication protocol.", tags: ["Cryptography", "Rust", "Next.js"], image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop" },
  { id: 4, title: "Genesis", desc: "Generative design system for architects.", tags: ["AI", "Figma API", "TypeScript"], image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" },
  { id: 5, title: "Monolith", desc: "High-frequency trading terminal UI.", tags: ["FinTech", "WebSockets", "React"], image: "https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=2000&auto=format&fit=crop" },
];

export default function HorizontalShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current || !galleryRef.current || cardsRef.current.length === 0) return;

    const cards = cardsRef.current;
    const totalProjects = DUMMY_PROJECTS.length; // 5 real projects

    // Set initial 3D transform properties to avoid jumping
    gsap.set(cards, {
      transformOrigin: "50% 50%",
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      z: -1500,
      x: (i) => i === 0 ? "0vw" : "120vw",
      rotationY: (i) => i === 0 ? 0 : -45,
      opacity: (i) => i === 0 ? 1 : 0,
      filter: (i) => i === 0 ? "blur(0px)" : "blur(10px)",
    });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1.5, // 1.5s smoothing for heavy, physically believable movement
        snap: {
          snapTo: 1 / (totalProjects - 1),
          duration: { min: 0.6, max: 1.2 },
          delay: 0,
          ease: "power2.inOut"
        },
        end: () => `+=${totalProjects * 1200}`, // Ample scroll distance to prevent fast skipping
        invalidateOnRefresh: true,
      }
    });

    // Add labels for exactly N projects
    for (let i = 0; i < totalProjects; i++) {
      masterTl.add(`step-${i}`, i); 
    }

    cards.forEach((card, i) => {
      // Depth of field simulated blur (4px) and subtle opacity (0.5)
      // Ensures gallery remains visibly populated in both directions
      const centerState = { x: "0vw", z: 0, rotationY: 0, opacity: 1, filter: "blur(0px)", ease: "power2.inOut", duration: 1 };
      const rightState = { x: "55vw", z: -600, rotationY: -25, opacity: 0.5, filter: "blur(4px)", ease: "power2.inOut", duration: 1 };
      const leftState = { x: "-55vw", z: -600, rotationY: 25, opacity: 0.5, filter: "blur(4px)", ease: "power2.inOut", duration: 1 };
      const farRightState = { x: "100vw", z: -1000, rotationY: -45, opacity: 0, filter: "blur(10px)", ease: "power2.inOut", duration: 1 };
      const farLeftState = { x: "-100vw", z: -1000, rotationY: 45, opacity: 0, filter: "blur(10px)", ease: "power2.inOut", duration: 1 };
      
      // The View More panel uses a custom final state to remain perfectly sharp and fully opaque
      const viewMoreState = { x: "55vw", z: -600, rotationY: -25, opacity: 1, filter: "blur(0px)", ease: "power2.inOut", duration: 1 };

      const isViewMorePanel = i === totalProjects;

      if (!isViewMorePanel) {
        // --- REAL PROJECTS ---
        
        // Entering from Far Right to Right
        if (i > 1) {
          masterTl.fromTo(card, farRightState, rightState, i - 2);
        } else if (i === 1) {
          gsap.set(card, rightState); 
        }

        // Entering from Right to Center
        if (i > 0) {
          masterTl.fromTo(card, rightState, centerState, i - 1);
          
          const content = card?.querySelector('.project-info');
          if (content) {
            masterTl.fromTo(content, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, i - 0.4);
          }
        } else {
           const content = card?.querySelector('.project-info');
           if (content) gsap.set(content, { opacity: 1, y: 0 });
        }

        // Leaving from Center to Left
        if (i < totalProjects - 1) {
          masterTl.fromTo(card, centerState, leftState, i);
          
          const content = card?.querySelector('.project-info');
          if (content) {
            masterTl.to(content, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" }, i);
          }
        }

        // Leaving from Left to Far Left
        if (i < totalProjects - 2) {
          masterTl.fromTo(card, leftState, farLeftState, i + 1);
        }
      } else {
        // --- VIEW MORE PANEL ---
        // Slides in to `viewMoreState` at the exact time the final project centers (totalProjects - 1)
        masterTl.fromTo(card, farRightState, viewMoreState, totalProjects - 2);
      }

      // Idle float for cards (very slow breathing motion)
      const inner = card?.querySelector('.project-card-inner');
      if (inner) {
        gsap.to(inner, {
          y: "-15px",
          rotationZ: 0.5,
          duration: 3 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    });

  }, { scope: containerRef });

  // Extremely subtle physical tilt based on mouse interaction
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!galleryRef.current) return;
    const rect = galleryRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    gsap.to(".project-card-inner", {
      rotateY: x * 6,
      rotateX: -y * 6,
      duration: 1.5,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(".project-card-inner", {
      rotateY: 0,
      rotateX: 0,
      duration: 1.5,
      ease: "power2.out"
    });
  };

  return (
    <section 
      ref={containerRef} 
      id="projects" 
      className="relative h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden border-t border-white/[0.05]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Deep Environment Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute top-10 left-10 z-50">
        <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white/90 drop-shadow-xl">Selected Works</h2>
      </div>

      {/* 3D Perspective Gallery Container */}
      <div 
        ref={galleryRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
      >
        {DUMMY_PROJECTS.map((project, i) => (
          <div 
            key={project.id}
            ref={(el) => { cardsRef.current[i] = el; }}
            // Width slightly reduced (45vw) to allow side projects to breathe visually
            className="absolute w-[75vw] md:w-[45vw] max-w-5xl aspect-[16/9] flex-shrink-0 project-card pointer-events-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* The physical card body which floats independently */}
            <div 
              className="project-card-inner w-full h-full relative rounded-2xl md:rounded-3xl pointer-events-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/[0.08]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden bg-[#050505]">
                <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              </div>

              {/* Information Overlay */}
              <div className="project-info absolute inset-0 p-8 md:p-14 flex flex-col justify-end text-white z-20 pointer-events-none opacity-0">
                <h3 className="text-4xl md:text-6xl font-bold mb-2 md:mb-4 drop-shadow-2xl">{project.title}</h3>
                <p className="text-lg md:text-2xl text-white/70 font-light max-w-2xl drop-shadow-lg leading-relaxed mb-6 md:mb-8">{project.desc}</p>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-xs md:text-sm text-white/90 shadow-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reflection/Glow layer for premium glass feel */}
              <div className="absolute inset-0 rounded-2xl md:rounded-3xl border border-white/5 mix-blend-overlay pointer-events-none"></div>
              <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 translate-x-[100%] opacity-20 pointer-events-none blur-3xl"></div>
            </div>
          </div>
        ))}

        {/* Final "View More Projects" Gallery Installation Panel */}
        <div
          ref={(el) => { cardsRef.current[DUMMY_PROJECTS.length] = el; }}
          className="absolute w-[60vw] md:w-[25vw] aspect-[4/5] flex-shrink-0 project-card pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div 
            className="project-card-inner w-full h-full pointer-events-auto"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div 
              className="view-more-content w-full h-full relative rounded-2xl md:rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/[0.15] cursor-pointer bg-white/[0.03] backdrop-blur-md flex flex-col items-center justify-center group overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Premium Glass Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="z-10 flex flex-col items-center gap-6 text-white group-hover:text-white transition-colors duration-500" style={{ transform: "translateZ(30px)" }}>
                <span className="text-xl md:text-3xl font-light tracking-wide drop-shadow-md">View All</span>
                <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center group-hover:border-white group-hover:bg-white/20 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-500 bg-white/5">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 drop-shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .view-more-content {
          transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .project-card-inner:hover .view-more-content {
          transform: translateZ(50px) rotateY(-8deg);
          box-shadow: 0 0 60px rgba(255,255,255,0.05);
          background-color: rgba(0,0,0,0.2);
        }
      `}</style>
    </section>
  );
}
