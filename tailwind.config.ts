import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        surface: "#1E293B",
        border: "#334155",
        primary: "#3B82F6",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        text: "#F8FAFC",
        muted: "#94A3B8"
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(15, 23, 42, 0.45)",
        soft: "0 10px 30px rgba(15, 23, 42, 0.25)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(59,130,246,0.20), transparent 28%), radial-gradient(circle at top right, rgba(34,197,94,0.12), transparent 24%), linear-gradient(180deg, rgba(15,23,42,0.95), rgba(15,23,42,1))"
      }
    }
  },
  plugins: []
};

export default config;
