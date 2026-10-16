/**
 * Performance tiers — one effects budget per class of machine.
 *
 *   high    discrete / modern GPUs: every effect (cursor glow, grain, conic ring,
 *           5 animated aurora layers, 3D card tilt, full backdrop blur)
 *   medium  integrated GPUs, laptops, phones: lighter blur, 3 aurora layers, no grain /
 *           conic ring / cursor glow / tilt
 *   low     software rendering, weak or data-saver devices, reduced motion: no backdrop
 *           blur, static background, no floating/spotlight/smooth-scroll effects
 *
 * How the tier is chosen (first match wins):
 *   1. the visitor's own choice (footer switch, stored)           → exactly that tier
 *   2. a fresh stored result from a previous visit (7 days)
 *   3. hard signals: reduced-motion, data-saver, ≤2 GB RAM, ≤2 cores        → low
 *   4. the GPU itself: software/legacy renderer → low; integrated → medium;
 *      discrete/Apple Silicon → high; unknown → medium
 *   5. modifiers: touch/mobile caps at medium; a 4K-class canvas on a non-high GPU → down one
 *   6. a runtime frame-time monitor steps the tier DOWN if the page actually stutters
 *
 * The tier is exposed as `html[data-tier="full" | "mid" | "lite"]` so CSS can adapt too.
 */

import { useEffect, useSyncExternalStore } from "react";

export type PerfTier = "high" | "medium" | "low";
export type PerfPreference = PerfTier | "auto";

const AUTO_KEY = "perf-auto"; // "tier|timestamp"
const PREF_KEY = "perf-pref";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const ORDER: PerfTier[] = ["low", "medium", "high"];

// Server render and the first client render both use "high", so markup always matches.
let tier: PerfTier = "high";
let preference: PerfPreference = "auto";
let initialised = false;
const listeners = new Set<() => void>();

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const emit = () => listeners.forEach((l) => l());

function apply(next: PerfTier) {
  tier = next;
  document.documentElement.dataset.tier = next === "low" ? "lite" : next === "medium" ? "mid" : "full";
  emit();
}

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string | null) => {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    // storage blocked — fine, we just won't persist
  }
};
const down = (t: PerfTier): PerfTier => ORDER[Math.max(0, ORDER.indexOf(t) - 1)];

// ───────────────────────── GPU / device classification ─────────────────────────

function gpuTier(): PerfTier | null {
  try {
    const canvas = document.createElement("canvas");
    // failIfMajorPerformanceCaveat: the browser returns null instead of a software rasteriser
    const gl = (canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true })) as WebGLRenderingContext | null;
    if (!gl) return "low";

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext(); // free the context immediately

    const r = renderer.toLowerCase();
    if (/swiftshader|llvmpipe|softpipe|software|microsoft basic|mesa offscreen|virgl/.test(r)) return "low";
    if (/mali-[2-4]\d\d|mali-t|adreno \(tm\) [2-4]\d\d|adreno[ _-]?[2-4]\d\d\b|powervr|videocore|intel.*(hd graphics [2-5]\d{3}|gma)/.test(r)) return "low";
    if (/geforce|rtx|gtx|quadro|nvidia|radeon (rx|pro)|radeon\(tm\) (rx|pro)|arc\(tm\)? ?[ab]\d|apple m\d|apple gpu.*(pro|max|ultra)/.test(r))
      // GT/MX-class NVIDIA cards are entry level
      return /geforce (gt|mx) ?\d|gt ?\d{3}\b|mx ?\d{2,3}\b/.test(r) ? "medium" : "high";
    if (/intel|iris|uhd|radeon.*graphics|radeon vega|amd radeon\(tm\) graphics|apple|mali-g|adreno|immortalis|xclipse/.test(r)) return "medium";
    return null; // unknown
  } catch {
    return null;
  }
}

function detect(): PerfTier {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  // Hard signals
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";
  if (nav.connection?.saveData) return "low";
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return "low";
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return "low";

  let t: PerfTier = gpuTier() ?? "medium";

  // Phones/tablets never get the desktop-class budget
  if (window.matchMedia("(pointer: coarse)").matches && t === "high") t = "medium";
  // Older/mid devices: a weak CPU also caps the tier
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 && t === "high") t = "medium";
  // A 4K-class canvas is a lot of pixels for anything that isn't a discrete GPU
  const pixels = screen.width * screen.height * (window.devicePixelRatio || 1) ** 2;
  if (pixels > 8_000_000 && t !== "high") t = down(t);

  return t;
}

// ───────────────────────── Runtime frame-time monitor ─────────────────────────

/**
 * Samples real frame times for the first ~25s. If the page averages worse than ~31fps over
 * a 90-frame window, drop one tier (never more than twice). Ignores frames while the tab is
 * hidden/throttled so a background tab can't trigger a downgrade.
 */
function startMonitor() {
  let last = 0;
  let frames: number[] = [];
  let downgrades = 0;
  const started = performance.now();

  const tick = (now: number) => {
    if (preference !== "auto" || tier === "low" || now - started > 25_000 || downgrades >= 2) return;
    if (last && !document.hidden) {
      const dt = now - last;
      if (dt < 250) frames.push(dt); // ignore stalls from tab switches
    }
    last = now;

    // Skip the first 2s: font load, hydration and the intro animation compile shaders/layers
    if (frames.length >= 90 && now - started > 2000) {
      const avg = frames.reduce((a, b) => a + b, 0) / frames.length;
      frames = [];
      if (avg > 32) {
        downgrades++;
        const next = down(tier);
        write(AUTO_KEY, `${next}|${Date.now()}`);
        apply(next);
      }
    } else if (frames.length >= 90) {
      frames = [];
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ───────────────────────── Public API ─────────────────────────

function init() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;

  const pref = read(PREF_KEY) as PerfPreference | null;
  if (pref === "high" || pref === "medium" || pref === "low") {
    preference = pref;
    apply(pref);
    return;
  }

  // Dev/testing override: ?perf=low|medium|high
  const q = new URLSearchParams(location.search).get("perf");
  if (q === "high" || q === "medium" || q === "low") {
    apply(q);
    return;
  }

  const [stored, ts] = (read(AUTO_KEY) ?? "").split("|");
  if ((stored === "high" || stored === "medium" || stored === "low") && Date.now() - Number(ts) < TTL_MS) {
    apply(stored);
  } else {
    const detected = detect();
    write(AUTO_KEY, `${detected}|${Date.now()}`);
    apply(detected);
  }
  startMonitor();
}

/** Choose a tier manually, or "auto" to detect again. */
export function setPerfPreference(next: PerfPreference) {
  preference = next;
  if (next === "auto") {
    write(PREF_KEY, null);
    write(AUTO_KEY, null);
    apply(detect());
    startMonitor();
  } else {
    write(PREF_KEY, next);
    apply(next);
  }
  emit();
}

export function usePerfPreference(): PerfPreference {
  return useSyncExternalStore(subscribe, () => preference, () => "auto");
}

/** Current tier. Starts as "high" (matches the server), then settles after mount. */
export function usePerfTier(): PerfTier {
  useEffect(init, []);
  return useSyncExternalStore(subscribe, () => tier, () => "high");
}

/** Back-compat helper: true only on the lowest tier. */
export function useLowEnd(): boolean {
  return usePerfTier() === "low";
}
