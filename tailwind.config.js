/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        meditative: ["Meditative", "sans-serif"],
        sfpro: ["Sfpro", "sans-serif"],
        suntage: ["Suntage", "sans-serif"],
      },
      colors: {
        primaryColor: "#531D99",
        secondaryColor: "#8B30FF",
        threeColor: "#2A2A2A",
        btnColor: "#9868D7",
      },
    },
  },
  plugins: [],
};
