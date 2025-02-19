/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx,vue,css}",
  ],
  theme: {
    extend: {
      colors: {
        "color-1": "black",
        "color-2": "#FE0000",
        "color-3": "#FFFFFF",
        "color-4": "#272727",
        "color-5": "#323232",
        "color-6": "#CECECE",
        "color-7": "#381818",
        "color-8": "#787878",
      }
    },
  },
  plugins: [],
}