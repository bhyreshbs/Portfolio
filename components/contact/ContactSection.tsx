"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/utils/cn";
import { SiX, SiInstagram, SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Mail, FileText, ArrowUpRight, Activity, Terminal } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { name: "Twitter / X", icon: <SiX className="w-5 h-5" />, href: "#" },
  { name: "Instagram", icon: <SiInstagram className="w-5 h-5" />, href: "#" },
  { name: "LinkedIn", icon: <FaLinkedin className="w-5 h-5" />, href: "#" },
  { name: "GitHub", icon: <SiGithub className="w-5 h-5" />, href: "#" },
];

const CHANNELS = [
  { id: "email", name: "Email", desc: "Best for project discussions", icon: <Mail className="w-5 h-5" />, href: "mailto:bhycoder926@gmail.com" },
  { id: "linkedin", name: "LinkedIn", desc: "Professional networking", icon: <FaLinkedin className="w-5 h-5" />, href: "#" },
  { id: "github", name: "GitHub", desc: "Explore my work", icon: <SiGithub className="w-5 h-5" />, href: "#" },
  { id: "resume", name: "Resume", desc: "Download CV", icon: <FileText className="w-5 h-5" />, href: "#" },
];

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
  const [clickedChannel, setClickedChannel] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionEstablished, setConnectionEstablished] = useState(false);
  
  // Cinematic Boot Sequence States
  const [hasTriggeredBoot, setHasTriggeredBoot] = useState(false);
  const [showSystemMessage, setShowSystemMessage] = useState(false);
  const [startupComplete, setStartupComplete] = useState(false);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Set initial opacity of elements to 0 so they don't flash before animation
    gsap.set(containerRef.current.querySelectorAll('.cinematic-fade'), { opacity: 0 });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        setStartupComplete(true);
        
        // Aesthetic entry transition from the black screen
        gsap.fromTo(containerRef.current.querySelectorAll('.cinematic-fade'), 
          { y: 40, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.8,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }
    });

  }, { scope: containerRef });

  const handleConnect = (href: string, id: string) => {
    if (isConnecting || !startupComplete) return;
    setClickedChannel(id);
    setIsConnecting(true);

    // Simulate establishing connection
    setTimeout(() => {
      setConnectionEstablished(true);
      
      // Navigate after connection visually establishes
      setTimeout(() => {
        window.open(href, id === 'email' ? '_self' : '_blank');
        
        // Reset state after navigation
        setTimeout(() => {
          setIsConnecting(false);
          setClickedChannel(null);
          setConnectionEstablished(false);
        }, 1000);
      }, 600);
    }, 800);
  };

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-between bg-[#050505] overflow-hidden border-t border-white/[0.05]"
    >

      {/* Deep Space Background Lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[800px] bg-purple-900/10 rounded-full blur-[200px] pointer-events-none transition-opacity duration-1000" style={{ opacity: isConnecting ? 0.3 : 0.8 }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none transition-opacity duration-1000" style={{ opacity: isConnecting ? 0.8 : 0.3 }}></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_10%,transparent_100%)]"></div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center w-full px-4 md:px-10 z-10 py-24">
        
        {/* Cinematic Headline */}
        <div className="cinematic-fade mb-16 md:mb-24 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8">
            <Terminal className="w-4 h-4 text-cyan-400/70" />
            <span className="font-mono text-xs tracking-[0.2em] text-white/70 uppercase">Terminal Online</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-light tracking-tight text-white mb-6">
            The Future Starts With A <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 italic">Conversation</span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg font-light tracking-wide">
            Awaiting your signal to initiate collaboration protocols.
          </p>
        </div>

        {/* Interactive Terminal Interface */}
        <div className="cinematic-fade flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 w-full max-w-6xl">
          
          {/* Left Channels */}
          <div className="flex flex-col gap-6 w-full max-w-xs order-2 lg:order-1">
            {CHANNELS.slice(0, 2).map((channel) => (
              <ChannelCard 
                key={channel.id} 
                channel={channel} 
                hoveredChannel={hoveredChannel} 
                setHoveredChannel={setHoveredChannel}
                clickedChannel={clickedChannel}
                isConnecting={isConnecting}
                startupComplete={startupComplete}
                onConnect={() => handleConnect(channel.href, channel.id)}
              />
            ))}
          </div>

          {/* Communication Core Centerpiece */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
            {/* Ambient Core Glow */}
            <div className={cn(
              "absolute w-[120%] h-[120%] rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 mix-blend-screen blur-2xl transition-all duration-1000 pointer-events-none",
              hoveredChannel ? "opacity-100 scale-110" : "opacity-40 scale-100",
              isConnecting ? "opacity-100 scale-[2] blur-3xl from-cyan-400/20 to-cyan-500/20" : ""
            )}></div>
            
            {/* Liquid Glass Orb */}
            <div className={cn(
              "liquid-blob absolute w-full h-full bg-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-[inset_0_0_60px_rgba(255,255,255,0.05)] transition-all duration-700",
              isConnecting ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_100px_rgba(6,182,212,0.3)]" : (hoveredChannel ? "border-white/30" : "")
            )}></div>
            
            {/* Inner Rotating Ring */}
            <div className={cn(
              "liquid-blob-2 absolute w-[85%] h-[85%] bg-transparent border border-white/5 transition-all duration-700",
              isConnecting ? "border-cyan-400/40" : (hoveredChannel ? "border-white/20" : "")
            )}></div>

            {/* Core Icon/Activity */}
            <div className="relative z-10 flex items-center justify-center">
              <Activity className={cn(
                "w-10 h-10 transition-all duration-500", 
                isConnecting ? "text-cyan-400 animate-pulse scale-125" : (hoveredChannel ? "text-white" : "text-white/30")
              )} />
            </div>

            {/* Pulse Rings during connection */}
            {isConnecting && (
              <>
                <div className="absolute inset-0 rounded-full border border-cyan-400/50 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
              </>
            )}
          </div>

          {/* Right Channels */}
          <div className="flex flex-col gap-6 w-full max-w-xs order-3">
            {CHANNELS.slice(2, 4).map((channel) => (
              <ChannelCard 
                key={channel.id} 
                channel={channel} 
                hoveredChannel={hoveredChannel} 
                setHoveredChannel={setHoveredChannel}
                clickedChannel={clickedChannel}
                isConnecting={isConnecting}
                startupComplete={startupComplete}
                onConnect={() => handleConnect(channel.href, channel.id)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Elegant Footer / System Status */}
      <footer className="w-full relative z-10">
        
        {/* End of Transmission Note */}
        <div className="w-full flex justify-center pb-16">
          <div className="cinematic-fade flex items-center gap-4 text-white/30 font-mono text-xs uppercase tracking-[0.3em]">
            <div className="w-12 h-[1px] bg-white/20"></div>
            <span>{connectionEstablished ? "Connection Established" : "End Of Transmission"}</span>
            <div className="w-12 h-[1px] bg-white/20"></div>
          </div>
        </div>

        <div className="border-t border-white/5 bg-black/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-2 text-white/30 font-light text-xs tracking-widest uppercase">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="w-1 h-1 rounded-full bg-white/10"></span>
              <span>Bhyresh BS</span>
            </div>

            <div className="flex items-center gap-8 cinematic-fade">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative text-white/30 hover:text-white transition-colors"
                  aria-label={link.name}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-full blur-md transition-colors"></div>
                  <div className="relative z-10 group-hover:-translate-y-1 transition-transform duration-300">
                    {link.icon}
                  </div>
                </a>
              ))}
            </div>

          </div>
        </div>
      </footer>

      {/* Styles for liquid core animations */}
      <style jsx>{`
        .liquid-blob {
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          animation: blob-morph 8s ease-in-out infinite alternate;
        }
        .liquid-blob-2 {
          border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%;
          animation: blob-morph-reverse 10s ease-in-out infinite alternate;
        }
        @keyframes blob-morph {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        @keyframes blob-morph-reverse {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg); }
          100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(180deg); }
        }
      `}</style>
    </section>
  );
}

// Subcomponent for the interactive channel capsules
function ChannelCard({ 
  channel, 
  hoveredChannel, 
  setHoveredChannel, 
  clickedChannel, 
  isConnecting,
  startupComplete,
  onConnect 
}: { 
  channel: any, 
  hoveredChannel: string | null, 
  setHoveredChannel: (id: string | null) => void,
  clickedChannel: string | null,
  isConnecting: boolean,
  startupComplete: boolean,
  onConnect: () => void
}) {
  
  const isHovered = hoveredChannel === channel.id;
  const isOthersHovered = hoveredChannel && !isHovered;
  const isClicked = clickedChannel === channel.id;

  return (
    <div 
      onClick={onConnect}
      onMouseEnter={() => startupComplete && setHoveredChannel(channel.id)}
      onMouseLeave={() => startupComplete && setHoveredChannel(null)}
      className={cn(
        "relative group w-full p-5 rounded-3xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden",
        "bg-white/[0.015] border border-white/[0.08] backdrop-blur-md",
        
        // Hover effects
        isHovered ? "bg-white/[0.05] border-white/30 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.05)] translate-y-[-4px]" : "",
        isOthersHovered ? "opacity-30 scale-[0.98] blur-[1px]" : "opacity-100 scale-100",
        
        // Click/Connecting effects
        isConnecting && !isClicked ? "opacity-0 translate-y-4 pointer-events-none" : "",
        isClicked ? "bg-cyan-500/20 border-cyan-400/50 shadow-[0_0_60px_rgba(6,182,212,0.3)] scale-[1.02]" : ""
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Premium Glass Reflections */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-700",
        isHovered ? "opacity-100" : ""
      )}></div>

      {/* Internal Connection Glow when clicked */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-[100%] transition-transform duration-1000",
        isClicked ? "translate-x-[100%]" : ""
      )}></div>

      <div className="relative z-10 flex items-center justify-between gap-4" style={{ transform: isHovered ? "translateZ(20px)" : "translateZ(0px)", transition: "transform 0.5s ease" }}>
        
        <div className="flex items-center gap-5">
          <div className={cn(
            "p-3.5 rounded-full bg-white/5 border border-white/10 transition-all duration-500",
            isHovered ? "bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "",
            isClicked ? "bg-cyan-500/30 border-cyan-400/50 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)]" : "text-white/70"
          )}>
            {channel.icon}
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-medium tracking-wide transition-colors duration-300",
              isHovered || isClicked ? "text-white" : "text-white/80",
              isClicked ? "text-cyan-100" : ""
            )}>
              {channel.name}
            </span>
            <span className={cn(
              "text-xs tracking-wider uppercase font-mono mt-1 transition-colors duration-300",
              isHovered ? "text-white/60" : "text-white/30",
              isClicked ? "text-cyan-400/60" : ""
            )}>
              {channel.desc}
            </span>
          </div>
        </div>

        <div className={cn(
          "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500",
          isHovered ? "border-white/30 bg-white/10 translate-x-1" : "border-transparent bg-transparent",
          isClicked ? "border-cyan-400/50 bg-cyan-500/20" : ""
        )}>
          <ArrowUpRight className={cn(
            "w-4 h-4 transition-all duration-300",
            isHovered ? "text-white opacity-100" : "text-white/30 opacity-0",
            isClicked ? "text-cyan-400" : ""
          )} />
        </div>

      </div>
    </div>
  );
}
