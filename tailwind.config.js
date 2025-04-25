/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        theme: '#3B82F6 ',
        secondary: '#00FF00',
        tertiary: '#0000FF',
      },
    },
  },
  plugins: [],
}
