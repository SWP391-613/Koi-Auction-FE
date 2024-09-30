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
        176: "44rem", // 704px
        192: "48rem", // 768px
      },
      height: {
        112: "28rem", // 448px
        128: "32rem", // 512px
        144: "36rem", // 576px
        160: "40rem", // 640px
        176: "44rem", // 704px
        192: "48rem", // 768px
        208: "52rem", // 832px
      },
    },
  },
  plugins: [],
};
