/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#111111',
        primary: '#8080ff',
      }
    },
  },
  plugins: [],
}