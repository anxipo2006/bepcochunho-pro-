import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: "#ff6f61",
          medium: "#e05a4e",
          dark: "#c24135",
          soft: "#fff1ef",
          glow: "rgba(255,111,97,0.35)",
        },
        teal: {
          DEFAULT: "#10b8c2",
          glow: "rgba(16,184,194,0.25)",
        },
        offwhite: "#f8fafc",
        surface: "#ffffff",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam-pro)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-roboto-mono)", "ui-monospace", "SFMono-Regular"],
      },
      boxShadow: {
        "coral-glow": "0 0 0 4px rgba(255,111,97,0.18), 0 4px 24px rgba(255,111,97,0.25)",
        "teal-glow": "0 0 0 4px rgba(16,184,194,0.15), 0 4px 20px rgba(16,184,194,0.2)",
        "card-hover": "0 8px 40px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06)",
        "card-md": "0 4px 20px rgba(15,23,42,0.08), 0 1px 4px rgba(15,23,42,0.04)",
        "glass": "0 8px 32px rgba(15,23,42,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "float-up": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "70%": { transform: "scale(1.4)", opacity: "0" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-8px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        "float-up": "float-up 3s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-up": "fade-up 0.4s ease-out",
        "spin-slow": "spin-slow 8s linear infinite",
      },
      backgroundImage: {
        "coral-gradient": "linear-gradient(135deg, #ff6f61 0%, #e05a4e 50%, #c24135 100%)",
        "teal-gradient": "linear-gradient(135deg, #10b8c2 0%, #0891b2 100%)",
        "hero-mesh": "radial-gradient(ellipse at 20% 50%, rgba(255,111,97,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(16,184,194,0.1) 0%, transparent 50%)",
        "card-shine": "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
