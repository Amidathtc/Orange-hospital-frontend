/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rust: { DEFAULT: '#B8452D', dark: '#8A3220' },
        forest: { DEFAULT: '#1F4D3D', light: '#2E6B54' },
        paper: { DEFAULT: '#F3E8D2', 2: '#EADFC5' },
        ink: { DEFAULT: '#221F19', soft: '#5A5548' },
        brass: '#B8923F',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
