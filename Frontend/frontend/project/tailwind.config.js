/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(260 100% 4%)',
        foreground: 'hsl(210 40% 98%)',
        primary: {
          DEFAULT: '#9372FF',
          light: '#D4B4FF',
        },
        muted: {
          DEFAULT: 'hsl(217.2 32.6% 17.5%)',
          foreground: 'hsl(215 20.2% 65.1%)',
        },
        border: 'hsl(217.2 32.6% 17.5%)',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(to right, #D4B4FF, #9372FF)',
      },
      animation: {
        'float-slow': 'float 22s ease-in-out infinite',
        'float-medium': 'float 28s ease-in-out infinite',
        'float-fast': 'float 35s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-30px) translateX(20px)' },
          '50%': { transform: 'translateY(-60px) translateX(-20px)' },
          '75%': { transform: 'translateY(-30px) translateX(30px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      screens: {
        '2xl': '1400px',
      },
    },
  },
  plugins: [],
};
