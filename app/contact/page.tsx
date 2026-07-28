import ContactSection from "@/components/contact/ContactSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Contact - Communication Terminal",
  description: "Initiate collaboration protocols.",
};

export default function ContactPage() {
  return (
    <main className="relative bg-[#050505] min-h-screen selection:bg-white/20 selection:text-white text-white">
      {/* Premium Back Button */}
      <Link 
        href="/"
        className="fixed top-6 left-6 md:top-10 md:left-10 z-[100] group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md hover:bg-white/[0.08] hover:border-white/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-500 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <ArrowLeft className="w-4 h-4 text-white/70 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-all duration-300 relative z-10" />
        <span className="font-mono text-xs tracking-[0.2em] text-white/70 uppercase group-hover:text-white transition-colors duration-300 relative z-10">
          Return
        </span>
      </Link>
      
      <ContactSection />
    </main>
  );
}
