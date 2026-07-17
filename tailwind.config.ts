import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAF8",
        surface: "#FFFFFF",
        surfaceMuted: "#F4F3EE",
        border: "#E6E4DC",
        ink: "#14171B",
        inkMuted: "#5B5F66",
        inkFaint: "#9498A0",
        brand: "#0E7C6B",
        brandDark: "#0A5C4F",
        brandSoft: "#E4F3EF",
        redpen: "#D64545",
        redpenSoft: "#FBE9E7",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;