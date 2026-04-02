import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-black": "#0A0A0A",
        "ink": "#0A0A0A",
        "ink-2": "#1A1A1A",
        "gold": "#D4AF37",
        "gold-light": "rgba(212, 175, 55, 0.1)",
        "teal": "#008080",
        "teal-light": "rgba(0, 128, 128, 0.1)",
        "mist": "#F5F5F7",
        "snow": "#FCFCFD",
        "border": "#E5E7EB",
        "text-2": "#4B5563",
        "text-3": "#9CA3AF",
        "danger": "#EF4444",
      },
      fontFamily: {
        "inter": ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        "geist": ["var(--font-inter)", "Inter", "sans-serif"],
        "syne": ["var(--font-syne)", "sans-serif"],
      },
      boxShadow: {
        "soft": "0 8px 30px rgba(0,0,0,0.04)",
        "glow": "0 0 20px rgba(212, 175, 55, 0.2)",
        "glow-teal": "0 0 20px rgba(0, 128, 128, 0.2)",
      },
      backgroundImage: {
        'grainy': "url('https://grainy-gradients.vercel.app/noise.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
