"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/utils/cn";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scene Refs
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);
  const scene4Ref = useRef<HTMLDivElement>(null);
  const scene5Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Split text for cinematic reveals
    const splitScene2 = new SplitType(".scene-2-text", { types: "chars,words" });
    const splitScene3 = new SplitType(".scene-3-text", { types: "lines,words" });
    const splitScene4 = new SplitType(".scene-4-text", { types: "words" });

    // Initial setups
    gsap.set([scene2Ref.current, scene3Ref.current, scene4Ref.current, scene5Ref.current], { autoAlpha: 0 });
    gsap.set(splitScene2.chars, { opacity: 0, y: 50, rotateX: -90 });
    gsap.set(splitScene3.lines, { opacity: 0, y: 30 });
    gsap.set(splitScene4.words, { opacity: 0, scale: 0.8, filter: "blur(10px)" });
    gsap.set(".scene-5-text", { opacity: 0, scale: 0.9 });

    // Master Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=2000", // Shorter scroll distance for faster transitions
        pin: true,
        scrub: 1, // Smooth scrubbing
      },
    });

    // SCENE 1: "Hello." (Fades out)
    tl.to(scene1Ref.current, { autoAlpha: 0, scale: 1.1, duration: 1 })
      
    // SCENE 2: "I'm Bhyresh BS"
      .to(scene2Ref.current, { autoAlpha: 1, duration: 0.1 })
      .to(splitScene2.chars, { opacity: 1, y: 0, rotateX: 0, stagger: 0.05, duration: 1, ease: "power3.out" })
      .to(scene2Ref.current, { autoAlpha: 0, scale: 1.2, filter: "blur(20px)", duration: 1 }, "+=0.5")

    // SCENE 3: "I build intelligent systems..."
      .to(scene3Ref.current, { autoAlpha: 1, duration: 0.1 })
      .to(splitScene3.lines, { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: "power2.out" })
      .to(scene3Ref.current, { autoAlpha: 0, y: -50, filter: "blur(10px)", duration: 1 }, "+=0.5")

    // SCENE 4: Expertise
      .to(scene4Ref.current, { autoAlpha: 1, duration: 0.1 })
      .to(splitScene4.words, { opacity: 1, scale: 1, filter: "blur(0px)", stagger: 0.15, duration: 1, ease: "back.out(1.7)" })
      .to(scene4Ref.current, { autoAlpha: 0, scale: 1.1, duration: 1 }, "+=0.5")

    // SCENE 5: "Let's build something unforgettable."
      .to(scene5Ref.current, { autoAlpha: 1, duration: 0.1 })
      .to(".scene-5-text", { opacity: 1, scale: 1, duration: 1, ease: "power2.out" });

    // Cleanup
    return () => {
      splitScene2.revert();
      splitScene3.revert();
      splitScene4.revert();
    };
  }, { scope: containerRef });

  return (
    <section id="hero" ref={containerRef} className="relative h-screen w-full overflow-hidden bg-transparent z-10 pointer-events-none">
      
      {/* Persistent HUD Overlay */}
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between z-50 pointer-events-none font-mono text-[10px] md:text-xs text-white/40 tracking-[0.2em] uppercase">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-white/80">Bhyresh BS</span>
            <span>Creative Director // Engineer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYS. ONLINE</span>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <span>LAT: 12.9716 N</span>
            <span>LON: 77.5946 E</span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span>SCROLL TO EXPLORE</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Subtle Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* SCENE 1 */}
      <div ref={scene1Ref} className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-white/40 tracking-[0.3em] font-mono text-sm mb-6 uppercase">System Boot Sequence Initiated</p>
        <h1 className="text-7xl md:text-9xl font-light tracking-widest text-white/90">HELLO.</h1>
        <div className="mt-12 w-[1px] h-24 bg-gradient-to-b from-white/30 to-transparent"></div>
      </div>

      {/* SCENE 2 */}
      <div ref={scene2Ref} className="absolute inset-0 flex flex-col items-center justify-center invisible">
        <p className="text-white/50 tracking-[0.2em] uppercase text-sm mb-4">I'm</p>
        <h2 className="scene-2-text text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white drop-shadow-2xl" style={{ perspective: "1000px" }}>
          Bhyresh BS
        </h2>
        <p className="scene-2-text mt-6 text-xl md:text-2xl font-light text-white/60 tracking-wide">
          AI/ML Engineering Student
        </p>
      </div>

      {/* SCENE 3 */}
      <div ref={scene3Ref} className="absolute inset-0 flex items-center justify-center invisible px-4 text-center">
        <h2 className="scene-3-text max-w-4xl text-3xl md:text-5xl lg:text-7xl font-semibold leading-tight tracking-tight text-white/90">
          I build intelligent systems and immersive digital experiences.
        </h2>
      </div>

      {/* SCENE 4 */}
      <div ref={scene4Ref} className="absolute inset-0 flex items-center justify-center invisible">
        <div className="scene-4-text flex flex-wrap justify-center gap-6 max-w-3xl text-center">
          {["AI", "Creative Development", "Full Stack", "Machine Learning", "Robotics"].map((skill) => (
            <span key={skill} className="px-6 py-3 border border-white/20 rounded-full text-xl md:text-3xl font-light text-white bg-white/5 backdrop-blur-md">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* SCENE 5 */}
      <div ref={scene5Ref} className="absolute inset-0 flex flex-col items-center justify-center invisible pointer-events-auto">
        <h2 className="scene-5-text text-4xl md:text-6xl font-medium tracking-tight text-white mb-8 text-center max-w-2xl leading-tight">
          Let's build something unforgettable.
        </h2>
        <div className="scene-5-text w-[1px] h-24 bg-gradient-to-b from-white/50 to-transparent"></div>
      </div>

    </section>
  );
}
