/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm, food-forward palette (UKE-10). Named so components read as
        // intent ("bg-cream", "text-terracotta") rather than ad-hoc hex/utility
        // classes scattered through components.
        terracotta: {
          50: '#FBF1EC',
          100: '#F5DDD1',
          200: '#EABCA3',
          300: '#DE9A75',
          400: '#CD7A55',
          500: '#B85C3E', // primary accent
          600: '#A34B30',
          700: '#833C27',
          800: '#632D1D',
          900: '#431F14',
        },
        cream: {
          50: '#FFFDFB',
          100: '#FBF6EE',
          200: '#F7EFE4', // page background
          300: '#EFE1CC',
          400: '#E8D4BC', // imagery/placeholder background
          500: '#DFC5A3',
        },
        moss: {
          50: '#F3F6EA',
          100: '#DCE4C4', // dietary tag background
          200: '#C7D3A5',
          500: '#6B7D46',
          600: '#62743E',
          700: '#586A36',
          800: '#4A5A32', // dietary tag text
          900: '#37421F',
        },
        charcoal: {
          DEFAULT: '#3A2E27', // primary text — warm brown-black, not pure black
          muted: '#8A7A6B',   // secondary/meta text (day labels, prices, hints)
        },
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}