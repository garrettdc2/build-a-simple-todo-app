import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "mmx-bg": "#0f0f2d",
        "mmx-panel": "#1a1a3e",
        "mmx-cyan": "#00e5ff",
        "mmx-orange": "#ff6600",
        "mmx-white": "#ffffff",
        "mmx-dark": "#0a0a1e",
        "mmx-green": "#00ff66",
        "mmx-red": "#ff3333",
        "mmx-gray": "#3a3a5e",
      },
      fontFamily: {
        pixel: ["var(--font-press-start-2p)", "monospace"],
      },
      boxShadow: {
        "pixel-sm": "2px 2px 0px 0px rgba(0, 229, 255, 0.5)",
        "pixel-md":
          "3px 3px 0px 0px rgba(0, 229, 255, 0.5), inset 2px 2px 0px 0px rgba(255, 255, 255, 0.1)",
        "pixel-orange": "2px 2px 0px 0px rgba(255, 102, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
