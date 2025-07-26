/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        olive: {
          50: "#f9faf5",
          100: "#f2f4e7",
          200: "#e3e8c6",
          300: "#d2dc9b",
          400: "#b5c25c",
          500: "#99a938",
          600: "#7a852b",
          700: "#5c631f",
          800: "#3f4313",
          900: "#23240a",
        },
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 0.9 },
          '50%': { opacity: 0.7 },
        },
      },
    },
  },
  plugins: [],
};