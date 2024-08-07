// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(135deg, #000000, #1a1a1a, #333333, #4d4d4d)',
      },
      colors: {
        'custom-blue': '#00cbf9',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ping: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-in-out forwards',
        slideUp: 'slideUp 2.8s ease-in-out forwards',
        'custom-ping': 'ping 1s linear infinite',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({
      // You can configure the scrollbar styles here if needed
      nocompatible: true,
    }),
  ],
}
