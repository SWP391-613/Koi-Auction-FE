/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      width: {
        128: "32rem", // 512px
        144: "36rem", // 576px
        160: "40rem", // 640px
      },
      height: {
        128: "32rem", // 512px
        144: "36rem", // 576px
        160: "40rem", // 640px
      },
    },
  },
  plugins: [],
};
