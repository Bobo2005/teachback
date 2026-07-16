
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        board: '#1E2A22',
        boardPanel: '#26332A',
        paper: '#FAF8F2',
        ink: '#232323',
        chalkYellow: '#E8C468',
        chalkCoral: '#E2887A',
        chalkBlue: '#7FA8C9',
        chalkWhite: '#F3F1E7',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        annotation: ['var(--font-annotation)', 'cursive'],
      },
    },
  },
  plugins: [],
};
export default config;