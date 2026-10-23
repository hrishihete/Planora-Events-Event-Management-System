/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        planora: {
          rose: "#e11d48",
          roseDark: "#be123c",
          plum: "#6b2148",
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
        script: ['"Great Vibes"', "cursive"],
      },
    },
  },
  plugins: [],
};
