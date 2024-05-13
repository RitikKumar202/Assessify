/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary: "#DB007E",
        // secondary: "#FF63BD",
        dark: {
          hard: "#0D2436",
          soft: "#183856",
        },
      },
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
        Poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
