import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111318",
        muted: "#69707d",
        line: "#e8e9ed",
        surface: "#f7f8fa",
        accent: "#2457e6",
        accentSoft: "#edf2ff"
      },
      boxShadow: {
        card: "0 16px 45px rgba(17,19,24,.07)",
        soft: "0 8px 28px rgba(17,19,24,.05)"
      },
      borderRadius: {
        "2xl": "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;