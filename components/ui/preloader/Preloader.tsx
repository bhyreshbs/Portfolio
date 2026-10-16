"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Fast-path bypass if already visited in this session
    if (sessionStorage.getItem("hasVisited")) {
      setIsComplete(true);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("hasVisited", "true");
        setIsComplete(true);
      },
    });

    // Initial delay for realism
    tl.to(".loading-bar-fill", { width: "100%", duration: 0.9, ease: "expo.inOut" })
      // Slide the entire preloader up and out (~2s total)
      .to(containerRef.current, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "+=0.1");

  }, { scope: containerRef });

  if (isComplete) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas text-white"
    >
      <div className="w-full max-w-md px-8 flex flex-col gap-6">
        <div className="flex justify-between items-end font-mono text-xs text-white/50 tracking-widest">
          <span ref={textRef}>INITIALIZING SEQUENCE...</span>
          <span>v2.0.26</span>
        </div>
        
        <div className="h-[2px] w-full bg-white/10 relative overflow-hidden">
          <div className="loading-bar-fill absolute top-0 left-0 h-full bg-white w-0 shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
        </div>
      </div>
      
      {/* Background Grid for Preloader */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,rgb(var(--fg))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--fg))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
    </div>
  );
}
