/** @type {import('tailwindcss').Config} */
export default {
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
        bgColor: '#F3F4F6',
        textColor: '#ffffff',
      },
    },
  },
  plugins: [],
}
