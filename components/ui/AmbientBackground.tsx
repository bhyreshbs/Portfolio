"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePerfTier } from "@/utils/lowEnd";

/**
 * AmbientBackground — one continuous canvas behind every section.
 * Everything animates with transform/opacity only (compositor-friendly, no WebGL).
 * The effects budget follows the device's performance tier (see utils/lowEnd.ts):
 *
 *   high    5 drifting aurora layers, rotating conic ring, dot grid, film grain, cursor glow
 *   medium  3 drifting aurora layers, dot grid
 *   low     2 static gradients, dot grid (zero animation, zero blending)
 */

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// Opacity comes from --orb-N (dark default here, light override in globals.css)
const AURORA = [
  { c: "#7b61ff", s: 720, pos: { top: "-10%", left: "-8%" }, a: "aurora-drift 26s ease-in-out infinite alternate", dark: 0.2 },
  { c: "#00d4ff", s: 620, pos: { top: "30%", right: "-10%" }, a: "aurora-drift 32s ease-in-out infinite alternate-reverse", dark: 0.14 },
  { c: "#ff5fa2", s: 560, pos: { bottom: "-12%", left: "18%" }, a: "aurora-drift 29s ease-in-out infinite alternate", dark: 0.1 },
  { c: "#34d399", s: 460, pos: { top: "58%", left: "-6%" }, a: "aurora-drift 35s ease-in-out infinite alternate-reverse", dark: 0.07 },
  { c: "#fbbf24", s: 420, pos: { top: "6%", right: "22%" }, a: "aurora-drift 38s ease-in-out infinite alternate", dark: 0.05 },
];

function CursorGlow() {
  // Spring-smoothed, transform-only; mounted on the high tier only
  const px = useMotionValue(-400);
  const py = useMotionValue(-400);
  const x = useSpring(px, { stiffness: 90, damping: 22, mass: 0.6 });
  const y = useSpring(py, { stiffness: 90, damping: 22, mass: 0.6 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px.set(e.clientX - 260);
      py.set(e.clientY - 260);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [px, py]);

  return (
    <motion.div
      style={{ x, y, background: "radial-gradient(circle, rgb(var(--fg) / 0.09) 0%, transparent 65%)" }}
      className="absolute left-0 top-0 h-[520px] w-[520px] rounded-full will-change-transform"
    />
  );
}

export default function AmbientBackground() {
  const tier = usePerfTier();
  const layers = tier === "high" ? 5 : tier === "medium" ? 3 : 2;
  const animated = tier !== "low";

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-canvas" aria-hidden>
      {AURORA.slice(0, layers).map((o, i) => (
        <div
          key={i}
          className={animated ? "absolute rounded-full will-change-transform" : "absolute rounded-full"}
          style={{
            width: o.s,
            height: o.s,
            ...o.pos,
            background: `radial-gradient(circle, ${o.c} 0%, transparent 68%)`,
            opacity: `var(--orb-${i}, ${o.dark})`,
            animation: animated ? o.a : undefined,
          }}
        />
      ))}

      {tier === "high" && (
        <div
          className="absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.07] [.light_&]:opacity-[0.08]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, #7b61ff 60deg, transparent 120deg, #00d4ff 200deg, transparent 260deg, #ff5fa2 320deg, transparent 360deg)",
            animation: "spin-slow 120s linear infinite",
            maskImage: "radial-gradient(circle, transparent 38%, #000 52%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 38%, #000 52%, transparent 70%)",
          }}
        />
      )}

      {/* Dot grid (static, cheap) */}
      <div
        className="absolute inset-0 opacity-[0.14] [.light_&]:opacity-[0.22]"
        style={{
          backgroundImage: "radial-gradient(rgb(var(--fg) / 0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, #000 30%, transparent 100%)",
        }}
      />

      {tier === "high" && <CursorGlow />}

      {/* Film grain: a full-screen mix-blend layer, so high tier only */}
      {tier === "high" && (
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay [.light_&]:opacity-[0.06]"
          style={{ backgroundImage: GRAIN }}
        />
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgb(var(--bg) / 0.85) 100%)" }}
      />
    </div>
  );
}
