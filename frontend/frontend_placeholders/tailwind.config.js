/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff4ed',
          100: '#ffe6d5',
          200: '#fecaa9',
          300: '#fda473',
          400: '#fb7539',
          500: '#f95311',
          600: '#ea3a07',  // primary brand orange
          700: '#c22a08',
          800: '#9a240f',
          900: '#7c2210',
        },
        surface: {
          bg:    '#fdf6f0',   // warm cream page background
          card:  '#ffffff',
          muted: '#f5ede4',
        },
        risk: {
          low:  '#22c55e',
          med:  '#f59e0b',
          high: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0,0,0,0.06), 0 4px 16px 0 rgba(0,0,0,0.04)',
        cardHover: '0 4px 24px 0 rgba(0,0,0,0.10)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
