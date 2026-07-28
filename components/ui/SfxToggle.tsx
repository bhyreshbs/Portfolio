"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { soundEngine } from "@/utils/audio";
import { cn } from "@/utils/cn";

export default function SfxToggle() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (soundEngine) {
      setIsEnabled(soundEngine.enabled);
    }
  }, []);

  const handleToggle = () => {
    if (soundEngine) {
      soundEngine.enabled = !soundEngine.enabled;
      setIsEnabled(soundEngine.enabled);

      if (soundEngine.enabled) {
        soundEngine.playPop(); // subtle confirmation pulse
      }
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1 }}
      className={cn(
        "fixed top-6 right-6 lg:top-10 lg:right-10 z-[100] group",
        "flex items-center justify-center px-4 py-1.5 rounded-full backdrop-blur-md overflow-hidden transition-all duration-500",
        isEnabled
          ? "bg-white/[0.04] border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:border-cyan-400/50 hover:bg-white/[0.06] hover:-translate-y-[2px]"
          : "bg-black/30 border border-white/10 hover:border-white/20 hover:bg-black/40 hover:-translate-y-[2px]"
      )}
    >
      {/* Liquid Glass Internal Reflections */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500 pointer-events-none",
        isEnabled
          ? "bg-gradient-to-tr from-cyan-500/10 via-transparent to-white/5 opacity-100"
          : "bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-50"
      )}></div>

      {/* Hover Highlight Sweep */}
      <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-[150%] transition-transform duration-1000 ease-out pointer-events-none"></div>

      {/* Typography */}
      <span className={cn(
        "relative z-10 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-500",
        isEnabled
          ? "text-cyan-100 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]"
          : "text-white/40"
      )}>
        SFX
      </span>
    </motion.button>
  );
}
