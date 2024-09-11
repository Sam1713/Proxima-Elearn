const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}"

  ],
  theme: {
    fontFamily: {
      protest: ['Protest Guerrilla', 'sans-serif'],
      roboto: ['Roboto', 'sans-serif'],
      open: ['Open Sans', 'sans-serif'],
      dmsans: ['DM Sans', 'sans-serif'],
      poppins: ['Poppins', 'sans-serif'],
    },
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
    // Add any additional plugins you need here
  ],
});
