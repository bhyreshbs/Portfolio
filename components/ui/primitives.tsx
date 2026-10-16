"use client";

/**
 * Shared building blocks so every section looks like part of one system:
 *   SectionHeader — numbered eyebrow + serif title (+ optional right-hand control)
 *   FilterTabs    — pill tabs with a sliding indicator (Skills + Work)
 *   SpotlightCard — glass card with cursor spotlight, optional 3D tilt and lift
 */

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/utils/cn";
import { usePerfTier } from "@/utils/lowEnd";

export const EASE = [0.16, 1, 0.3, 1] as const;

export function SectionHeader({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-white/40"
        >
          <span>{index}</span>
          <span className="h-px w-10 bg-white/25" />
          <span>{label}</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
          className="font-serif text-5xl italic tracking-wide text-white/90 md:text-7xl"
        >
          {title}
        </motion.h2>
      </div>
      {children}
    </div>
  );
}

export function FilterTabs({
  items,
  value,
  onChange,
  layoutId,
  label,
}: {
  items: { id: string; title: string }[];
  value: string;
  onChange: (id: string) => void;
  layoutId: string;
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex flex-wrap gap-1 self-start rounded-full border border-white/10 bg-white/[0.04] p-1"
    >
      {items.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "relative rounded-full px-4 py-1.5 text-sm outline-none transition-colors",
            value === t.id ? "text-canvas" : "text-white/55 hover:text-white"
          )}
        >
          {value === t.id && (
            <motion.span
              layoutId={layoutId}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="absolute inset-0 -z-10 rounded-full bg-white"
            />
          )}
          {t.title}
        </button>
      ))}
    </div>
  );
}

interface SpotlightCardProps extends Omit<HTMLMotionProps<"div">, "ref" | "children"> {
  children?: React.ReactNode;
  accent?: string;
  /** 3D tilt toward the cursor (cards); off for small tiles */
  tilt?: boolean;
  /** Lift on hover, in px */
  lift?: number;
}

export function SpotlightCard({
  accent = "#7b61ff",
  tilt = false,
  lift = 6,
  className,
  style,
  children,
  ...rest
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = usePerfTier();
  const interactive = tier !== "low"; // spotlight + lift
  const canTilt = tilt && tier === "high"; // 3D tilt only where the GPU can afford it

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rotateX = useSpring(0, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 22 });
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}% ${my}%, ${accent}33, transparent 60%)`;

  const onMove = (e: React.PointerEvent) => {
    if (!interactive || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px * 100);
    my.set(py * 100);
    if (canTilt) {
      rotateY.set((px - 0.5) * 9);
      rotateX.set(-(py - 0.5) * 9);
    }
  };
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileHover={interactive ? { y: -lift } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      style={{ ...(canTilt ? { rotateX, rotateY, transformPerspective: 900 } : null), ...style }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] will-change-transform",
        "shadow-[0_1px_0_rgb(255_255_255/0.04)_inset] [.light_&]:shadow-[0_1px_0_rgb(255_255_255/0.6)_inset,0_10px_30px_-14px_rgb(var(--shadow)/0.3)]",
        "transition-[border-color,box-shadow] duration-300 hover:border-white/30 hover:shadow-[0_24px_60px_-24px_rgb(var(--shadow)/0.5)] [.light_&]:hover:shadow-[0_1px_0_rgb(255_255_255/0.6)_inset,0_24px_50px_-18px_rgb(var(--shadow)/0.45)]",
        className
      )}
      {...rest}
    >
      {interactive && (
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      {children}
    </motion.div>
  );
}
