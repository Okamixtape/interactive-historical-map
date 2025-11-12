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
          cream: '#f9ede0',
          bordeaux: '#a76032',
          sepia: '#d78d45',
        },
      },
    },
  },
  plugins: [],
};

export default config;
