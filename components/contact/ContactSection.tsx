"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/utils/cn";
import { soundEngine } from "@/utils/audio";
import { SiX, SiInstagram, SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Send, Mail, User, MessageSquare } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { name: "Twitter / X", icon: <SiX className="w-5 h-5" />, href: "#" },
  { name: "Instagram", icon: <SiInstagram className="w-5 h-5" />, href: "#" },
  { name: "LinkedIn", icon: <FaLinkedin className="w-5 h-5" />, href: "#" },
  { name: "GitHub", icon: <SiGithub className="w-5 h-5" />, href: "#" },
];

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useGSAP(() => {
    if (!containerRef.current || !formRef.current) return;

    // Entrance Animation
    gsap.from(containerRef.current.querySelectorAll('.contact-stagger'), {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        once: true,
      }
    });

  }, { scope: containerRef });

  const playTick = () => {
    if (soundEngine?.enabled) {
      soundEngine.playTick();
    }
  };

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] overflow-hidden border-t border-white/[0.05]"
    >
      {/* Deep Space Background Lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[800px] bg-purple-900/10 rounded-full blur-[200px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_10%,transparent_100%)]"></div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center w-full px-6 md:px-10 z-10 py-24">
        
        <div className="contact-stagger mb-12 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <Mail className="w-4 h-4 text-white/70" />
            <span className="font-mono text-xs tracking-[0.2em] text-white/70 uppercase">Initialize Comms</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Connect</span>
          </h2>
          <p className="text-white/50 max-w-md mx-auto text-lg font-light">
            Whether you have a project in mind or just want to say hello, my inbox is always open.
          </p>
        </div>

        {/* The Glass Form */}
        <form 
          ref={formRef}
          action="mailto:bhycoder926@gmail.com"
          method="POST"
          encType="text/plain"
          className="contact-stagger w-full max-w-xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Inner Glows */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col gap-6">
            
            {/* Name Input */}
            <div className="relative group">
              <label className="text-xs font-mono tracking-widest text-white/50 uppercase mb-2 block ml-4">Subject</label>
              <div className={cn(
                "relative flex items-center bg-black/40 border rounded-2xl overflow-hidden transition-all duration-300",
                focusedField === 'subject' ? "border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]" : "border-white/10 group-hover:border-white/20"
              )}>
                <User className="w-5 h-5 text-white/40 ml-4 absolute pointer-events-none" />
                <input 
                  type="text" 
                  name="subject"
                  required
                  onFocus={() => { setFocusedField('subject'); playTick(); }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="What is this regarding?"
                  className="w-full bg-transparent border-none outline-none py-4 pl-12 pr-4 text-white placeholder-white/20 font-light"
                />
              </div>
            </div>

            {/* Message Input */}
            <div className="relative group">
              <label className="text-xs font-mono tracking-widest text-white/50 uppercase mb-2 block ml-4">Message</label>
              <div className={cn(
                "relative flex bg-black/40 border rounded-2xl overflow-hidden transition-all duration-300",
                focusedField === 'body' ? "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]" : "border-white/10 group-hover:border-white/20"
              )}>
                <MessageSquare className="w-5 h-5 text-white/40 ml-4 mt-4 absolute pointer-events-none" />
                <textarea 
                  name="body"
                  required
                  rows={5}
                  onFocus={() => { setFocusedField('body'); playTick(); }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Write your message here..."
                  className="w-full bg-transparent border-none outline-none py-4 pl-12 pr-4 text-white placeholder-white/20 font-light resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onMouseEnter={playTick}
              className="mt-4 w-full group relative flex items-center justify-center gap-3 bg-white text-black font-medium py-4 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <span className="relative z-10 tracking-wide">Transmit Message</span>
              <Send className="relative z-10 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>

          </div>
        </form>
      </div>

      {/* Elegant Footer */}
      <footer className="contact-stagger relative z-10 w-full border-t border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-2 text-white/40 font-light text-sm">
            <span>&copy; {new Date().getFullYear()}</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>Bhyresh BS</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={playTick}
                className="group relative p-2 text-white/40 hover:text-white transition-colors"
                aria-label={link.name}
              >
                {/* Glow behind icon */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-full blur-md transition-colors"></div>
                <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                  {link.icon}
                </div>
              </a>
            ))}
          </div>

        </div>
      </footer>
    </section>
  );
}
