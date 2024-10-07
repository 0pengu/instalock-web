/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%",
      },
      colors: {
        "deep-red": {
          50: "#ffeaec",
          100: "#fdd4d6",
          200: "#f4a7ac",
          300: "#ec777e",
          400: "#e64f57",
          500: "#e3353f",
          600: "#e22732",
          700: "#c91a25",
          800: "#b31220",
          900: "#9e0419",
        },
      },
    },
  },
  plugins: [],
};
