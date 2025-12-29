/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#d1fae5",
          DEFAULT: "#047857",
          dark: "#065f46",
        },
        accent: {
          teal: "#0f766e",
          sky: "#0284c7",
        },
        surface: {
          DEFAULT: "#f9fafb",
          muted: "#e5f3f0",
        },
        body: "#0f172a",
        hairline: "#e5e7eb",
      },
    },
  },
  plugins: [],
};
