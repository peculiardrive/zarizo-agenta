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
        "brand-blue": "#3b82f6",
        "brand-blue-start": "#3b82f6",
        "brand-blue-end": "#8b5cf6",
        "snow": "#FCFCFD",
        "border": "#E5E7EB",
      },
      fontFamily: {
        "inter": ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        "geist": ["var(--font-inter)", "Inter", "sans-serif"],
        "syne": ["var(--font-syne)", "sans-serif"],
      },
      backgroundImage: {
        'grainy': "url('https://grainy-gradients.vercel.app/noise.svg')",
      },
      letterSpacing: {
        'tighter-extreme': "-0.05em",
      }
    },
  },
  plugins: [],
};

export default config;
