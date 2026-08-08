"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/utils/cn";
import SecureImage from "@/components/ui/secure-image/SecureImage";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scene Refs
  const scene1Ref = useRef<HTMLDivElement>(null); // Identity Reveal
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);
  const scene4Ref = useRef<HTMLDivElement>(null);
  const scene5Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Initial setups for seamless morphing
    // Note: scene1Ref (the particles) does NOT have blur applied via GSAP, avoiding the blurry text issue.
    gsap.set([scene2Ref.current, scene3Ref.current, scene4Ref.current, scene5Ref.current], {
      autoAlpha: 0,
      filter: "blur(15px)",
      y: 40
    });

    gsap.set(scene1Ref.current, { autoAlpha: 1 });

    gsap.set(".post-reveal", {
      autoAlpha: 0,
      y: 20
    });

    gsap.set(".post-reveal-title", { autoAlpha: 0, y: 20 });
    gsap.set(".hero-hud", { opacity: 0 });

    const hasVisited = sessionStorage.getItem("hasVisited");

    if (hasVisited) {
      // Instant reveal
      gsap.set(".name-char", { opacity: 1, filter: "blur(0px)", y: 0 });
      gsap.set(".hero-photo", { scale: 1, opacity: 1, filter: "blur(0px)", y: 0 });
      gsap.set(".centerpiece-dimmer", { backgroundColor: "rgba(0,0,0,0)" });
      gsap.set([".post-reveal-title", ".hero-hud"], { autoAlpha: 1, y: 0 });
    } else {
      // 1. Wait for preloader to completely finish (approx 4.0s) + 0.5s gap
      const delay = 4.5;

      // 2. Name & Image Reveal
      gsap.delayedCall(delay, () => {
        gsap.to(".name-char", {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out"
        });

        // Premium Materialize Effect for the photo
        // Replaces the awkward slide with a gentle scale-up, blur reduction, and fade-in
        gsap.fromTo(".hero-photo",
          { scale: 0.85, opacity: 0, filter: "blur(15px)", y: 30 },
          { scale: 1, opacity: 1, filter: "blur(0px)", y: 0, duration: 2, ease: "power3.out", delay: 0.2 }
        );

        gsap.to(".centerpiece-dimmer", { backgroundColor: "rgba(0,0,0,0)", duration: 2.5, ease: "power2.inOut" });

        // 3. Title & HUD Reveal (Wait for Name & Image to finish ~2s)
        gsap.to([".post-reveal-title", ".hero-hud"], { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 2.0 });
      });
    }

    // Master Timeline for Scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=5000", // Generous scroll distance for 5 scenes
        pin: true,
        scrub: 1.5, // Smooth scrubbing
        invalidateOnRefresh: true, // Re-calculate dynamic x/y values on resize
      },
    });

    // SCENE 1: Identity Particle Reveal (Initially visible, user scrolls to fade it out)
    // Add a pause to allow the user to view the generated particles before scrolling removes them
    tl.to({}, { duration: 2 })
      // Fade out only the text, keep the scene container
      .to([".name-title", ".post-reveal-title"], { autoAlpha: 0, filter: "blur(15px)", y: -40, duration: 3, ease: "power2.inOut" }, "scene1Exit")
      // Shrink photo and fly it to the top right corner (below SYS. ONLINE)
      .to(".hero-photo", {
        x: () => (window.innerWidth / 2) - 60, // Move right slightly to align perfectly
        y: () => -(window.innerHeight / 2) - 80, // Move down significantly to be below SYS. ONLINE
        scale: 0.25,
        duration: 3,
        ease: "power2.inOut"
      }, "scene1Exit")

      // SCENE 2: Everything begins with an idea.
      .to(scene2Ref.current, { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 3, ease: "power2.out" }, "-=1.5")
      .to(scene2Ref.current, { autoAlpha: 0, filter: "blur(15px)", y: -40, duration: 3, ease: "power2.inOut" }, "+=1.5")

      // SCENE 3: Ideas become systems.
      .to(scene3Ref.current, { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 3, ease: "power2.out" }, "-=1.5")
      .to(scene3Ref.current, { autoAlpha: 0, filter: "blur(15px)", y: -40, duration: 3, ease: "power2.inOut" }, "+=1.5")

      // SCENE 4: Systems become experiences.
      .to(scene4Ref.current, { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 3, ease: "power2.out" }, "-=1.5")
      .to(scene4Ref.current, { autoAlpha: 0, filter: "blur(15px)", y: -40, duration: 3, ease: "power2.inOut" }, "+=1.5")

      // SCENE 5: Experiences become reality.
      .to(scene5Ref.current, { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 3, ease: "power2.out" }, "-=1.5")

      // Reveal the CTA at the end of the sequence
      .to(".post-reveal", { autoAlpha: 1, y: 0, duration: 2, ease: "power3.out" }, "+=1")

      // Cinematic Camera Push (scale the scene container slightly during the whole scroll)
      .to(".scene-container", { scale: 1.04, duration: 8, ease: "none" }, 0)

      // Keep the final state visible for a moment
      .to({}, { duration: 2 })

      // Cinematic Wipe: Fade out the entire Hero (including HUD) into the WebGL background
      // This creates a clean slate right before the About section scrolls up
      .to(".hero-content-wrapper", { autoAlpha: 0, filter: "blur(20px)", y: -50, duration: 3, ease: "power2.inOut" });

  }, { scope: wrapperRef });

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // handleRevealComplete is now integrated into GSAP timeline

  return (
    <div ref={wrapperRef}>
      {/* Persistent Photo - Fixed to viewport so it persists across all sections */}
      <div className="fixed top-[calc(50%+180px)] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-auto">
        <div className="hero-photo opacity-0 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border border-white/[0.05] shadow-[0_0_50px_-10px_rgba(6,182,212,0.15)] relative">
          <SecureImage
            src="/media/profile.webp"
            alt="Profile"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent pointer-events-none z-10 opacity-80"></div>

          {/* Inner glass highlight */}
          <div className="absolute inset-0 rounded-full border border-white/[0.1] pointer-events-none mix-blend-overlay z-20"></div>
        </div>
      </div>

      <section id="hero" ref={containerRef} className="relative h-screen w-full overflow-hidden bg-transparent z-10 pointer-events-none">
        <div className="hero-content-wrapper absolute inset-0 w-full h-full">
          {/* Persistent HUD Overlay */}
          <div className="hero-hud absolute inset-0 p-6 md:p-10 flex flex-col justify-between z-50 pointer-events-none font-mono text-[10px] md:text-xs text-white/30 tracking-[0.2em] uppercase">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span>TERMINAL V1.0</span>
                <span>INITIALIZED</span>
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
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent"></div>
              </div>
            </div>
          </div>

          <div className="scene-container absolute inset-0 w-full h-full pointer-events-none">

            {/* Centerpiece Dimmer Overlay */}
            <div className="centerpiece-dimmer absolute inset-0 bg-transparent z-0 pointer-events-none"></div>

            {/* SCENE 1: Identity Reveal (Occurs initially before scrolling) */}
            <div ref={scene1Ref} className="absolute inset-0 pointer-events-auto z-40">

              {/* Name and Title perfectly centered but moved slightly up */}
              <div className="absolute top-[calc(50%-100px)] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full z-30">
                <h1 className="name-title text-6xl md:text-8xl lg:text-[10rem] font-serif italic tracking-wide text-white text-center flex justify-center whitespace-nowrap">
                  {"Bhyresh BS".split("").map((char, index) => (
                    <span
                      key={index}
                      className="name-char opacity-0 inline-block translate-y-4 blur-[8px]"
                      style={{ width: char === ' ' ? '0.3em' : 'auto' }}
                    >
                      {char}
                    </span>
                  ))}
                </h1>

                <p className="post-reveal-title opacity-0 text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-white/40 text-center mt-6">
                  AI & Machine Learning Engineer
                </p>
              </div>

            </div>

            {/* SCENE 2 */}
            <div ref={scene2Ref} className="absolute inset-0 flex items-center justify-center invisible z-10">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white/90 text-center leading-[1.2]">
                Everything<br />begins<br /><span className="text-white/40 italic">with an idea.</span>
              </h2>
            </div>

            {/* SCENE 3 */}
            <div ref={scene3Ref} className="absolute inset-0 flex items-center justify-center invisible z-10">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white/90 text-center leading-[1.2]">
                Ideas<br />become<br /><span className="text-white/40 italic">systems.</span>
              </h2>
            </div>

            {/* SCENE 4 */}
            <div ref={scene4Ref} className="absolute inset-0 flex items-center justify-center invisible z-10">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white/90 text-center leading-[1.2]">
                Systems<br />become<br /><span className="text-white/40 italic">experiences.</span>
              </h2>
            </div>

            {/* SCENE 5 */}
            <div ref={scene5Ref} className="absolute inset-0 flex flex-col items-center justify-center invisible z-10 pointer-events-auto">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white/90 text-center leading-[1.2] mb-16">
                Experiences<br />become<br /><span className="text-white/40 italic">reality.</span>
              </h2>

              {/* Cinematic Call to Action at the end of the story */}
              <div className="post-reveal mt-8">
                <button
                  onClick={scrollToAbout}
                  className="group flex flex-col items-center gap-4 cursor-pointer outline-none border-none bg-transparent"
                >
                  <span
                    className="text-xs font-mono uppercase tracking-[0.3em] text-white/90 group-hover:text-white group-hover:tracking-[0.4em] transition-all duration-500"
                    style={{ textShadow: "0px 2px 10px rgba(0,0,0,1), 0px 4px 20px rgba(0,0,0,0.8)" }}
                  >
                    Begin Journey
                  </span>

                  {/* Vertical indicator instead of a button container */}
                  <div className="w-[1px] h-8 bg-gradient-to-b from-white/60 to-transparent group-hover:h-12 group-hover:from-cyan-400 transition-all duration-500"></div>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
