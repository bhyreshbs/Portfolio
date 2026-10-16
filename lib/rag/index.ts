/**
 * Client-side RAG for the portfolio assistant.
 *
 *   knowledge base (portfolio facts, chunked)  →  BM25 retrieval  →  extractive,
 *   cited answer. No server, no API key, nothing leaves the browser. To swap the
 *   answer step for an LLM later, keep `retrieve()` and send its chunks as context.
 */

import { PROJECTS } from "@/components/projects/ProjectsSection";

export interface Source {
  title: string;
  href: string;
  external?: boolean;
}

interface Chunk {
  id: string;
  title: string;
  section: "About" | "Skills" | "Work" | "Contact";
  text: string;
  /** Extra match terms (not shown) so natural phrasings still hit the chunk */
  keywords: string;
  source: Source;
}

export interface Answer {
  text: string;
  sources: Source[];
  followUps: string[];
}

// ───────────────────────── Knowledge base ─────────────────────────

const projectChunks: Chunk[] = PROJECTS.map((p) => ({
  id: `project-${p.name}`,
  title: p.name,
  section: "Work",
  text: `**${p.name}** (${p.badge}): ${p.summary} Built with ${p.tags.join(", ")}.${p.live ? " It has a live demo." : ""}`,
  keywords: `project work built portfolio shipped ${p.tags.join(" ")} ${p.badge} ${p.live ? "live demo deployed" : "github repo"}`,
  source: { title: p.name, href: p.live ?? p.repo, external: true },
}));

const CHUNKS: Chunk[] = [
  {
    id: "profile",
    title: "Who is Bhyresh",
    section: "About",
    text: "Bhyresh BS is an AI & Machine Learning Engineer. He builds intelligent products and interactive web experiences where engineering, machine learning and design work together.",
    keywords: "who bio about introduce yourself profile engineer name role job title",
    source: { title: "About", href: "/#about" },
  },
  {
    id: "education",
    title: "Education",
    section: "About",
    text: "Bhyresh is pursuing a B.Tech in Artificial Intelligence & Machine Learning.",
    keywords: "education degree btech study studied college university school qualification",
    source: { title: "About", href: "/#about" },
  },
  {
    id: "focus",
    title: "Focus areas",
    section: "About",
    text: "His focus areas are Artificial Intelligence, Machine Learning, LLM applications, computer vision, agentic AI, creative development and interactive web experiences.",
    keywords: "focus interests specialise specialize areas expertise passionate working on",
    source: { title: "About", href: "/#about" },
  },
  {
    id: "github-stats",
    title: "GitHub at a glance",
    section: "About",
    text: "On GitHub (bhyreshbs) he has 10 public repositories, 4 live demos and has shipped projects in 6 languages: Python, TypeScript, JavaScript, Kotlin, Java and C++.",
    keywords: "github repos repositories stats numbers how many languages open source activity",
    source: { title: "GitHub", href: "https://github.com/bhyreshbs", external: true },
  },
  {
    id: "skills-languages",
    title: "Languages",
    section: "Skills",
    text: "Languages: Python, TypeScript, JavaScript, Kotlin, Java, C, C++, PowerShell, HTML5 and CSS3. Most project work is in Python, TypeScript and Kotlin.",
    keywords: "skills stack tech technologies programming languages code coding know proficient",
    source: { title: "Skills", href: "/#skills" },
  },
  {
    id: "skills-frameworks",
    title: "Frameworks & tools",
    section: "Skills",
    text: "Frameworks and platforms: React, Tailwind CSS, Next.js, Prisma and Vercel. Creative and dev tools: Autodesk Fusion 360, Unity, Canva and GitHub.",
    keywords: "skills stack tech technologies frameworks libraries tools web frontend react nextjs tailwind cad 3d design fusion autodesk",
    source: { title: "Skills", href: "/#skills" },
  },
  {
    id: "skills-databases",
    title: "Databases",
    section: "Skills",
    text: "Databases: PostgreSQL, MySQL, MongoDB, SQLite and Supabase.",
    keywords: "skills stack tech technologies database databases sql nosql data storage backend",
    source: { title: "Skills", href: "/#skills" },
  },
  ...projectChunks,
  {
    id: "more-projects",
    title: "More projects",
    section: "Work",
    text: "Other repositories include a live CGPA/SGPA calculator with grade analytics, a target predictor and PDF export; Kala-Setu-Mobile, an Android app in Kotlin; and Agent Zero, a multiplayer escape-room game that teaches agentic-AI concepts (with a live demo). The full list is on GitHub.",
    keywords: "more other projects repositories gpa cgpa calculator kala setu mobile android kotlin agent zero game escape room",
    source: { title: "GitHub repos", href: "https://github.com/bhyreshbs?tab=repositories", external: true },
  },
  {
    id: "contact",
    title: "Contact",
    section: "Contact",
    text: "You can reach Bhyresh by email, on LinkedIn or on GitHub, and download his resume. All of these are in the Contact section at the bottom of the page. He is also on X as @bhyreshbs.",
    keywords: "contact reach email hire hiring connect touch talk message linkedin twitter x social collaborate opportunity resume cv",
    source: { title: "Contact", href: "/#contact" },
  },
];

// ───────────────────────── Retrieval (BM25) ─────────────────────────

const STOP = new Set(
  "a an the is are was were be been being of for to in on at by with and or but what which who whom how do does did can could should would you your yours he his him she her it its this that these those about tell me us my i any some there their them from as into than then so if not no yes please more also just".split(
    " "
  )
);

// Query expansion: natural phrasings → the vocabulary used by the chunks
const SYNONYMS: Record<string, string[]> = {
  built: ["project", "work"],
  build: ["project", "work"],
  made: ["project", "work"],
  projects: ["project", "work"],
  portfolio: ["project", "work"],
  stack: ["skills", "technologies"],
  tech: ["skills", "technologies"],
  tools: ["skills"],
  know: ["skills"],
  languages: ["skills", "languages"],
  study: ["education"],
  degree: ["education"],
  college: ["education"],
  btech: ["education"],
  hire: ["contact"],
  email: ["contact"],
  reach: ["contact"],
  connect: ["contact"],
  linkedin: ["contact"],
  twitter: ["contact"],
  demo: ["live"],
  deployed: ["live"],
  repo: ["github"],
  repos: ["github"],
  llm: ["llm", "ai"],
  ml: ["machine", "learning"],
  ai: ["artificial", "intelligence"],
};

const stem = (t: string) => (t.length > 3 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t);
const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ""))
    .filter((t) => t && !STOP.has(t))
    .map(stem);

interface Indexed {
  chunk: Chunk;
  tf: Map<string, number>;
  len: number;
}

const INDEX: Indexed[] = CHUNKS.map((chunk) => {
  // Title and keywords are weighted (repeated) so they outrank body-text noise
  const terms = [...tokenize(chunk.title), ...tokenize(chunk.title), ...tokenize(chunk.keywords), ...tokenize(chunk.text)];
  const tf = new Map<string, number>();
  terms.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
  return { chunk, tf, len: terms.length };
});
const AVG_LEN = INDEX.reduce((a, d) => a + d.len, 0) / INDEX.length;
const DF = new Map<string, number>();
INDEX.forEach((d) => d.tf.forEach((_, t) => DF.set(t, (DF.get(t) ?? 0) + 1)));

const K1 = 1.5;
const B = 0.75;

export function retrieve(query: string, k = 3): { chunk: Chunk; score: number }[] {
  const base = tokenize(query);
  const terms = new Set(base);
  base.forEach((t) => SYNONYMS[t]?.forEach((s) => terms.add(stem(s))));

  const N = INDEX.length;
  return INDEX.map((d) => {
    let score = 0;
    terms.forEach((t) => {
      const f = d.tf.get(t);
      if (!f) return;
      const df = DF.get(t) ?? 0;
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
      score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / AVG_LEN)));
    });
    return { chunk: d.chunk, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

// ───────────────────────── Answering ─────────────────────────

export const SUGGESTIONS = [
  "What projects has Bhyresh built?",
  "Which projects use Python?",
  "What's his tech stack?",
  "How can I contact him?",
];

const FOLLOW_UPS: Record<Chunk["section"], string[]> = {
  About: ["What projects has Bhyresh built?", "What's his tech stack?"],
  Skills: ["What projects has Bhyresh built?", "Which projects use Python?"],
  Work: ["Which projects have live demos?", "How can I contact him?"],
  Contact: ["What projects has Bhyresh built?", "Tell me about his education"],
};

const MIN_SCORE = 0.9;

export function answer(query: string): Answer {
  const q = query.trim();

  if (/^(hi|hello|hey|yo|hola|namaste|good (morning|afternoon|evening))\b/i.test(q) && q.split(/\s+/).length <= 4) {
    return {
      text: "Hi! I'm the portfolio assistant. I can answer questions about Bhyresh's projects, skills, education and how to get in touch. What would you like to know?",
      sources: [],
      followUps: SUGGESTIONS.slice(0, 3),
    };
  }
  if (/^(thanks|thank you|thx|ty|cheers)\b/i.test(q)) {
    return { text: "You're welcome! Ask me anything else about the portfolio.", sources: [], followUps: SUGGESTIONS.slice(0, 2) };
  }

  const results = retrieve(q, CHUNKS.length);
  const top = results[0];

  if (!top || top.score < MIN_SCORE) {
    return {
      text: "I couldn't find that in this portfolio. I can only answer from what's on the site: projects, skills, education and contact details. Try one of the questions below.",
      sources: [],
      followUps: SUGGESTIONS,
    };
  }

  const strong = results.filter((r) => r.score >= top.score * 0.7);
  // Project lists use a looser cut-off so "what projects…" shows all the relevant ones
  const projectHits = results.filter(
    (r) => r.chunk.id.startsWith("project-") && r.score >= top.score * 0.5
  );

  let text: string;
  let used: typeof strong;

  if (projectHits.length >= 2) {
    // Several projects match (e.g. "which projects use Python?") → compact list
    used = projectHits;
    text =
      `Here are the closest matches:\n` +
      projectHits
        .map((r) => {
          const p = PROJECTS.find((pr) => `project-${pr.name}` === r.chunk.id)!;
          return `• **${p.name}**: ${p.summary}`;
        })
        .join("\n");
  } else if (top.chunk.section === "Skills") {
    // Skills are split into chunks for retrieval, but read best as one answer
    used = results.filter((r) => r.chunk.section === "Skills");
    text = CHUNKS.filter((c) => c.section === "Skills")
      .map((c) => c.text)
      .join("\n");
  } else {
    used = [top];
    text = top.chunk.text;
    const second = strong[1];
    if (second && second.chunk.section !== top.chunk.section) {
      used.push(second);
      text += `\n\n${second.chunk.text}`;
    }
  }

  return {
    text,
    sources: used.map((r) => r.chunk.source).filter((s, i, a) => a.findIndex((x) => x.href === s.href) === i),
    followUps: FOLLOW_UPS[top.chunk.section],
  };
}
