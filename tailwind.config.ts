import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15120F",
        panel: "#211C17",
        "panel-2": "#2A2420",
        paper: "#F3ECDD",
        "paper-2": "#EAE1CC",
        signal: {
          DEFAULT: "#E8432B",
          soft: "#F2795F",
        },
        brass: {
          DEFAULT: "#CFA038",
          soft: "#E0BE6E",
        },
        mist: "#9C9186",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-dot": "pulseDot 1.4s ease-in-out infinite",
        "rise-in": "riseIn 0.35s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
