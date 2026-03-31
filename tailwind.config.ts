import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "megaman-navy": "#0A0A2E",
        "megaman-dark": "#04040F",
        "megaman-blue": "#00A8FF",
        "megaman-orange": "#FF6400",
        "megaman-purple": "#5A189A",
        "megaman-yellow": "#FFD700",
      },
      fontFamily: {
        pressStart: ["var(--font-press-start-2p)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
