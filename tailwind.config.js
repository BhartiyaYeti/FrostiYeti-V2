/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'bounce2': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
      },
      animation: {
        'bounce': 'bounce 0.5s infinite',
        'bounce2': 'bounce2 0.5s infinite',
      },
      colors: {
        "primary-blue": '#55C8ED'
      }
    },
  },
  plugins: [],
};
