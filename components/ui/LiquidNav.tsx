"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import { User, Briefcase, Code2, Mail, Home } from "lucide-react";

const navItems = [
  { name: "Home", href: "#hero", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Work", href: "#projects", icon: Briefcase },
  { name: "Skills", href: "#skills", icon: Code2 },
  { name: "Contact", href: "#contact", icon: Mail },
];

export default function LiquidNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ x: 100, y: "-50%", opacity: 0 }}
      animate={{ x: 0, y: "-50%", opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed right-6 lg:right-10 top-1/2 z-50 flex items-center justify-center h-fit"
    >
      <div
        className={cn(
          "relative flex flex-col items-center justify-between gap-6 px-3.5 py-6 rounded-full transition-all duration-700 ease-out overflow-visible",
          "border border-white/[0.12] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]",
          scrolled ? "bg-black/50 backdrop-blur-3xl" : "bg-black/20 backdrop-blur-2xl"
        )}
      >
        {/* Inner Glass Highlights */}
        <div className="absolute inset-0 rounded-full border-[0.5px] border-white/[0.08] pointer-events-none mix-blend-overlay overflow-hidden"></div>
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-white/30 to-transparent blur-[1px]"></div>
        
        {/* Links */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.name;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setActive(item.name)}
                className="group relative flex items-center justify-center p-2.5 rounded-full hover:bg-white/10 transition-colors duration-300"
              >
                <Icon 
                  strokeWidth={2} 
                  className={cn(
                    "w-[22px] h-[22px] transition-all duration-300",
                    isActive ? "text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-white/70 group-hover:text-white"
                  )} 
                />
                
                {/* Tooltip */}
                <div className="absolute right-full mr-5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-black/70 backdrop-blur-xl border border-white/15 opacity-0 -translate-x-3 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out flex items-center shadow-2xl">
                  <span className="text-sm font-semibold text-white/95 tracking-wide whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
