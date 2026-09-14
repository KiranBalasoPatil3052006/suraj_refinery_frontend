/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#072427',
          850: '#0a2e32',
          800: '#0c3b3e', // Primary deep navy teal
          700: '#114f54',
          600: '#16646a',
          500: '#1d7e86',
          400: '#2b9ca6',
          300: '#5ab8c0',
          200: '#9cd7dc',
          100: '#d7f0f2',
          50: '#f0f9fa',
        },
        gold: {
          600: '#9d7c38',
          500: '#c5a059',
          400: '#d4b36d',
          300: '#e5cc96',
          100: '#f9f5ea',
        },
        surface: {
          base: '#f4f7f8',
          card: '#ffffff',
          input: '#f8fafb',
          border: '#e1e8ea',
          divider: '#eef2f3',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cinzel', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', 'sans-serif'],
      },
      boxShadow: {
        'soft-card': '0 4px 20px -2px rgba(12, 59, 62, 0.05), 0 2px 6px -1px rgba(12, 59, 62, 0.02)',
        'elevated': '0 10px 25px -4px rgba(12, 59, 62, 0.08), 0 6px 10px -3px rgba(12, 59, 62, 0.04)',
        'btn': '0 4px 14px 0 rgba(12, 59, 62, 0.25)',
      }
    },
  },
  plugins: [],
}
