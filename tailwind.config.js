/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark
        card_dark: colors.gray,
        background_dark: colors.white,
        primary_dark: colors.gray,
        // Light
        background_light: colors.black,
        card_light: colors.gray,
        primary_light: colors.gray,
      },
    },
  },
  plugins: [],
};
