"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
interface SkillChipProps {
  name: string;
  icon: React.ReactNode;
  delay?: number;
}

export default function SkillChip({ name, icon, delay = 0 }: SkillChipProps) {
  // Idle floating animation
  const floatAnimation = {
    y: ["-2%", "2%"],
    transition: {
      duration: 2 + Math.random() * 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const,
      delay: Math.random() * 2,
    },
  };

  const handleHover = () => {
    // hover logic
  };

  return (
    <motion.div
      animate={floatAnimation}
      onMouseEnter={handleHover}
      className={cn(
        "group relative flex items-center gap-3 px-4 py-3 rounded-2xl cursor-default",
        "bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]",
        "hover:bg-white/10 hover:border-white/20 transition-all duration-500 ease-out",
        "overflow-hidden"
      )}
    >
      {/* Dynamic Lighting Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 translate-y-[100%] group-hover:translate-y-[0%] transition-all duration-700 pointer-events-none"></div>
      
      {/* Micro Noise Overlay (Subtle) */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Icon Wrapper */}
      <div className="relative z-10 w-6 h-6 flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] transition-all duration-500">
        {icon}
      </div>

      {/* Tech Name */}
      <span className="relative z-10 text-sm font-medium text-white/80 group-hover:text-white tracking-wide transition-colors duration-300">
        {name}
      </span>
    </motion.div>
  );
}
