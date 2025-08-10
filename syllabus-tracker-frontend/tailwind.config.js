// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // Find this colors object and replace it
      colors: {
        primary: {
          DEFAULT: '#8B5CF6', // A nice violet color
          'hover': '#7C3AED',   // A darker violet for hover effects
          'light': '#A78BFA',   // A lighter shade for text links
        }
      }
    },
  },
  plugins: [],
}