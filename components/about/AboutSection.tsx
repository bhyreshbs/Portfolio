"use client";

import { useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect } from "react";
import { EASE, SectionHeader, SpotlightCard } from "@/components/ui/primitives";

const STATEMENT =
  "I build intelligent products and interactive web experiences where engineering, machine learning and design work together.";

// Figures taken from github.com/bhyreshbs (public, non-fork repos)
const STATS = [
  { value: 10, suffix: "", label: "Public repos" },
  { value: 4, suffix: "", label: "Live demos" },
  { value: 6, suffix: "", label: "Languages shipped" },
];

const ROW_A = ["Artificial Intelligence", "Machine Learning", "LLM Apps", "Computer Vision", "Agentic AI"];
const ROW_B = ["Python", "TypeScript", "Kotlin", "Next.js", "React", "Docker", "C++"];

/** One word of the statement; brightens as scroll progress passes it. */
function Word({ word, i, n, p }: { word: string; i: number; n: number; p: MotionValue<number> }) {
  // Word i lights up over [i/n·0.8, i/n·0.8 + 0.2], so even the last word is fully lit by 100%.
  // Function form on purpose: the array form runs on the native scroll timeline, which
  // wraps back to the first keyframe once progress passes the end of a short range.
  const start = (i / n) * 0.8;
  const opacity = useTransform(p, (v) => 0.3 + 0.7 * Math.min(1, Math.max(0, (v - start) / 0.2)));
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration: 1.6, ease: "easeOut" });
    return () => c.stop();
  }, [inView, mv, to]);
  return <motion.span ref={ref}>{text}</motion.span>;
}

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // Duplicate once; the keyframe moves by exactly half the track
  const track = [...items, ...items];
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
      <div
        className="flex shrink-0 gap-3 pr-3 will-change-transform [animation-play-state:running] hover:[animation-play-state:paused]"
        style={{ animation: `marquee 28s linear infinite ${reverse ? "reverse" : "normal"}` }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const tile = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export default function AboutSection() {
  const statementRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: statementRef, offset: ["start 0.85", "end 0.45"] });
  const words = STATEMENT.split(" ");

  return (
    <section id="about" className="relative z-10 w-full pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <SectionHeader index="01" label="About" title="About" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {/* Statement — each word lights up as you scroll */}
          <motion.div
            {...tile}
            transition={{ duration: 0.8, ease: EASE }}
            className="md:col-span-12"
          >
            <div ref={statementRef}>
              <p className="max-w-4xl text-3xl font-light leading-[1.25] tracking-tight text-white md:text-5xl">
                {words.map((w, i) => (
                  <Word key={i} word={w} i={i} n={words.length} p={scrollYProgress} />
                ))}
              </p>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div {...tile} transition={{ duration: 0.8, ease: EASE }} className="md:col-span-5">
            <SpotlightCard tilt accent="#00f0ff" className="h-full min-h-[14rem] p-8">
              <div
                aria-hidden
                className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40 will-change-transform"
                style={{
                  background: "conic-gradient(from 0deg, #7b61ff, #00f0ff, #34d399, #7b61ff)",
                  animation: "spin-slow 14s linear infinite",
                  maskImage: "radial-gradient(circle, transparent 52%, #000 54%, #000 70%, transparent 72%)",
                  WebkitMaskImage: "radial-gradient(circle, transparent 52%, #000 54%, #000 70%, transparent 72%)",
                }}
              />
              <div className="relative z-20 flex h-full flex-col justify-end">
                <span className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-cyan-500">Education</span>
                <h3 className="font-serif text-5xl italic leading-none text-white">B.Tech</h3>
                <p className="mt-3 text-white/60">Artificial Intelligence & Machine Learning</p>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Stats */}
          <motion.div {...tile} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }} className="md:col-span-7">
            <SpotlightCard accent="#7b61ff" className="h-full p-6 sm:p-8">
              <div className="relative z-20 flex h-full flex-col justify-between gap-6">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {STATS.map((s) => (
                    <div key={s.label}>
                      <div className="font-serif text-4xl italic text-white sm:text-5xl md:text-6xl">
                        <CountUp to={s.value} suffix={s.suffix} />
                      </div>
                      <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-white/45 sm:text-[11px] sm:tracking-widest">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
                <span className="self-end font-mono text-[10px] uppercase tracking-widest text-white/25">via GitHub</span>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Marquee */}
          <motion.div {...tile} transition={{ duration: 0.8, ease: EASE }} className="md:col-span-12">
            <SpotlightCard accent="#34d399" lift={3} className="space-y-3 py-6">
              <div className="relative z-20 space-y-3">
                <MarqueeRow items={ROW_A} />
                <MarqueeRow items={ROW_B} reverse />
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
