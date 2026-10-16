"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import SecureImage from "@/components/ui/secure-image/SecureImage";

const NAME = "Bhyresh BS";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Progress (0–1, smoothstepped) of `v` through the window [from, to]. */
const win = (v: number, from: number, to: number) => {
  const x = clamp01((v - from) / (to - from));
  return x * x * (3 - 2 * x);
};

/*
 * Exit choreography, in scroll progress `s` (0–1 over the 40vh pin ≈ 360px at 900px tall).
 * Elements leave one at a time — details first, then the photo, then the name:
 *   role   0.00 – 0.14
 *   photo  0.10 – 0.26   → pops into the navbar logo tile (LiquidNav)
 *   name   0.22 – 0.57   → letters leave left→right, then drop into the navbar (LiquidNav)
 *
 * All scroll-linked values use the function form of useTransform on purpose: the array
 * form is handed to the browser's native scroll timeline, which wraps/behaves differently
 * between Chrome versions (the hero faded, then re-appeared, or never faded).
 */
const ROLE_EXIT: [number, number] = [0, 0.1];
const PHOTO_EXIT: [number, number] = [0.03, 0.12];
const NAME_EXIT_START = 0.17;
const LETTER_STAGGER = 0.035;
const LETTER_SPAN = 0.15; // each letter takes ~15% of the pin; letters overlap into a wave
// → the last letter finishes at 0.17 + 9·0.035 + 0.15 ≈ 0.64 of the pin (≈ 460px at 900px tall)

/** One letter: enters on time `t`, leaves on scroll `s` (staggered by index). */
function Letter({
  char,
  index,
  t,
  s,
}: {
  char: string;
  index: number;
  t: MotionValue<number>;
  s: MotionValue<number>;
}) {
  const enterStart = index * 0.035;
  const exitStart = NAME_EXIT_START + index * LETTER_STAGGER;
  const both = [t, s] as MotionValue<number>[];

  const opacity = useTransform(both, ([tv, sv]: number[]) => win(tv, enterStart, enterStart + 0.2) * (1 - win(sv, exitStart, exitStart + LETTER_SPAN)));
  const y = useTransform(both, ([tv, sv]: number[]) => (1 - win(tv, enterStart, enterStart + 0.2)) * 36 - win(sv, exitStart, exitStart + LETTER_SPAN) * 48);
  const scale = useTransform(both, ([tv, sv]: number[]) => (0.85 + 0.15 * win(tv, enterStart, enterStart + 0.2)) * (1 - 0.12 * win(sv, exitStart, exitStart + LETTER_SPAN)));

  return (
    <motion.span
      style={{ opacity, y, scale, width: char === " " ? "0.3em" : "auto" }}
      className="inline-block will-change-transform"
    >
      {char}
    </motion.span>
  );
}

/**
 * Intro. On load (time-driven) the name types in, the role appears, the name lifts and
 * the profile photo rises in. On scroll (CSS sticky, 80vh of travel) the pieces leave one
 * by one while their counterparts land in the navbar.
 */
export default function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Spring-smoothed progress: a single wheel notch (which jumps ~100px at once) now eases
  // through the exit choreography over ~0.5s instead of snapping to the end state.
  const s = useSpring(raw, { stiffness: 70, damping: 24, mass: 0.6, restDelta: 0.0005 });

  const t = useMotionValue(0);
  useEffect(() => {
    const delay = sessionStorage.getItem("hasVisited") ? 0.1 : 2.3;
    const controls = animate(t, 1, { duration: 2.4, delay, ease: "easeOut" });
    return () => controls.stop();
  }, [t]);

  const both = [t, s] as MotionValue<number>[];

  // Role line (leaves first)
  const roleOpacity = useTransform(both, ([tv, sv]: number[]) => win(tv, 0.4, 0.6) * (1 - win(sv, ...ROLE_EXIT)));
  const roleY = useTransform(s, (sv) => -14 * win(sv, ...ROLE_EXIT));

  // Name block lift on load
  const nameLift = useTransform(t, (tv) => `${-14 * win(tv, 0.55, 0.95)}vh`);

  // Photo (leaves second)
  const photoOpacity = useTransform(both, ([tv, sv]: number[]) => win(tv, 0.55, 0.85) * (1 - win(sv, ...PHOTO_EXIT)));
  const photoScale = useTransform(both, ([tv, sv]: number[]) => (0.75 + 0.25 * win(tv, 0.55, 1)) * (1 - 0.14 * win(sv, ...PHOTO_EXIT)));
  const photoY = useTransform(both, ([tv, sv]: number[]) => (1 - win(tv, 0.55, 1)) * 80 - 28 * win(sv, ...PHOTO_EXIT));

  const cueOpacity = useTransform(both, ([tv, sv]: number[]) => win(tv, 0.85, 1) * (1 - win(sv, 0, 0.07)));

  return (
    // 80vh pin gives the exit sequence room to breathe; the negative margin lets About's
    // heading rise into view while the hero finishes leaving (no empty screen, no gap)
    <section id="hero" ref={ref} className="relative h-[180vh] w-full mb-[-87vh]">
      {/* 100svh: the *visible* viewport on phones (100vh is taller than the screen while the browser toolbar is showing) */}
      <div className="sticky top-0 h-screen h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div style={{ y: nameLift }} className="flex flex-col items-center">
            <h1
              // Sized by BOTH width and height: 15vw fits any phone width, 20vh keeps it from
              // swallowing a landscape phone; capped at 10rem on desktops
              style={{ fontSize: "clamp(2.5rem, min(15vw, 20vh), 10rem)" }}
              className="font-serif italic tracking-wide text-white text-center flex justify-center whitespace-nowrap leading-tight"
            >
              {NAME.split("").map((char, i) => (
                <Letter key={i} char={char} index={i} t={t} s={s} />
              ))}
            </h1>
            <motion.p
              style={{ opacity: roleOpacity, y: roleY }}
              className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-white/50 text-center mt-6"
            >
              AI & Machine Learning Engineer
            </motion.p>
          </motion.div>
        </div>

        {/* Profile photo, below the name block */}
        <div className="absolute inset-x-0 top-[55%] flex justify-center">
          <motion.div
            style={{
              opacity: photoOpacity,
              scale: photoScale,
              y: photoY,
              // height-led, but never wider than ~60% of a narrow screen
              width: "clamp(6.5rem, min(28vh, 60vw), 19rem)",
              height: "clamp(6.5rem, min(28vh, 60vw), 19rem)",
            }}
            className="overflow-hidden rounded-full border border-white/20 shadow-[0_0_60px_-10px_rgba(123,97,255,0.45)] will-change-transform"
          >
            <SecureImage src="/media/profile.webp" alt="Bhyresh BS" className="h-full w-full object-cover" />
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-6 inset-x-0 z-40 flex flex-col items-center gap-3 [@media(max-height:620px)]:hidden font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/50 pointer-events-none"
        >
          <span>Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent"></div>
        </motion.div>
      </div>
    </section>
  );
}
