import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: "#b95035",
          medium: "#a74832",
          dark: "#873b2c",
          soft: "#f7e9df",
          glow: "rgba(185,80,53,0.24)",
        },
        teal: {
          DEFAULT: "#55765d",
          glow: "rgba(85,118,93,0.2)",
        },
        offwhite: "#f8f3e8",
        surface: "#fffdf8",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam-pro)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-noto-serif)", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        "coral-glow": "0 0 0 4px rgba(185,80,53,0.14), 0 4px 24px rgba(185,80,53,0.18)",
        "teal-glow": "0 0 0 4px rgba(85,118,93,0.14), 0 4px 20px rgba(85,118,93,0.16)",
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
        "coral-gradient": "linear-gradient(135deg, #c96a49 0%, #b95035 55%, #873b2c 100%)",
        "teal-gradient": "linear-gradient(135deg, #73906f 0%, #55765d 100%)",
        "hero-mesh": "radial-gradient(ellipse at 20% 50%, rgba(185,80,53,0.13) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(85,118,93,0.10) 0%, transparent 50%)",
        "card-shine": "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
