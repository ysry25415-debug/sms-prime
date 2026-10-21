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
        background: "#F7F5ED",
        surface: "#FFFFFF",
        raised: "#EFECDD",
        border: "#E5E1D3",
        primary: "#1E1D19",
        accent: "#E5B928",
        success: "#247B50",
        warning: "#9A6700",
        danger: "#B42318",
        text: "#1E1D19",
        muted: "#68645A"
      },
      borderRadius: {
        xl: "8px",
        "2xl": "12px",
        "3xl": "16px"
      },
      boxShadow: {
        soft: "0 1px 4px rgba(30, 29, 25, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
