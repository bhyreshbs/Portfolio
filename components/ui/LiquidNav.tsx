"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationControls,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/utils/cn";
import { useLowEnd } from "@/utils/lowEnd";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SecureImage from "@/components/ui/secure-image/SecureImage";

const NAV_ITEMS = [
  { name: "Intro", id: "hero" },
  { name: "About", id: "about" },
  { name: "Skills", id: "skills" },
  { name: "Work", id: "projects" },
];
const CONTACT_ID = "contact"; // the footer
const SECTION_IDS = [...NAV_ITEMS.map((i) => i.id), CONTACT_ID];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
}

/**
 * Theme-switch choreography. Every navbar element flips edge-on in sequence ("out"),
 * the theme changes while they're invisible, then they spring back in ("in") in the
 * new palette while a ripple expands from the toggle.
 */
const swap: Variants = {
  out: (i: number) => ({
    rotateX: 90,
    opacity: 0,
    y: -8,
    scale: 0.9,
    transition: { duration: 0.18, delay: i * 0.035, ease: "easeIn" },
  }),
  in: (i: number) => ({
    rotateX: 0,
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 380, damping: 17, delay: i * 0.05 },
  }),
};
const pill: Variants = {
  out: { scale: 0.97, transition: { duration: 0.35, ease: "easeIn" } },
  in: { scale: 1, transition: { type: "spring", stiffness: 300, damping: 16 } },
};

type SwapProps = React.ComponentProps<typeof motion.div> & {
  controls: ReturnType<typeof useAnimationControls>;
  order: number;
};
function Swap({ controls, order, style, ...rest }: SwapProps) {
  return (
    <motion.div
      variants={swap}
      custom={order}
      animate={controls}
      style={{ transformPerspective: 700, ...style }}
      {...rest}
    />
  );
}

/**
 * Floating glass dock. It deliberately uses the opposite palette of the page
 * (`nav-invert`): light glass in dark mode, dark glass in light mode.
 *
 * Brand area: while the hero is on screen the logo tile is just a "B" and the name
 * label is hidden. After you scroll past the hero the tile swaps to the profile
 * photo and the name slides in; scrolling back reverses it.
 */
export default function LiquidNav() {
  const [active, setActive] = useState("hero");
  const [delay, setDelay] = useState(2.5);
  // Hand-off from the hero: the photo lands first (~0.1 screen of scroll), then the name (~0.22)
  const [pastHero, setPastHero] = useState(false); // photo has landed
  const [nameIn, setNameIn] = useState(false); // name has landed
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);

  const { resolvedTheme, setTheme } = useTheme();
  const lowEnd = useLowEnd();
  const controls = useAnimationControls();
  const dockRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const busy = useRef(false);

  const { scrollY } = useScroll();
  // Thresholds follow the hero's 80vh pin: the photo has left by ~0.18 of a screen, the
  // last letter by ~0.5
  useMotionValueEvent(scrollY, "change", (y) => {
    setPastHero(y > window.innerHeight * 0.1);
    setNameIn(y > window.innerHeight * 0.48);
  });

  useEffect(() => {
    setPastHero(window.scrollY > window.innerHeight * 0.1);
    setNameIn(window.scrollY > window.innerHeight * 0.48);
    if (sessionStorage.getItem("hasVisited")) setDelay(0.1);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      // A thin band at the vertical middle of the viewport: one section at a time
      { rootMargin: "-49% 0px -50% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActive(id);
    scrollToId(id);
  };

  const toggleTheme = async () => {
    if (busy.current) return;
    const next = resolvedTheme === "light" ? "dark" : "light";
    if (lowEnd) {
      setTheme(next);
      return;
    }
    busy.current = true;
    await controls.start("out");
    setTheme(next); // palette swaps while every element is edge-on
    const t = toggleRef.current?.getBoundingClientRect();
    const d = dockRef.current?.getBoundingClientRect();
    if (t && d) setBurst({ key: Date.now(), x: t.left - d.left + t.width / 2, y: t.top - d.top + t.height / 2 });
    await controls.start("in");
    busy.current = false;
  };

  return (
    <motion.nav
      aria-label="Sections"
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      // max(): sit below a phone notch / status bar in landscape and PWA modes
      className="fixed top-[max(1rem,env(safe-area-inset-top))] inset-x-0 z-[100] flex justify-center px-3 pointer-events-none"
    >
      <motion.div
        ref={dockRef}
        variants={pill}
        animate={controls}
        className="nav-invert pointer-events-auto relative flex w-full max-w-3xl items-center justify-between gap-1 rounded-full border border-white/10 bg-canvas/80 py-2 pl-2.5 pr-2 max-[380px]:pl-2 max-[380px]:pr-1.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        {/* Ripple from the toggle, clipped to the pill */}
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          {burst && (
            <motion.span
              key={burst.key}
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 16, opacity: 0 }}
              transition={{ duration: 0.95, ease: "easeOut" }}
              style={{ left: burst.x - 20, top: burst.y - 20 }}
              className="absolute h-10 w-10 rounded-full border-2 border-white/70 bg-white/25"
            />
          )}
        </span>

        {/* Brand */}
        <Swap controls={controls} order={0}>
          <a
            href="/#hero"
            onClick={(e) => go(e, "hero")}
            className="flex items-center gap-2.5 rounded-full outline-none"
            aria-label="Bhyresh BS — back to top"
          >
            <span className="relative h-9 w-9 shrink-0 max-[380px]:h-8 max-[380px]:w-8">
              <motion.span
                animate={{ opacity: pastHero ? 0 : 1, scale: pastHero ? 0.5 : 1, rotate: pastHero ? -25 : 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center rounded-xl bg-white font-serif text-lg italic font-semibold text-canvas"
              >
                B
              </motion.span>
              <motion.span
                animate={{ opacity: pastHero ? 1 : 0, scale: pastHero ? 1 : 0.4 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="absolute inset-0 overflow-hidden rounded-full ring-2 ring-white/40"
              >
                <SecureImage src="/media/profile.webp" alt="" className="h-full w-full object-cover" />
              </motion.span>
              {pastHero && (
                <motion.span
                  aria-hidden
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/60"
                />
              )}
            </span>

            {/* Name: lands letter by letter once the hero's name has left (transform/opacity only) */}
            <span
              aria-label="Bhyresh BS"
              className="relative hidden whitespace-pre text-sm font-semibold tracking-wide text-white sm:flex"
            >
              {"Bhyresh BS".split("").map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  initial={false}
                  animate={
                    nameIn
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: -16, scale: 0.6 }
                  }
                  transition={
                    nameIn
                      ? { type: "spring", stiffness: 420, damping: 15, delay: i * 0.04 }
                      : { duration: 0.2, delay: (9 - i) * 0.012 }
                  }
                  className="inline-block"
                >
                  {ch}
                </motion.span>
              ))}
              {/* Underline that draws once as the name lands */}
              {nameIn && (
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0, opacity: 0.9 }}
                  animate={{ scaleX: 1, opacity: 0 }}
                  transition={{ scaleX: { duration: 0.6, delay: 0.15 }, opacity: { duration: 0.5, delay: 0.55 } }}
                  style={{ originX: 0 }}
                  className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-white/0 via-white to-white/0"
                />
              )}
            </span>
          </a>
        </Swap>

        {/* Section links */}
        <ul className="flex items-center gap-0.5 sm:gap-1">
          {NAV_ITEMS.map((item, i) => {
            const isActive = active === item.id;
            return (
              <li key={item.id} className="relative">
                <Swap controls={controls} order={i + 1}>
                  <a
                    href={`/#${item.id}`}
                    onClick={(e) => go(e, item.id)}
                    className={cn(
                      "relative block rounded-full px-2 py-2 text-[11px] font-medium outline-none transition-colors duration-300 max-[380px]:px-1.5 sm:px-4 sm:text-sm",
                      isActive ? "text-white" : "text-white/55 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="dock-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 -z-10 rounded-full border border-white/25 bg-white/15 shadow-[0_0_24px_rgb(var(--fg)/0.2)] backdrop-blur-md"
                      />
                    )}
                    {item.name}
                  </a>
                </Swap>
              </li>
            );
          })}
        </ul>

        <Swap controls={controls} order={5}>
          <ThemeToggle ref={toggleRef} onToggle={toggleTheme} />
        </Swap>

        {/* Scrolls to the footer's contact block */}
        <Swap controls={controls} order={6}>
          <a
            href={`/#${CONTACT_ID}`}
            onClick={(e) => go(e, CONTACT_ID)}
            className={cn(
              "block rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-canvas outline-none transition-shadow duration-300 max-[380px]:px-3 sm:px-5 sm:text-sm",
              active === CONTACT_ID
                ? "shadow-[0_0_0_3px_rgb(var(--fg)/0.25),0_0_24px_rgb(var(--fg)/0.35)]"
                : "hover:shadow-[0_0_20px_rgb(var(--fg)/0.3)]"
            )}
          >
            Contact
          </a>
        </Swap>
      </motion.div>
    </motion.nav>
  );
}
