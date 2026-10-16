"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { cn } from "@/utils/cn";
import { EASE, FilterTabs, SectionHeader, SpotlightCard } from "@/components/ui/primitives";

interface Project {
  name: string;
  summary: string;
  badge: string;
  tags: string[];
  repo: string;
  live?: string;
  /** Two accent colours for the card artwork */
  accent: [string, string];
}

// Picked from github.com/bhyreshbs — the AI/ML-leaning, most complete repos
export const PROJECTS: Project[] = [
  {
    name: "FraudMesh 3.0",
    summary:
      "Turns scattered fraud, KYC and device signals into one explainable attack case, and acts before money moves.",
    badge: "Hackathon · Fraud ML",
    tags: ["Python", "TypeScript", "Entity Graph", "Docker"],
    repo: "https://github.com/bhyreshbs/Fraud-Mesh",
    accent: ["#7b61ff", "#00f0ff"],
  },
  {
    name: "COMS",
    summary:
      "Plain-English interface for provisioning AWS resources, with policy checks, approval workflows and audit logs.",
    badge: "AI · Cloud",
    tags: ["Python", "LLM", "AWS", "Docker"],
    repo: "https://github.com/bhyreshbs/COMS---Cloud-Orchestrator-and-Management-System",
    live: "https://coas.onrender.com",
    accent: ["#00f0ff", "#3b82f6"],
  },
  {
    name: "AshaSaathi",
    summary:
      "Offline-first Android assistant for ASHA health workers: voice input, risk flagging and vaccine tracking, on-device.",
    badge: "Android · On-device AI",
    tags: ["Kotlin", "Jetpack Compose", "TFLite", "Whisper"],
    repo: "https://github.com/bhyreshbs/AshaSaathi",
    accent: ["#34d399", "#06b6d4"],
  },
  {
    name: "Voyiq",
    summary:
      "AI trip planner and transport management platform with interactive maps, role-based access and Gemini itineraries.",
    badge: "Full-stack · AI",
    tags: ["Next.js", "React", "TypeScript", "LLM"],
    repo: "https://github.com/bhyreshbs/Voyiq",
    live: "https://voyiq-beryl.vercel.app",
    accent: ["#f59e0b", "#ef4444"],
  },
  {
    name: "Noti-Files",
    // The repo isn't public, so there is no description to draw from yet
    summary: "Notes and files project. A full write-up is coming soon.",
    badge: "Project",
    tags: ["In progress"],
    repo: "https://github.com/bhyreshbs/Noti-Files",
    accent: ["#ec4899", "#7b61ff"],
  },
  {
    name: "PDF-Flux",
    summary:
      "Privacy-first PDF colour inverter with a live before/after preview and four inversion modes, built on Apache PDFBox.",
    badge: "Web app · PDF",
    tags: ["Java", "Spring Boot", "JavaScript", "Docker"],
    repo: "https://github.com/bhyreshbs/PDF-Flux",
    accent: ["#f59e0b", "#ec4899"],
  },
  {
    name: "KalaSethu",
    summary:
      "Digital marketplace for Indian art: live auctions, artist verification and community forums, powered by Firebase.",
    badge: "Full-stack · Marketplace",
    tags: ["Next.js", "TypeScript", "Firebase", "Zustand"],
    repo: "https://github.com/BUSETTY-SUGNESH/KalaSethu",
    live: "https://kala-sethu.vercel.app",
    accent: ["#34d399", "#7b61ff"],
  },
  {
    name: "Smart Home IoT",
    summary:
      "ESP32 door lock, lights and sensors with a motion-triggered OpenCV camera, controlled remotely through Blynk.",
    badge: "IoT · Computer vision",
    tags: ["ESP32", "C++", "Python", "OpenCV"],
    repo: "https://github.com/bhyreshbs/Smart-Home-IoT",
    accent: ["#22d3ee", "#10b981"],
  },
];

// Filter tabs are derived from the data: any tag used by 2+ projects
const FILTERS = (() => {
  const counts = new Map<string, number>();
  PROJECTS.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  const tags = [...counts].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  return ["All", ...tags].map((id) => ({ id, title: id }));
})();

function ProjectCard({
  project,
  index,
  activeTag,
  onTag,
}: {
  project: Project;
  index: number;
  activeTag: string;
  onTag: (tag: string) => void;
}) {
  const [c1, c2] = project.accent;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.08 }}
    >
      <SpotlightCard tilt accent={c1} className="flex h-full min-h-[26rem] flex-col">
        {/* Artwork */}
        <div className="relative h-40 shrink-0 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-55 [.light_&]:opacity-80 [.light_&]:group-hover:opacity-100"
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
          />
          {/* Light mode: deepen the artwork so it reads as a rich panel, not a pastel wash */}
          <div
            aria-hidden
            className="absolute inset-0 hidden [.light_&]:block"
            style={{ background: "linear-gradient(160deg, rgba(20,18,50,0.18), rgba(20,18,50,0.5))" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(var(--fg)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--fg)) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <span
            aria-hidden
            className="absolute -bottom-4 right-4 select-none font-serif text-8xl italic text-white/15 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-canvas/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/80 backdrop-blur-md">
            {project.badge}
          </span>
        </div>

        {/* Body */}
        <div className="relative z-20 flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h3 className="text-2xl font-semibold tracking-tight text-white">{project.name}</h3>
            <ArrowUpRight
              aria-hidden
              className="mt-1 h-5 w-5 shrink-0 text-white/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
            />
          </div>

          <p className="mb-5 text-sm leading-relaxed text-white/60">{project.summary}</p>

          {/* Tech tags: click to filter; matching tags light up */}
          <ul className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => {
              const active = activeTag === tag;
              return (
                <li key={tag}>
                  <button
                    type="button"
                    onClick={() => onTag(active ? "All" : tag)}
                    className={cn(
                      "rounded-full border px-3 py-1 font-mono text-[11px] outline-none transition-all duration-300 hover:-translate-y-0.5",
                      active
                        ? "border-transparent text-white"
                        : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:text-white"
                    )}
                    style={active ? { background: `linear-gradient(135deg, ${c1}66, ${c2}66)` } : undefined}
                  >
                    {tag}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto flex items-center gap-3">
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 outline-none transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <SiGithub size={15} /> Code
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-canvas outline-none transition-transform hover:scale-[1.04]"
              >
                Live <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </div>
      </SpotlightCard>
    </motion.article>
  );
}

const GITHUB_REPOS = "https://github.com/bhyreshbs?tab=repositories";

/** "View more" tile: same footprint as a project card, links to the full repo list. */
function ViewMoreCard() {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <a
        href={GITHUB_REPOS}
        target="_blank"
        rel="noreferrer"
        aria-label="View more projects on GitHub"
        className="block h-full rounded-3xl outline-none"
      >
        <SpotlightCard
          tilt
          accent="#7b61ff"
          className="flex h-full min-h-[26rem] flex-col items-center justify-center gap-6 border-dashed p-8 text-center"
        >
          <span className="relative z-20 flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] text-white transition-all duration-500 group-hover:rotate-45 group-hover:scale-110 group-hover:bg-white group-hover:text-canvas">
            <ArrowUpRight className="h-9 w-9" />
          </span>
          <div className="relative z-20">
            <h3 className="font-serif text-4xl italic text-white">View more</h3>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-white/55">
              <SiGithub size={15} /> All repositories on GitHub
            </p>
          </div>
        </SpotlightCard>
      </a>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const [tag, setTag] = useState("All");

  const visible = useMemo(
    () => (tag === "All" ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(tag))),
    [tag]
  );

  return (
    <section id="projects" className="relative z-10 w-full py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <SectionHeader index="03" label="Work" title="Work">
          <FilterTabs items={FILTERS} value={tag} onChange={setTag} layoutId="work-filter-pill" label="Filter projects by technology" />
        </SectionHeader>

        {/* On desktop the min-height keeps the page from jumping when a filter hides cards */}
        <motion.div layout className="grid grid-cols-1 content-start gap-6 md:grid-cols-2 lg:min-h-[54rem] lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProjectCard key={p.name} project={p} index={i} activeTag={tag} onTag={setTag} />
            ))}
            <ViewMoreCard key="view-more" />
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
