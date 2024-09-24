/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx,vue,css}",
  ],
  theme: {
    extend: {
      colors: {
        "color-1": "#232323",
        "color-2": "#FE0000",
        "color-3": "#FFFFFF",
        "color-4": "#272727",
      }
    },
  },
  plugins: [],
}