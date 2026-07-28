"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/utils/cn";
import SecureImage from "@/components/ui/secure-image/SecureImage";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Cinematic Fade-in for all text blocks
    const revealElements = gsap.utils.toArray(".philosophy-reveal");
    
    revealElements.forEach((el: any) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    // Side panels stagger reveal
    gsap.fromTo(".info-panel",
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".info-panels-container",
          start: "top 75%",
          toggleActions: "play none none reverse",
        }
      }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="about" className="relative w-full overflow-hidden border-t border-white/[0.05] z-10 py-24 md:py-32 bg-black/40 backdrop-blur-[40px]">
      
      {/* Subtle overlay gradient to ensure text legibility over the WebGL background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-black/50 to-[#050505]/90 pointer-events-none"></div>

      {/* Decorative ambient lighting specifically for this section */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10">
        
        {/* Title */}
        <div className="philosophy-reveal mb-16 md:mb-24 text-center md:text-left">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif italic tracking-wide text-white/90">
            Beyond Code.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative">
          
          {/* Left Column: Philosophy Storytelling */}
          <div className="lg:col-span-7 space-y-10 md:space-y-16">
            
            {/* Introduction */}
            <div className="philosophy-reveal text-2xl md:text-3xl font-light leading-relaxed text-white">
              <p>
                Technology has never been just about writing software for me. 
                <br className="hidden md:block" /><br className="hidden md:block" />
                It's about creating experiences that people remember.
              </p>
            </div>

            {/* Block 1 */}
            <div className="philosophy-reveal text-xl md:text-2xl font-light leading-loose text-white/60">
              <p>
                I don't see software as collections of pages and buttons. I see it as living systems where engineering, intelligence and design work together to create experiences that feel effortless.
              </p>
            </div>

            {/* Block 2 */}
            <div className="philosophy-reveal text-xl md:text-2xl font-light leading-loose text-white/60">
              <p>
                The products I admire most are those that quietly solve complex problems while making every interaction feel natural. That philosophy shapes everything I build.
              </p>
            </div>

            {/* Block 3 */}
            <div className="philosophy-reveal text-xl md:text-2xl font-light leading-loose text-white/60">
              <p>
                My journey into Artificial Intelligence and Software Engineering began with curiosity. 
                Curiosity about how machines learn. How systems think. And how thoughtful design can transform powerful technology into something beautifully simple.
              </p>
            </div>

            {/* Block 4 */}
            <div className="philosophy-reveal text-xl md:text-2xl font-light leading-loose text-white/60">
              <p>
                Today, I focus on creating intelligent products, immersive interfaces and AI-powered experiences that combine technical precision with creativity.
              </p>
            </div>

            {/* Block 5 */}
            <div className="philosophy-reveal text-xl md:text-2xl font-light leading-loose text-white/60">
              <p>
                Whether I am building machine learning models, modern web applications or interactive digital experiences, every decision begins with the same question.
              </p>
            </div>
          </div>

          {/* Right Column: Information Panels & Image (Sticky) */}
          <div className="lg:col-span-5 info-panels-container relative hidden lg:block">
            <div className="sticky top-32 space-y-8">
              
              {/* Image Placeholder */}
              <div className="info-panel relative h-[350px] w-full rounded-3xl border border-white/10 bg-black/20 backdrop-blur-3xl shadow-2xl overflow-hidden group">
                <SecureImage 
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent pointer-events-none z-10 opacity-80"></div>
                <div className="absolute top-6 left-6 font-mono text-xs text-white/30 tracking-widest z-20 flex flex-col gap-1">
                  <span>SECURE ASSET</span>
                </div>
              </div>

              {/* Glassmorphism Info Panels */}
              <div className="info-panel bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-8 rounded-3xl shadow-2xl">
                <h4 className="text-sm font-mono tracking-widest text-cyan-400 uppercase mb-4">Education</h4>
                <p className="text-lg text-white/90 font-light">B.Tech in Artificial Intelligence & Machine Learning</p>
              </div>

              <div className="info-panel bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-8 rounded-3xl shadow-2xl">
                <h4 className="text-sm font-mono tracking-widest text-blue-400 uppercase mb-4">Current Focus</h4>
                <ul className="space-y-3 text-lg text-white/80 font-light">
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span> Artificial Intelligence</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span> Machine Learning</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span> Creative Development</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span> Interactive Web Experiences</li>
                </ul>
              </div>

              <div className="info-panel bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-8 rounded-3xl shadow-2xl">
                <h4 className="text-sm font-mono tracking-widest text-purple-400 uppercase mb-4">Mindset</h4>
                <ul className="grid grid-cols-2 gap-4 text-lg text-white/80 font-light">
                  <li>Curiosity</li>
                  <li>Precision</li>
                  <li>Craftsmanship</li>
                  <li>Continuous Learning</li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Info Panels (Rendered inline for smaller screens) */}
        <div className="lg:hidden mt-24 space-y-6 info-panels-container">
          
          <div className="info-panel relative h-[300px] w-full rounded-3xl border border-white/10 bg-black/20 backdrop-blur-3xl shadow-2xl overflow-hidden group">
            <SecureImage 
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent pointer-events-none z-10 opacity-80"></div>
          </div>

          <div className="info-panel bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-6 rounded-3xl shadow-2xl">
            <h4 className="text-sm font-mono tracking-widest text-cyan-400 uppercase mb-4">Education</h4>
            <p className="text-lg text-white/90 font-light">B.Tech in Artificial Intelligence & Machine Learning</p>
          </div>

          <div className="info-panel bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-6 rounded-3xl shadow-2xl">
            <h4 className="text-sm font-mono tracking-widest text-blue-400 uppercase mb-4">Current Focus</h4>
            <ul className="space-y-3 text-lg text-white/80 font-light">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span> Artificial Intelligence</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span> Machine Learning</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span> Creative Development</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span> Interactive Web Experiences</li>
            </ul>
          </div>

          <div className="info-panel bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-6 rounded-3xl shadow-2xl">
            <h4 className="text-sm font-mono tracking-widest text-purple-400 uppercase mb-4">Mindset</h4>
            <ul className="grid grid-cols-2 gap-4 text-lg text-white/80 font-light">
              <li>Curiosity</li>
              <li>Precision</li>
              <li>Craftsmanship</li>
              <li>Continuous Learning</li>
            </ul>
          </div>
        </div>

        {/* Emotional Conclusion / Highlight Quote */}
        <div className="mt-32 md:mt-48 text-center philosophy-reveal">
          <p className="text-xl md:text-3xl font-serif italic text-white/50 mb-6">
            Every project begins with one question—
          </p>
          <h3 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            How should this <br className="md:hidden"/> make people feel?
          </h3>
        </div>

        {/* Transition Statement */}
        <div className="mt-32 text-center philosophy-reveal">
          <p className="text-lg md:text-xl font-light text-white/40 max-w-xl mx-auto">
            Every experience begins with understanding.
            <br />
            <span className="block mt-2 text-white/70">Now, let's explore the technologies behind it.</span>
          </p>
          
          <div className="mt-12 w-[1px] h-32 bg-gradient-to-b from-white/20 to-transparent mx-auto"></div>
        </div>

      </div>
    </section>
  );
}
