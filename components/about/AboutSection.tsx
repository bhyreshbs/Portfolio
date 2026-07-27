"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SecureImage from "@/components/ui/secure-image/SecureImage";

gsap.registerPlugin(ScrollTrigger);

// --- ABOUT SECTION CONTENT ---
export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "top 20%",
        scrub: false,
        toggleActions: "play none none reverse",
      }
    });

    // Content entry: Slide from left, fade in, unblur, staggered
    tl.fromTo(".about-content-reveal", 
      { x: -50, opacity: 0, filter: "blur(15px)" }, 
      { x: 0, opacity: 1, filter: "blur(0px)", stagger: 0.1, duration: 1.2, ease: "power4.out" }
    )
    // Image entry: Scale up, slide from right, 3D rotate in, overlap with content
    .fromTo(".about-image-reveal",
      { scale: 0.8, x: 100, opacity: 0, rotateY: 15, filter: "blur(20px)" },
      { scale: 1, x: 0, opacity: 1, rotateY: 0, filter: "blur(0px)", duration: 1.5, ease: "expo.out" },
      "-=1" // Overlap by 1 second
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="about" className="relative min-h-screen w-full flex items-center bg-[#050505] overflow-hidden border-t border-white/[0.05] z-10">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Content */}
        <div className="flex flex-col justify-center z-10 py-20 lg:py-0">
          <div className="about-content-reveal flex items-center gap-4 mb-8">
            <span className="w-12 h-[1px] bg-white/40"></span>
            <span className="font-mono text-sm tracking-widest text-white/60 uppercase">System Profile</span>
          </div>

          <h2 className="about-content-reveal text-5xl md:text-7xl font-medium tracking-tight text-white mb-10 leading-tight">
            I engineer <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              the extraordinary.
            </span>
          </h2>

          <div className="about-content-reveal space-y-6 text-lg text-white/60 font-light max-w-xl">
            <p>
              As an AI/ML Engineering Student and Creative Director, I don't just write code; I orchestrate digital experiences. My work lives at the intersection of complex algorithms and breathtaking aesthetics.
            </p>
            <p>
              I specialize in taking abstract concepts—whether in machine learning, high-performance web architecture, or interactive 3D spaces—and turning them into tangible, immersive realities that demand attention.
            </p>
          </div>

          <div className="about-content-reveal mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-12 max-w-xl">
            <div>
              <h4 className="text-4xl font-bold text-white mb-2">04+</h4>
              <p className="text-sm font-mono text-white/40 uppercase tracking-wider">Years Coding</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-white mb-2">50+</h4>
              <p className="text-sm font-mono text-white/40 uppercase tracking-wider">Projects Shipped</p>
            </div>
          </div>
        </div>

        {/* Right: Highly Secure Profile Image */}
        <div className="about-image-reveal relative h-[50vh] lg:h-[80vh] w-full rounded-3xl border border-white/5 bg-black/20 backdrop-blur-3xl shadow-2xl overflow-hidden group" style={{ perspective: "1000px" }}>
          
          <div className="absolute top-6 left-6 font-mono text-xs text-white/30 tracking-widest z-20 flex flex-col gap-1 drop-shadow-md">
            <span>SECURE ASSET ENCRYPTED</span>
            <span className="text-cyan-400 opacity-50">NO EXTRACTION PERMITTED</span>
          </div>

          {/* 
            This component renders the image to a canvas element and strips away the ability 
            to right-click, drag, or easily inspect and download the raw asset. 
          */}
          <SecureImage 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" 
            alt="Bhyresh BS Profile"
            className="w-full h-full"
          />

          {/* Vignette Overlay for aesthetics */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay pointer-events-none z-10"></div>
        </div>

      </div>
    </section>
  );
}
