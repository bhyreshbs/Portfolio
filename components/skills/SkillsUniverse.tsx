"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SkillChip from "./SkillChip";
import { cn } from "@/utils/cn";

// Import Icons
import {
  SiC, SiCplusplus, SiJavascript, SiPython, SiHtml5, SiCss,
  SiReact, SiTailwindcss, SiVercel, SiPrisma,
  SiMongodb, SiMysql, SiSupabase, SiSqlite, SiPostgresql,
  SiCanvas, SiBlender, SiGithub, SiUnity
} from "react-icons/si";
import { VscTerminalPowershell } from "react-icons/vsc";

gsap.registerPlugin(ScrollTrigger);

const SKILL_CATEGORIES = [
  {
    id: "languages",
    title: "LANGUAGES",
    skills: [
      { name: "C", icon: <SiC className="text-[#A8B9CC] w-full h-full" /> },
      { name: "C++", icon: <SiCplusplus className="text-[#00599C] w-full h-full" /> },
      { name: "JavaScript", icon: <SiJavascript className="text-[#F7DF1E] w-full h-full" /> },
      { name: "Python", icon: <SiPython className="text-[#3776AB] w-full h-full" /> },
      { name: "PowerShell", icon: <VscTerminalPowershell className="text-[#5391FE] w-full h-full" /> },
      { name: "HTML5", icon: <SiHtml5 className="text-[#E34F26] w-full h-full" /> },
      { name: "CSS3", icon: <SiCss className="text-[#1572B6] w-full h-full" /> },
    ]
  },
  {
    id: "frameworks",
    title: "FRAMEWORKS",
    skills: [
      { name: "React", icon: <SiReact className="text-[#61DAFB] w-full h-full" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="text-[#06B6D4] w-full h-full" /> },
      { name: "Vercel", icon: <SiVercel className="text-white w-full h-full" /> },
      { name: "Prisma", icon: <SiPrisma className="text-white w-full h-full" /> },
    ]
  },
  {
    id: "databases",
    title: "DATABASES",
    skills: [
      { name: "MongoDB", icon: <SiMongodb className="text-[#47A248] w-full h-full" /> },
      { name: "MySQL", icon: <SiMysql className="text-[#4479A1] w-full h-full" /> },
      { name: "Supabase", icon: <SiSupabase className="text-[#3ECF8E] w-full h-full" /> },
      { name: "SQLite", icon: <SiSqlite className="text-[#003B57] w-full h-full" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="text-[#4169E1] w-full h-full" /> },
    ]
  },
  {
    id: "creative",
    title: "CREATIVE TOOLS",
    skills: [
      { name: "Canva", icon: <SiCanvas className="text-[#00C4CC] w-full h-full" /> },
      { name: "Blender", icon: <SiBlender className="text-[#F5792A] w-full h-full" /> },
      { name: "GitHub", icon: <SiGithub className="text-white w-full h-full" /> },
      { name: "Unity", icon: <SiUnity className="text-white w-full h-full" /> },
    ]
  }
];

export default function SkillsUniverse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const capsulesRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=4000", // Long scroll for sequential pacing
        pin: true,
        scrub: 1,
      }
    });

    // 1. Title Fade In & Out
    tl.from(titleRef.current, { opacity: 0, scale: 0.8, filter: "blur(20px)", duration: 1 })
      .to(titleRef.current, { opacity: 0, y: -50, filter: "blur(10px)", duration: 1 }, "+=0.5");

    // Setup capsules and orchestrate their sequential reveal
    capsulesRef.current.forEach((capsule, index) => {
      if (!capsule) return;

      const innerContent = capsule.querySelector('.capsule-content');
      const icons = capsule.querySelectorAll('.skill-chip-wrapper');

      // Calculate distance to center
      const rect = capsule.getBoundingClientRect();
      const centerX = window.innerWidth / 2 - (rect.left + rect.width / 2);

      // Initial state: Hidden above screen, positioned at center X, height 0
      gsap.set(capsule, { y: -window.innerHeight, x: centerX, opacity: 0 });
      gsap.set(innerContent, { height: 0, opacity: 0 });
      gsap.set(icons, { opacity: 0, scale: 0.5, y: 20 });

      // Drop into center
      tl.to(capsule, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "back.out(1.2)"
      }, index === 0 ? "-=0.5" : "+=0.2");

      // Unfold (expand height)
      tl.to(innerContent, {
        height: "auto",
        opacity: 1,
        duration: 1,
        ease: "power3.inOut"
      });

      // Stagger icons in
      tl.to(icons, {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.5)"
      });

      // Slide to natural flex position
      tl.to(capsule, {
        x: 0,
        duration: 1.2,
        ease: "power3.inOut"
      }, "+=0.5");
    });

  }, { scope: containerRef });

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center border-t border-white/[0.05]"
    >
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Title */}
      <h2
        ref={titleRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-8xl font-light tracking-[0.2em] text-white/90 z-0"
      >
        TECHNOLOGIES
      </h2>

      {/* Capsules Container */}
      <div className="relative z-10 w-full max-w-[1400px] px-4 md:px-10 flex flex-wrap lg:flex-nowrap justify-center gap-6 md:gap-8 items-start">
        {SKILL_CATEGORIES.map((category, index) => (
          <div
            key={category.id}
            ref={(el) => { capsulesRef.current[index] = el; }}
            className={cn(
              "w-full sm:w-[calc(50%-12px)] lg:w-1/4 flex flex-col items-center",
              "bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px]",
              "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
            )}
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>

            {/* Header (Always Visible once dropped) */}
            <div className="w-full h-16 md:h-20 flex items-center justify-center border-b border-white/5 relative z-10">
              <span className="font-mono text-sm md:text-base tracking-[0.2em] text-white/80 uppercase">
                {category.title}
              </span>
            </div>

            {/* Unfolding Content Container */}
            <div className="capsule-content w-full relative z-10 overflow-hidden">
              <div className="p-4 md:p-6 flex flex-col gap-3">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skill.name} className="skill-chip-wrapper">
                    <SkillChip name={skill.name} icon={skill.icon} delay={skillIdx * 0.1} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
