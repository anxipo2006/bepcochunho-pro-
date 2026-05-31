import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: "#ff6f61",
          dark: "#c24135",
          soft: "#fff1ef",
        },
        teal: {
          DEFAULT: "#10b8c2",
        },
        offwhite: "#f8fafc",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam-pro)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-roboto-mono)", "ui-monospace", "SFMono-Regular"],
      },
    },
  },
  plugins: [],
};

export default config;
