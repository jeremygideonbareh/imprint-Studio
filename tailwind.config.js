/** @type {import('tailwindcss').Config} */
const display = ['"Bodoni Moda"', 'Georgia', 'serif'];

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sampled from Imprint's album layouts: oxblood mats, ivory paper, candlelit brass
        ivory: '#f4efe6',
        oxblood: '#430a10',
        clay: '#7d2f33',
        ink: '#140c0c',
        brass: '#c8a36a',
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'Helvetica', 'Arial', 'sans-serif'],
        display,
        poem: display,
      },
    },
  },
  plugins: [],
};
