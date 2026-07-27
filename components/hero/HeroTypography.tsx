"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { cn } from "@/utils/cn";

interface HeroTypographyProps {
  className?: string;
}

export default function HeroTypography({ className }: HeroTypographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current || !nameRef.current) return;

    // Split text into words and chars
    const titleSplit = new SplitType(titleRef.current, { types: "chars,words" });
    const subtitleSplit = new SplitType(subtitleRef.current, { types: "lines,words" });
    const nameSplit = new SplitType(nameRef.current, { types: "chars" });

    // Initial state setup for animations
    gsap.set([titleSplit.chars, nameSplit.chars, subtitleSplit.lines], {
      y: 100,
      opacity: 0,
      rotateX: -90,
      transformOrigin: "50% 50% -50px",
    });

    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(nameSplit.chars, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      stagger: 0.02,
      duration: 1,
      ease: "power4.out",
    })
      .to(
        titleSplit.chars,
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.03,
          duration: 1.2,
          ease: "expo.out",
        },
        "-=0.6"
      )
      .to(
        subtitleSplit.lines,
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8"
      );

    return () => {
      titleSplit.revert();
      subtitleSplit.revert();
      nameSplit.revert();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pointer-events-none select-none",
        className
      )}
    >
      <p
        ref={nameRef}
        className="text-white/60 text-sm md:text-base font-mono tracking-[0.3em] uppercase mb-6 drop-shadow-lg"
      >
        Bhyresh BS
      </p>

      <h1
        ref={titleRef}
        className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight text-white/95 mb-8"
        style={{ perspective: "1000px" }}
      >
        AI/ML Engineering Student
      </h1>

      <p
        ref={subtitleRef}
        className="max-w-xl text-lg md:text-xl text-white/50 leading-relaxed font-light drop-shadow-md"
        style={{ perspective: "1000px" }}
      >
        Crafting intelligent systems and cinematic digital experiences.
        Pushing the boundaries of artificial intelligence and interactive design.
      </p>
    </div>
  );
}
