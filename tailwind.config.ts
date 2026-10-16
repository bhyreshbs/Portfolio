import type { Config } from "tailwindcss";

/**
 * Theme-aware palette. `white` / `black` are remapped to CSS variables so every
 * existing `text-white/60`, `bg-white/5`, `bg-black/40`, `border-white/10`
 * utility follows the active theme (see :root / .light in globals.css):
 *   white → foreground ink (white in dark, near-black in light)
 *   black → shade colour   (black in dark, white in light)
 *   canvas → page background
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "rgb(var(--fg) / <alpha-value>)",
        black: "rgb(var(--shade) / <alpha-value>)",
        canvas: "rgb(var(--bg) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
