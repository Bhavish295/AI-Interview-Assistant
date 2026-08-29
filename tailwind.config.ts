import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#F4F7FB",
        panel: "#121A2B",
        "panel-2": "#1A2438",
        paper: "#0B1220",
        "paper-2": "#0F172A",
        signal: {
          DEFAULT: "#22D3EE",
          soft: "#67E8F9",
        },
        brass: {
          DEFAULT: "#EAB308",
          soft: "#FACC15",
        },
        mist: "#94A3B8",
        navy: "#070D18",
      },
      fontFamily: {
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
      },
      animation: {
        "pulse-dot": "pulseDot 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
