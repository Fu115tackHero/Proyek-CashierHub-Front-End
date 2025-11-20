/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a509a',
        secondary: '#4a77f4',
        success: '#5cb338',
        danger: '#d84040',
        warning: '#ece852',
      },
    },
  },
  plugins: [],
}
