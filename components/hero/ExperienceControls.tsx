"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { Mail, FileText } from "lucide-react";

interface TypographyButtonProps {
  label: string;
  href?: string;
  download?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  icon?: any;
  minimized?: boolean;
}

function TypographyButton({ label, href, download, onClick, icon: Icon, minimized }: TypographyButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };

  const content = (
    <motion.div
      onHoverStart={handleHover}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98, y: 1 }}
      className={cn(
        "relative flex items-center justify-center cursor-pointer group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
        minimized ? "w-12 h-12 rounded-full" : "w-36 h-12 rounded-2xl"
      )}
    >
      {/* Background & Glass Effect */}
      <div
        className={cn(
          "absolute inset-0 transition-all duration-700 ease-out",
          minimized ? "rounded-full" : "rounded-2xl",
          isHovered ? "bg-white/[0.08] border-white/20 shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]" : "bg-transparent border-transparent"
        )}
      />

      {/* Liquid Reflection Sweep */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-[1.2s] ease-out pointer-events-none",
          minimized ? "rounded-full" : "rounded-2xl",
          isHovered ? "translate-x-full opacity-100" : "-translate-x-full opacity-0"
        )}
        style={{ transform: isHovered ? "translateX(100%)" : "translateX(-100%)" }}
      />

      {/* Icon (visible when minimized) */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
        minimized ? "opacity-100 delay-200" : "opacity-0 pointer-events-none"
      )}>
        {Icon && <Icon className="w-[18px] h-[18px] text-white/70 group-hover:text-white transition-colors duration-300" />}
        
        {/* Tooltip */}
        <div className={cn(
          "absolute left-full ml-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 opacity-0 pointer-events-none transition-all duration-400 ease-out whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50",
          minimized ? "group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2" : "hidden"
        )}>
          <span className="text-[11px] font-mono font-bold tracking-[0.1em] text-white uppercase">{label}</span>
        </div>
      </div>

      {/* Typography (visible when expanded) */}
      <div className={cn(
        "relative z-10 flex items-center justify-center transition-opacity duration-500",
        minimized ? "opacity-0 pointer-events-none" : "opacity-100 delay-200"
      )}>
        <motion.span
          className="font-mono text-[11px] uppercase text-white whitespace-nowrap"
          animate={{
            letterSpacing: (!minimized && isHovered) ? "0.3em" : "0.2em",
            color: isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.6)",
            textShadow: isHovered ? "0 0 10px rgba(6,182,212,0.5)" : "none"
          }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
        >
          {label}
        </motion.span>
      </div>
    </motion.div>
  );

  if (onClick) {
    return (
      <div className="block w-full outline-none">
        {content}
      </div>
    );
  }

  if (download && href) {
    return (
      <a href={href} download className="block w-full outline-none">
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className="block w-full outline-none">
        {content}
      </Link>
    );
  }

  return null;
}

export default function ExperienceControls() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showLightPulse, setShowLightPulse] = useState(false);
  const [startTransformation, setStartTransformation] = useState(false);
  const [initialDelay, setInitialDelay] = useState(8.0);

  useEffect(() => {
    setMounted(true);
    
    if (sessionStorage.getItem("hasVisited")) {
      setInitialDelay(0);
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isConnecting) return;

    setIsConnecting(true);

    // Step 4: Light pulse originates from button
    setTimeout(() => {
      setShowLightPulse(true);
    }, 600);

    // Step 5: Environment transforming
    setTimeout(() => {
      setStartTransformation(true);
    }, 1200);

    // Step 6: Navigate seamlessly
    setTimeout(() => {
      sessionStorage.setItem("returnScroll", window.scrollY.toString());
      router.push("/contact");

      // Cleanup overlay after navigation finishes
      setTimeout(() => {
        setIsConnecting(false);
        setShowLightPulse(false);
        setStartTransformation(false);
      }, 1200);
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div>
      <div className={cn(
        "fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-[100] w-auto pointer-events-none flex items-center transition-opacity duration-500",
        mounted ? "opacity-100" : "opacity-0"
      )}>
        <motion.div
          className={cn(
            "pointer-events-auto relative flex flex-col items-center gap-2 p-2 transition-all duration-700",
            scrolled 
              ? "rounded-full bg-black/60 backdrop-blur-[40px] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]" 
              : "rounded-[24px] bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
          )}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: initialDelay }}
        >
          {/* Inner glass bezel */}
          <div className={cn(
            "absolute inset-0 border border-white/10 mix-blend-overlay pointer-events-none transition-all duration-700",
            scrolled ? "rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" : "rounded-[24px]"
          )}></div>

          <TypographyButton
            label="Contact"
            onClick={handleContactClick}
            icon={Mail}
            minimized={scrolled}
          />

          {/* Separator */}
          <div className={cn(
            "h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-1 transition-all duration-500",
            scrolled ? "w-6" : "w-[80%]"
          )} />

          <TypographyButton
            href="/resume.pdf"
            label="Resume"
            download
            icon={FileText}
            minimized={scrolled}
          />
        </motion.div>
      </div>

      {/* Cinematic Transition Overlay - Liquid Glass Theme */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div
            className="fixed inset-0 z-[150] flex flex-col items-center justify-center pointer-events-auto overflow-hidden"
            initial={{ backgroundColor: "rgba(5,5,5,0)", backdropFilter: "blur(0px)" }}
            animate={{ backgroundColor: "rgba(5,5,5,0.4)", backdropFilter: "blur(40px)" }}
            exit={{ backgroundColor: "rgba(5,5,5,0)", backdropFilter: "blur(0px)", opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ambient Background Orbs */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />

            {/* Removed the 'Establishing Connection' UI per user request, leaving only the abstract light pulse and fade to black transition */}

            {/* Liquid Ripple Effect */}
            {showLightPulse && (
              <motion.div
                className="absolute inset-0 z-[-1] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Central Soft Glow Expansion */}
                <motion.div
                  className="absolute rounded-full bg-white/5 mix-blend-overlay blur-xl"
                  initial={{ width: 0, height: 0, opacity: 1 }}
                  animate={{ width: "100vw", height: "100vw", opacity: 0 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                />

                {/* Expanding Glass Ring */}
                <motion.div
                  className="absolute w-32 h-32 rounded-full border border-white/10 shadow-[inset_0_0_40px_rgba(255,255,255,0.05)] mix-blend-overlay"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 20, opacity: 0 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            )}

            {/* Environment Transform (Fade to Black before scrolling) */}
            {startTransformation && (
              <motion.div
                className="absolute inset-0 z-[20] bg-[#050505]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeIn" }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
