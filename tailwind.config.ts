import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sepia: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f3dac1',
          300: '#eac295',
          400: '#e0a567',
          500: '#d78d45',
          600: '#c9763a',
          700: '#a76032',
          800: '#874e2e',
          900: '#6e4027',
        },
        heritage: {
          cream: '#f5f1e8',
          bordeaux: '#6e4027',
          sepia: '#d4a574',
          gold: '#b8860b',
          ink: '#2c2416',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        'vintage': '0 2px 8px rgba(110, 64, 39, 0.15), 0 0 0 1px rgba(110, 64, 39, 0.05)',
        'vintage-lg': '0 4px 12px rgba(110, 64, 39, 0.2), 0 0 0 1px rgba(110, 64, 39, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
