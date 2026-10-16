"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePerfTier } from "@/utils/lowEnd";
import { FilterTabs, SectionHeader, SpotlightCard } from "@/components/ui/primitives";

import {
  SiC, SiCplusplus, SiJavascript, SiPython, SiHtml5, SiCss,
  SiReact, SiTailwindcss, SiVercel, SiPrisma,
  SiMongodb, SiMysql, SiSupabase, SiSqlite, SiPostgresql,
  SiCanvas, SiAutodesk, SiGithub, SiUnity
} from "react-icons/si";
import { VscTerminalPowershell } from "react-icons/vsc";

const SKILL_CATEGORIES = [
  {
    id: "languages",
    title: "Languages",
    skills: [
      { name: "C", icon: <SiC className="text-[#A8B9CC] [.light_&]:text-[#5f7a94] w-full h-full" /> },
      { name: "C++", icon: <SiCplusplus className="text-[#00599C] w-full h-full" /> },
      { name: "JavaScript", icon: <SiJavascript className="text-[#F7DF1E] w-full h-full" /> },
      { name: "Python", icon: <SiPython className="text-[#3776AB] w-full h-full" /> },
      { name: "PowerShell", icon: <VscTerminalPowershell className="text-[#5391FE] w-full h-full" /> },
      { name: "HTML5", icon: <SiHtml5 className="text-[#E34F26] w-full h-full" /> },
      { name: "CSS3", icon: <SiCss className="text-[#1572B6] w-full h-full" /> },
    ],
  },
  {
    id: "frameworks",
    title: "Frameworks",
    skills: [
      { name: "React", icon: <SiReact className="text-[#61DAFB] [.light_&]:text-[#0b86a8] w-full h-full" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="text-[#06B6D4] [.light_&]:text-[#0a7f99] w-full h-full" /> },
      { name: "Vercel", icon: <SiVercel className="text-white w-full h-full" /> },
      { name: "Prisma", icon: <SiPrisma className="text-white w-full h-full" /> },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    skills: [
      { name: "MongoDB", icon: <SiMongodb className="text-[#47A248] w-full h-full" /> },
      { name: "MySQL", icon: <SiMysql className="text-[#4479A1] w-full h-full" /> },
      { name: "Supabase", icon: <SiSupabase className="text-[#3ECF8E] w-full h-full" /> },
      { name: "SQLite", icon: <SiSqlite className="text-[#4B9CD3] w-full h-full" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="text-[#4169E1] w-full h-full" /> },
    ],
  },
  {
    id: "creative",
    title: "Creative",
    skills: [
      { name: "Canva", icon: <SiCanvas className="text-[#00C4CC] [.light_&]:text-[#00858b] w-full h-full" /> },
      { name: "Autodesk Fusion 360", icon: <SiAutodesk className="text-[#F58220] w-full h-full" /> },
      { name: "GitHub", icon: <SiGithub className="text-white w-full h-full" /> },
      { name: "Unity", icon: <SiUnity className="text-white w-full h-full" /> },
    ],
  },
];

const TABS = [{ id: "all", title: "All" }, ...SKILL_CATEGORIES.map(({ id, title }) => ({ id, title }))];

function SkillNode({
  name,
  icon,
  index,
  float,
}: {
  name: string;
  icon: React.ReactNode;
  index: number;
  float: boolean;
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
    >
      {/* Floating wrapper (transform-only loop, desynchronised per tile) */}
      <motion.div
        animate={float ? { y: [0, -7, 0] } : undefined}
        transition={
          float
            ? { duration: 3.4 + (index % 5) * 0.5, repeat: Infinity, ease: "easeInOut", delay: (index % 7) * 0.2 }
            : undefined
        }
        className="h-full will-change-transform"
      >
        <SpotlightCard lift={4} className="flex h-full flex-col items-center gap-3 rounded-2xl px-2 py-5 sm:gap-4 sm:rounded-3xl sm:px-3 sm:py-6">
          <div className="relative z-20 h-9 w-9 md:h-10 md:w-10">{icon}</div>
          <span className="relative z-20 max-w-full text-balance break-words text-center font-mono text-[11px] leading-snug tracking-wide text-white/55 sm:text-xs transition-colors duration-300 group-hover:text-white">
            {name}
          </span>
        </SpotlightCard>
      </motion.div>
    </motion.li>
  );
}

export default function SkillsUniverse() {
  const [tab, setTab] = useState("all");
  // 20 continuously floating tiles = 20 live compositor layers: high tier only
  const float = usePerfTier() === "high";

  const nodes = useMemo(
    () =>
      SKILL_CATEGORIES.filter((c) => tab === "all" || c.id === tab).flatMap((c) => c.skills),
    [tab]
  );

  return (
    <section id="skills" className="relative z-10 w-full py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <SectionHeader index="02" label="Skills" title="Skills">
          <FilterTabs items={TABS} value={tab} onChange={setTab} layoutId="skills-filter-pill" label="Filter skills by category" />
        </SectionHeader>

        {/* Min-height on desktop so filtering doesn't make the page jump */}
        <motion.ul layout className="grid grid-cols-2 content-start gap-3 min-[380px]:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:min-h-[26rem] lg:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {nodes.map((skill, i) => (
              <SkillNode key={skill.name} name={skill.name} icon={skill.icon} index={i} float={float} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
