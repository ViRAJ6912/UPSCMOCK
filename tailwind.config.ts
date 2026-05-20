import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0f172a",
          soft: "#334155",
          mute: "#64748b",
        },
        paper: "#fbfaf6",
        surface: "#ffffff",
        accent: {
          DEFAULT: "#8a1c1c",
          soft: "#c14545",
          dark: "#6b1414",
        },
        gold: "#c89b3c",
        ok: "#16a34a",
        warn: "#f59e0b",
        bad: "#dc2626",
        info: "#2563eb",
        review: "#7c3aed",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-merriweather)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        pulseSlow: "pulseSlow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
