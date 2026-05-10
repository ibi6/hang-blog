import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bgFrom: "rgb(var(--bg-from) / <alpha-value>)",
        bgTo: "rgb(var(--bg-to) / <alpha-value>)",
        glass: "rgb(var(--glass-bg) / <alpha-value>)",
        glassBorder: "rgb(var(--glass-border) / <alpha-value>)",
        textPrimary: "rgb(var(--text-primary) / <alpha-value>)",
        textSecondary: "rgb(var(--text-secondary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        accentContrast: "rgb(var(--accent-contrast) / <alpha-value>)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.12)",
        glassLg: "0 16px 48px 0 rgba(0, 0, 0, 0.18)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%,100%": { opacity: "0.45" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "fade-in": "fade-in 400ms cubic-bezier(0.4,0,0.2,1) both",
        "pulse-soft": "pulse-soft 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        ".glass": {
          backgroundColor: "rgb(var(--glass-bg) / 0.18)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          border: "1px solid rgb(var(--glass-border) / 0.25)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.12)",
          borderRadius: "1rem",
        },
        ".glass-strong": {
          backgroundColor: "rgb(var(--glass-bg) / 0.28)",
          backdropFilter: "blur(18px) saturate(160%)",
          WebkitBackdropFilter: "blur(18px) saturate(160%)",
          border: "1px solid rgb(var(--glass-border) / 0.32)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.14)",
          borderRadius: "1rem",
        },
      });
    }),
  ],
};

export default config;
