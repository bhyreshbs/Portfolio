"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, SendHorizontal, Sparkles, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { usePerfTier } from "@/utils/lowEnd";
import { answer, SUGGESTIONS, type Source } from "@/lib/rag";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
  followUps?: string[];
  /** Assistant message still being revealed */
  streaming?: boolean;
}

const GRADIENT = "linear-gradient(135deg, #7b61ff 0%, #00d4ff 55%, #ff5fa2 100%)";

/** Renders **bold** and line breaks from the RAG answer text. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <p key={i} className={cn(i > 0 && "mt-2")}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") ? (
              <strong key={j} className="font-semibold text-white">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </p>
      ))}
    </>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-2" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-white/50"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [seen, setSeen] = useState(false);
  const tier = usePerfTier();
  const lowEnd = tier === "low";

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const busy = thinking || messages.some((m) => m.streaming);

  // Teaser bubble after a short delay (once, until the chat is opened)
  useEffect(() => {
    const show = setTimeout(() => setTeaser(true), 6000);
    const hide = setTimeout(() => setTeaser(false), 14000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Keep the newest message in view
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    if (open) {
      setSeen(true);
      setTeaser(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = useCallback(
    (raw: string) => {
      const q = raw.trim();
      if (!q || busy) return;

      setMessages((m) => [...m, { id: nextId.current++, role: "user", text: q }]);
      setInput("");
      setThinking(true);

      // Retrieval is instant; the pause + word-by-word reveal just makes it feel conversational
      const result = answer(q);
      const id = nextId.current++;
      const words = result.text.split(/(\s+)/); // keep whitespace/newlines

      timers.current.push(
        setTimeout(() => {
          setThinking(false);
          setMessages((m) => [...m, { id, role: "assistant", text: "", streaming: true }]);

          let shown = 0;
          const step = () => {
            shown = Math.min(words.length, shown + 3);
            const done = shown >= words.length;
            setMessages((m) =>
              m.map((msg) =>
                msg.id === id
                  ? {
                      ...msg,
                      text: words.slice(0, shown).join(""),
                      streaming: !done,
                      ...(done ? { sources: result.sources, followUps: result.followUps } : null),
                    }
                  : msg
              )
            );
            if (!done) timers.current.push(setTimeout(step, 24));
          };
          step();
        }, 550 + Math.random() * 350)
      );
    },
    [busy]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <>
      {/* ───────── Panel ───────── */}
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Portfolio assistant"
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+4.25rem)] right-4 z-[95] flex h-[min(36rem,calc(100dvh-8.5rem))] max-sm:max-h-[calc(100dvh-8.5rem)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-white/15 bg-canvas/85 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:right-6"
          >
            {/* Header */}
            <header className="relative flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: GRADIENT }}
              />
              <span
                className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"
                style={{ background: GRADIENT }}
              >
                <Sparkles size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-white">Portfolio Assistant</h2>
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Answers from this site
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 outline-none transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </header>

            {/* Messages (data-lenis-prevent: let this box scroll natively inside smooth-scroll) */}
            <div
              ref={listRef}
              data-lenis-prevent
              aria-live="polite"
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5"
            >
              {messages.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <div className="mb-5 rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-relaxed text-white/80">
                    Hi! Ask me about Bhyresh&apos;s projects, skills, education or how to reach him.
                  </div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/35">Try asking</p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s, i) => (
                      <motion.button
                        key={s}
                        type="button"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.07 }}
                        whileHover={{ x: 4 }}
                        onClick={() => ask(s)}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-left text-sm text-white/70 outline-none transition-colors hover:border-white/30 hover:text-white"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "max-w-[88%] px-4 py-3 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-2xl rounded-tr-md bg-white text-canvas"
                        : "rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.05] text-white/80"
                    )}
                  >
                    <RichText text={m.text} />
                    {m.streaming && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-white/60" />
                    )}
                  </div>

                  {/* Citations */}
                  {m.sources && m.sources.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex max-w-[92%] flex-wrap items-center gap-1.5"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Sources</span>
                      {m.sources.map((s) => (
                        <a
                          key={s.href}
                          href={s.href}
                          {...(s.external ? { target: "_blank", rel: "noreferrer" } : null)}
                          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70 outline-none transition-colors hover:border-white/40 hover:text-white"
                        >
                          {s.title} <ArrowUpRight size={11} />
                        </a>
                      ))}
                    </motion.div>
                  )}

                  {/* Follow-ups on the latest finished answer */}
                  {m.followUps && m.id === messages[messages.length - 1].id && !busy && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.followUps.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => ask(f)}
                          className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/55 outline-none transition-colors hover:border-white/35 hover:text-white"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {thinking && (
                <div className="flex">
                  <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.05] px-3">
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={onSubmit} className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-white/40">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about projects, skills…"
                  aria-label="Your question"
                  maxLength={200}
                  className="min-w-0 flex-1 bg-transparent text-base text-white outline-none sm:text-sm placeholder:text-white/35"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  aria-label="Send"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white outline-none transition-all enabled:hover:scale-105 disabled:opacity-35"
                  style={{ background: GRADIENT }}
                >
                  <SendHorizontal size={16} />
                </button>
              </div>
              <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-white/25">
                Retrieval over this portfolio · no external AI
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ───────── Floating button ───────── */}
      <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[95] sm:right-6">
        {/* Teaser */}
        <AnimatePresence>
          {teaser && !open && (
            <motion.button
              type="button"
              onClick={() => setOpen(true)}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="absolute bottom-3 right-[4.5rem] hidden whitespace-nowrap rounded-2xl sm:block rounded-br-sm border border-white/15 bg-canvas/90 px-4 py-2.5 text-sm text-white shadow-lg backdrop-blur-xl outline-none"
            >
              Ask me about the portfolio ✨
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close portfolio assistant" : "Open portfolio assistant"}
          aria-expanded={open}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0, y: !open && !lowEnd ? [0, -7, 0] : 0 }}
          transition={{
            scale: { type: "spring", stiffness: 260, damping: 18, delay: 3 },
            rotate: { type: "spring", stiffness: 260, damping: 18, delay: 3 },
            y: !open && !lowEnd ? { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 3.5 } : { duration: 0.2 },
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_12px_32px_-8px_rgba(123,97,255,0.7)] outline-none will-change-transform"
          style={{ background: GRADIENT }}
        >
          {/* Pulse rings */}
          {!open && tier === "high" && (
            <>
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ background: GRADIENT }}
                animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ background: GRADIENT }}
                animate={{ scale: [1, 1.6], opacity: [0.35, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
              />
            </>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "x" : "chat"}
              initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex"
            >
              {open ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.span>
          </AnimatePresence>

          {/* Unread dot until first open */}
          {!seen && !open && (
            <span className="absolute -right-0.5 -top-0.5 z-10 h-3.5 w-3.5 rounded-full border-2 border-canvas bg-rose-500" />
          )}
        </motion.button>
      </div>
    </>
  );
}
