import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'steel': {
          900: '#1A1A2E',  // Dark Steel
          800: '#3D3D5C',  // Graphite
        },
        'molten': {
          500: '#FF5E1A',  // Molten Orange
        },
        'cooling': {
          500: '#00C2D4',  // Cooling Blue
        },
        'warning': {
          500: '#FFD700',  // Warning Gold
        }
      },
      fontFamily: {
        sans: ['Industry', ...fontFamily.sans],
        mono: ['Roboto Mono', ...fontFamily.mono],
      },
      backgroundImage: {
        'metal-texture': 'linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05)), linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05))',
        'scanlines': 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px)',
      },
    },
  },
  plugins: [],
}