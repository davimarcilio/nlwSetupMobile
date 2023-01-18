/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#09090a",
      },
      fontFamily: {
        regular: "Inter_400Regular",
        semibold: "Inter_600Semibold",
        bold: "Inter_600Bold",
        extrabold: "Inter_600ExtraBold",
      },
    },
  },
  plugins: [],
};
