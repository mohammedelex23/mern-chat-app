/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.js", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        blue: {
          100: '#242F9B',
          101: '#646FD4',
          102: '#9BA3EB',
          103: "#efeff4"
        },
      },
      margin: {
        '50%': '50%',
        '20%': '20%'
      }
    },
  },
  plugins: [],
}
