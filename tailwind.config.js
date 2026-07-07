/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0E14',
        surface: '#141822',
        surfaceRaised: '#1B2030',
        line: '#262C3D',
        text: '#EDEEF2',
        muted: '#8A8F9C',
        marquee: '#FFB13D',
        live: '#5EEAD4',
        danger: '#FF6B6B',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        marqueeScroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marqueeScroll 22s linear infinite',
      },
    },
  },
  plugins: [],
};
