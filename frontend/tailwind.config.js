/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0b1929',
        surface: '#0f2035',
        card:    '#132840',
        navy: {
          950: '#001D39',
          900: '#0A4174',
          700: '#49769F',
          500: '#4E8EA2',
          400: '#6EA2B3',
          300: '#7BBDE8',
          100: '#BDD8E9',
          50:  '#ddeef8',
        },
      },
      fontFamily: {
        sans:    ['Inter','system-ui','sans-serif'],
        display: ['Sora','Inter','sans-serif'],
      },
      boxShadow: {
        card:   '0 2px 16px rgba(0,0,0,0.3)',
        glow:   '0 0 0 1px rgba(123,189,232,0.12), 0 8px 32px rgba(10,65,116,0.4)',
        'glow-sm': '0 0 20px rgba(123,189,232,0.07)',
        inner:  'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
    },
  },
  plugins: [],
};
