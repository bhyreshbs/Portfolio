"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import { User, Briefcase, Code2, Mail, Home } from "lucide-react";

const navItems = [
  { name: "Home", href: "/#hero", icon: Home },
  { name: "Beyond Code", href: "/#about", icon: User },
  { name: "Technologies", href: "/#skills", icon: Code2 },
  { name: "Work", href: "/#projects", icon: Briefcase },
];

export default function LiquidNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");
  const [mounted, setMounted] = useState(false);
  const [initialDelay, setInitialDelay] = useState(8.0);

  useEffect(() => {
    setMounted(true);
    
    if (sessionStorage.getItem("hasVisited")) {
      setInitialDelay(0);
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navItems
        .map((item) => document.getElementById(item.href.substring(2)))
        .filter((el): el is HTMLElement => el !== null);

      let currentActive = "Home"; // Default
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        const rect = el.getBoundingClientRect();

        // If the top of the section is at or above the middle of the viewport
        if (rect.top <= window.innerHeight * 0.5) {
          const matchedItem = navItems.find((item) => item.href === `/#${el.id}`);
          if (matchedItem) {
            currentActive = matchedItem.name;
            break;
          }
        }
      }
      setActive(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, name: string) => {
    const isLocalPage = window.location.pathname === "/";

    // Only smooth scroll if we are already on the home page
    if (isLocalPage) {
      e.preventDefault();
      setActive(name);

      const targetId = href.substring(2);
      const element = document.getElementById(targetId);

      if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

  if (!mounted) return null; // Avoid hydration mismatch for motion delay

  return (
    <motion.nav
      initial={{ x: 100, y: "-50%", opacity: 0 }}
      animate={{ x: 0, y: "-50%", opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: initialDelay }}
      className={cn(
        "fixed right-6 lg:right-10 top-1/2 z-[100] flex items-center justify-center h-fit group/nav transition-opacity duration-500",
        mounted ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Outer ambient glow */}
      <div className={cn(
        "absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full transition-opacity duration-1000",
        scrolled ? "opacity-30" : "opacity-0"
      )}></div>

      <div
        className={cn(
          "relative flex flex-col items-center justify-between gap-6 px-3.5 py-6 rounded-full transition-all duration-700 ease-out overflow-visible",
          "border border-white/[0.15] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]",
          scrolled ? "bg-black/60 backdrop-blur-[40px]" : "bg-black/30 backdrop-blur-3xl"
        )}
      >
        {/* Inner Glass Highlights */}
        <div className="absolute inset-0 rounded-full border border-white/[0.1] pointer-events-none mix-blend-overlay overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]"></div>
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[2px] h-1/2 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent blur-[2px]"></div>

        {/* Links */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.name;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.name)}
                className="group relative flex items-center justify-center p-3 rounded-full hover:bg-white/10 transition-colors duration-300 cursor-pointer"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-blue-500/20 rounded-full shadow-[0_0_20px_rgba(0,255,255,0.3)] backdrop-blur-md border border-white/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  strokeWidth={2}
                  className={cn(
                    "relative z-10 w-[22px] h-[22px] transition-all duration-300",
                    isActive ? "text-white scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" : "text-white/60 group-hover:text-white"
                  )}
                />

                {/* Tooltip */}
                <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/10 opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400 ease-out flex items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <span className="text-[13px] font-bold text-white tracking-[0.1em] whitespace-nowrap uppercase">
                    {item.name}
                  </span>
                  {/* Tooltip pointer arrow */}
                  <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-black/80 border-t border-r border-white/10 rotate-45 backdrop-blur-xl"></div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
