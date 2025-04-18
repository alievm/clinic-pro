/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      container: {
        center: true,
        padding: '.5rem',
      },
      fontFamily: {
        aeonik: ['Aeonik', 'sans-serif'],
      },
      fontSize: {
        'xxs':'11px',
      },
      lineHeight:{
        'tighter' : '1.1',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
      },
      letterSpacing: {
        'snug': '0.01em',
        'relaxed': '0.2em'
      },
      colors: {
        primary: {
          50:  '#fff5f5',
          100: '#ffe3e3',
          200: '#ffbdbd',
          300: '#ff9999',
          400: '#ff6666',
          500: '#ff2a2a',     // ближе к Ferrari Red
          600: '#e60000',     // насыщенный Rosso Corsa
          700: '#cc0000',
          800: '#990000',
          900: '#660000',
          950: '#3d0000',
        },
        yellow:{
          50: '#fef8e7',
          100: '#fef8e4',
          200: '#fcebb7',
          300: '#fbe59f',
          400: '#f8d76e',
          500: '#f6ca3e',
          600: '#f4bd0e',
          700: '#c3970b',
          800: '#927108',
          900: '#624c06',
          950: '#312603',
        },
        red:{
          50: '#fdeeed',
          100: '#fceceb',
          200: '#f8cbc8',
          300: '#f6bab5',
          400: '#f19891',
          500: '#ed756c',
          600: '#e85347',
          700: '#ba4239',
          800: '#8b322b',
          900: '#2e110e',
          950: '#2e110e',
        },
        slate:{
          50: '#f5f7fd',
          100: '#ecf2ff',
          200: '#dfe9fe',
          300: '#b6c6e3',
          400: '#8094ae',
          500: '#6e82a5',
          600: '#526484',
          700: '#364a63',
          800: '#203145',
          900: '#1c2b46',
          950: '#131f34',
        },
        gray: {
          50: '#f7fafc',
          100: '#ebeef2',
          200: '#e5e9f2',
          300: '#dbdfea',
          400: '#b7c2d0',
          500: '#8091a7',
          600: '#3c4d62',
          700: '#344357',
          800: '#2b3748',
          900: '#1f2b3a',
          950: '#040612',
          1000: '#0d141d',
        },
      },
      spacing: {
        '0.75': '0.1875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '17': '4.25rem',
        '18': '4.5rem',
        '19': '4.75rem',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
        '6': '6px',
        '7': '7px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss'),
  ],
}

