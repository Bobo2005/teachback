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
        board: "#1E2A22",
        boardPanel: "#26332A",
        paper: "#FAF8F2",
        ink: "#232323",
        chalkYellow: "#E8C468",
        chalkCoral: "#E2887A",
        chalkBlue: "#7FA8C9",
        chalkWhite: "#F3F1E7",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        annotation: ["var(--font-annotation)"],
      },
      backgroundImage: {
        "chalk-noise":
          "radial-gradient(circle at 20% 20%, rgba(243,241,231,0.03), transparent 40%), radial-gradient(circle at 80% 60%, rgba(243,241,231,0.025), transparent 45%)",
      },
    },
  },
  plugins: [],
};
export default config;