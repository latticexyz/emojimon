/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        battle: "battle 2s linear 1",
      },
      keyframes: {
        battle: {
          "0%": {
            width: "200%",
            height: "200%",
            backgroundColor: "transparent",
          },
          "8%": {
            backgroundColor: "white",
          },
          "16%": {
            backgroundColor: "transparent",
          },
          "24%": {
            width: "200%",
            height: "200%",
            transform: "rotate(0deg)",
            backgroundColor: "white",
          },
          "32%": {
            backgroundColor: "transparent",
          },
          "100%": {
            width: 0,
            height: 0,
            transform: "rotate(360deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
