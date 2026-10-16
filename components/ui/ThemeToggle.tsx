"use client";

import { forwardRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Sun/moon button. The parent owns the actual theme change (so it can choreograph the
 * transition); this only shows the right icon and reports clicks.
 * Renders a same-size placeholder until mounted (no layout shift, no hydration mismatch).
 */
const ThemeToggle = forwardRef<HTMLButtonElement, { onToggle: () => void }>(function ThemeToggle(
  { onToggle },
  ref
) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme !== "light";
  const label = !mounted ? "Toggle theme" : isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={onToggle}
      className="relative flex h-9 w-9 items-center justify-center rounded-full max-[380px]:h-8 max-[380px]:w-8 text-white/70 outline-none transition-colors hover:bg-white/10 hover:text-white"
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -180, scale: 0.3, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 180, scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex"
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
});

export default ThemeToggle;
