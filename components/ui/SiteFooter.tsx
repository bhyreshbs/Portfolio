"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Download, Mail } from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { cn } from "@/utils/cn";
import { EASE, SpotlightCard } from "@/components/ui/primitives";
import { setPerfPreference, usePerfPreference, usePerfTier, type PerfPreference } from "@/utils/lowEnd";

const TICKER = ["Python", "TypeScript", "Kotlin", "Next.js", "React", "LLM Apps", "Computer Vision", "Docker", "AWS", "Agentic AI"];

// Contact channels (the footer is the contact section)
const CHANNELS = [
  {
    name: "Email",
    hint: "Best for projects",
    href: "mailto:bhyreshbs926@gmail.com",
    icon: <Mail size={20} />,
    accent: "#7b61ff",
  },
  {
    name: "LinkedIn",
    hint: "Let's connect",
    href: "https://www.linkedin.com/in/bhyresh-bs-1a1000380/",
    icon: <FaLinkedin size={20} />,
    external: true,
    accent: "#0a66c2",
  },
  {
    name: "GitHub",
    hint: "See the code",
    href: "https://github.com/bhyreshbs",
    icon: <SiGithub size={20} />,
    external: true,
    accent: "#34d399",
  },
  {
    name: "Resume",
    hint: "Download PDF",
    href: "/Resume.pdf", // lives in public/
    icon: <Download size={20} />,
    download: true,
    accent: "#ff5fa2",
  },
];

const LINKS = [
  { name: "Intro", href: "/#hero" },
  { name: "About", href: "/#about" },
  { name: "Skills", href: "/#skills" },
  { name: "Work", href: "/#projects" },
];

/** Live IST clock. Empty until mounted so server and client markup match. */
function Clock() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-white/60">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="tabular-nums">{now || "--:--:--"}</span> IST
    </span>
  );
}

const PERF_OPTIONS: { id: PerfPreference; label: string; hint: string }[] = [
  { id: "auto", label: "Auto", hint: "Match my device" },
  { id: "high", label: "Full", hint: "All effects" },
  { id: "medium", label: "Balanced", hint: "Lighter blur, fewer layers" },
  { id: "low", label: "Lite", hint: "No blur or motion effects" },
];

/** Visual-quality switch: lets a visitor override the automatic GPU/device tier. */
function PerfSwitch() {
  const pref = usePerfPreference();
  const tier = usePerfTier();
  const tierLabel = tier === "high" ? "Full" : tier === "medium" ? "Balanced" : "Lite";

  return (
    <div className="flex items-center gap-3">
      <span className="hidden font-mono uppercase tracking-widest sm:inline">
        Visuals{pref === "auto" ? ` · auto (${tierLabel})` : ""}
      </span>
      <div role="radiogroup" aria-label="Visual quality" className="flex rounded-full border border-white/15 p-0.5">
        {PERF_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={pref === o.id}
            title={o.hint}
            onClick={() => setPerfPreference(o.id)}
            className={cn(
              "rounded-full px-3 py-1 font-mono uppercase tracking-widest outline-none transition-colors",
              pref === o.id ? "bg-white text-canvas" : "text-white/55 hover:text-white"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SiteFooter() {
  const track = [...TICKER, ...TICKER];

  return (
    <footer id="contact" className="relative z-10 mt-8 w-full overflow-hidden border-t border-white/10 pt-16">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-10"
        >
          <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            <span>04</span>
            <span className="h-px w-10 bg-white/25" />
            <span>Contact</span>
          </p>
          <h2 className="font-serif text-5xl italic tracking-tight text-white md:text-8xl">
            Let&apos;s{" "}
            <span className="bg-gradient-to-r from-[#7b61ff] via-[#00a8d4] to-[#ff5fa2] bg-clip-text text-transparent">
              talk
            </span>
          </h2>
          <p className="mt-4 max-w-md text-white/55">
            Have a project, an idea or an opportunity? Pick whichever channel suits you.
          </p>
        </motion.div>

        {/* Channels */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c, i) => (
            <motion.a
              key={c.name}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noreferrer" } : null)}
              {...(c.download ? { download: "Bhyresh_BS_Resume.pdf" } : null)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.07 }}
              className="block rounded-3xl outline-none"
            >
              <SpotlightCard accent={c.accent} className="flex h-full min-h-[9.5rem] flex-col justify-between p-6">
                <div className="relative z-20 flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition-colors duration-300 group-hover:bg-white group-hover:text-canvas">
                    {c.icon}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="h-5 w-5 text-white/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  />
                </div>
                <div className="relative z-20">
                  <div className="text-lg font-semibold text-white">{c.name}</div>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-white/45">{c.hint}</div>
                </div>
              </SpotlightCard>
            </motion.a>
          ))}
        </div>

        {/* Link columns */}
        <div className="mt-14 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white/40">Navigate</h4>
            <ul className="space-y-2">
              {LINKS.map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="text-white/70 transition-colors hover:text-white">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white/40">Also on</h4>
            <a
              href="https://x.com/bhyreshbs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
            >
              <SiX size={15} /> X / Twitter
            </a>
          </div>

          <div className="col-span-2">
            <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white/40">Local time</h4>
            <Clock />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Building AI products and interactive experiences. Ask the assistant in the corner anything about my work.
            </p>
          </div>
        </div>
      </div>

      {/* Tech ticker */}
      <div className="mt-14 border-y border-white/10 py-4 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 gap-10 pr-10 will-change-transform" style={{ animation: "marquee 40s linear infinite" }}>
            {track.map((t, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-[0.25em] text-white/35">
                {t}
                <span className="h-1 w-1 rounded-full bg-white/30" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Giant outlined name */}
      <div aria-hidden className="select-none px-4 text-center">
        <span
          className="block whitespace-nowrap font-serif italic leading-[0.9] text-transparent"
          style={{
            fontSize: "clamp(3.5rem, 17vw, 17rem)",
            WebkitTextStroke: "1.5px rgb(var(--fg) / 0.22)",
            maskImage: "linear-gradient(to bottom, #000 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 40%, transparent 100%)",
          }}
        >
          Bhyresh BS
        </span>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 pb-28 pt-2 text-xs lg:pb-8 text-white/40 md:px-12">
        <span className="font-mono uppercase tracking-widest">&copy; {new Date().getFullYear()} Bhyresh BS</span>
        <PerfSwitch />
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono uppercase tracking-widest text-white/60 outline-none transition-colors hover:border-white/40 hover:text-white"
        >
          Back to top <ArrowUp size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
