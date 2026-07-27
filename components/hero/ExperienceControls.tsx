"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, AudioWaveform, Play, Pause, SkipBack, SkipForward, MoreHorizontal, X, Repeat, Shuffle, Volume2, BellOff } from "lucide-react";
import { cn } from "@/utils/cn";
import { soundEngine } from "@/utils/audio";

export default function ExperienceControls() {
  const [isMusicExpanded, setIsMusicExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Audio helper handlers
  const handleHover = () => isSoundEnabled && soundEngine?.playTick();
  const handleClick = () => isSoundEnabled && soundEngine?.playClick();
  const handleExpand = () => isSoundEnabled && soundEngine?.playExpand();
  const handlePop = () => isSoundEnabled && soundEngine?.playPop();

  const toggleSound = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    if (soundEngine) {
      soundEngine.enabled = newState;
    }
    if (newState) soundEngine?.playClick();
  };

  const toggleMusicExpansion = () => {
    if (!isMusicExpanded) {
      handleExpand();
      setIsMusicExpanded(true);
    } else {
      handleClick();
      setIsMusicExpanded(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      style={{ touchAction: "none" }}
      className="fixed left-6 md:left-10 top-1/2 -translate-y-1/2 z-[100] flex items-end cursor-grab active:cursor-grabbing"
      initial={{ x: -100, y: "-50%", opacity: 0 }}
      animate={{ x: 0, y: "-50%", opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 3.8 }}
    >
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className={cn(
          "relative flex flex-col justify-end bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-visible",
          isMusicExpanded ? "w-[320px] md:w-[400px] h-[120px] flex-row items-center justify-between p-4" : "w-[60px] h-[130px] items-center p-2 gap-2"
        )}
      >
        {/* Inner glow highlight */}
        <div className="absolute inset-0 rounded-[40px] border border-white/5 mix-blend-overlay pointer-events-none"></div>

        <AnimatePresence>
          {!isMusicExpanded ? (
            <motion.div 
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col items-center gap-3 w-full h-full justify-between p-2"
            >
              <button
                onMouseEnter={handleHover}
                onClick={toggleMusicExpansion}
                className="group relative w-11 h-11 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all duration-300"
              >
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity"></div>
                <Music className="w-4 h-4 text-cyan-100 relative z-10" />
              </button>

              <button
                onMouseEnter={handleHover}
                onClick={toggleSound}
                className="group relative w-11 h-11 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all duration-300"
              >
                {isSoundEnabled ? (
                  <>
                    <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity"></div>
                    <AudioWaveform className="w-4 h-4 text-white relative z-10" />
                  </>
                ) : (
                  <BellOff className="w-4 h-4 text-white/30 relative z-10" />
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="expanded"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-between w-full h-full p-4"
            >
              <div className="flex items-center justify-between w-[288px] md:w-[368px] h-full flex-shrink-0">
                {/* Left Side: Artwork & Info */}
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => { handleClick(); setIsPlaying(!isPlaying); }}>
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-black border border-white/10 shadow-lg group">
                  <img src="https://images.unsplash.com/photo-1614113489855-66422ad300a4?q=80&w=200&auto=format&fit=crop" alt="Album Art" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isPlaying ? <Pause className="w-6 h-6 text-white" fill="white" /> : <Play className="w-6 h-6 text-white" fill="white" className="ml-1" />}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold tracking-wide">Synthetic Shadows</span>
                  <span className="text-white/50 text-xs font-mono uppercase tracking-widest mt-0.5">The Midnight</span>
                  
                  {/* Fake Equalizer */}
                  <div className="flex items-end gap-[3px] mt-2 h-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: isPlaying ? ["20%", "100%", "40%", "80%", "20%"] : "20%" }}
                        transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        className="w-[2px] bg-cyan-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Controls */}
              <div className="flex items-center gap-2">
                <button onMouseEnter={handleHover} onClick={handleClick} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <SkipBack className="w-4 h-4 text-white/70 hover:text-white" />
                </button>
                <button onMouseEnter={handleHover} onClick={() => { handleClick(); setIsPlaying(!isPlaying); }} className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all">
                  {isPlaying ? <Pause className="w-4 h-4" fill="black" /> : <Play className="w-4 h-4 ml-1" fill="black" />}
                </button>
                <button onMouseEnter={handleHover} onClick={handleClick} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <SkipForward className="w-4 h-4 text-white/70 hover:text-white" />
                </button>
                
                {/* Three Dot Menu Trigger */}
                <div className="relative ml-2">
                  <button 
                    onMouseEnter={handleHover} 
                    onClick={() => { handlePop(); setIsMenuOpen(!isMenuOpen); }} 
                    className={cn(
                      "p-2 rounded-full transition-colors duration-300",
                      isMenuOpen ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/50 hover:text-white"
                    )}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

                  {/* Context Menu Popup */}
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)", y: 10 }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", y: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute bottom-full right-0 mb-4 w-48 p-2 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-1 z-50 origin-bottom-right"
                      >
                        <MenuItem icon={<Repeat className="w-4 h-4" />} label="Loop" onClick={handleClick} />
                        <MenuItem icon={<Shuffle className="w-4 h-4" />} label="Shuffle" onClick={handleClick} />
                        <MenuItem icon={<Volume2 className="w-4 h-4" />} label="Volume" onClick={handleClick} />
                        <div className="h-[1px] w-full bg-white/5 my-1"></div>
                        <MenuItem icon={<X className="w-4 h-4" />} label="Collapse Player" onClick={toggleMusicExpansion} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// Helper for Context Menu
function MenuItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
