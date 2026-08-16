import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C5CE7",
          light: "#8B7CF6",
          dark: "#4C3FC7"
        },
        secondary: {
          DEFAULT: "#00D9C6",
          light: "#3FEFDF",
          dark: "#00A896"
        },
        background: {
          DEFAULT: "#05050A",
          elevated: "#0A0A14"
        },
        surface: {
          DEFAULT: "#0F0F1A",
          hover: "#15151F",
          border: "#1E1E2E"
        },
        border: "#1E1E2E",
        text: {
          DEFAULT: "#F2F2F7",
          muted: "#8A8A9E"
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(108, 92, 231, 0.35)",
        "glow-cyan": "0 0 40px rgba(0, 217, 198, 0.25)"
      },
      backgroundImage: {
        "grid-fade": "radial-gradient(circle at center, rgba(108,92,231,0.15) 0%, transparent 70%)"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        gradient: "gradient 8s ease infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" }
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        }
      }
    }
  },
  plugins: []
};

export default config;
