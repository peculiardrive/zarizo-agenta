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
        ink: "#0A0F1E",
        "ink-2": "#1C2340",
        gold: "#F5A623",
        "gold-2": "#FFBE4A",
        "gold-light": "#FFF4DC",
        teal: "#0CC6A4",
        "teal-2": "#09A889",
        "teal-light": "#E0FAF5",
        danger: "#F24E3F",
        snow: "#F8F9FC",
        mist: "#EFF1F7",
        border: "#E4E8F0",
        text: "#3D4461",
        "text-2": "#6B728E",
        "text-3": "#9BA3BF",
      },
      fontFamily: {
        syne: ["var(--font-syne)"],
        "dm-sans": ["var(--font-dm-sans)"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        glow: "0 0 15px rgba(245, 166, 35, 0.3)",
        "glow-teal": "0 0 15px rgba(12, 198, 164, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
