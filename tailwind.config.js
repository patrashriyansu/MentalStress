/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        medical: {
          blue: '#1e40af',
          teal: '#0d9488',
          green: '#16a34a',
          red: '#dc2626',
          orange: '#ea580c',
          purple: '#7c3aed',
        },
        dark: {
          900: '#0a0f1e',
          800: '#0d1529',
          700: '#111827',
          600: '#1f2937',
          500: '#374151',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'sos-ring': 'sos-ring 1s ease-out infinite',
        'wave': 'wave 1.2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #0ea5e9, 0 0 10px #0ea5e9' },
          '100%': { boxShadow: '0 0 10px #0ea5e9, 0 0 30px #0ea5e9, 0 0 60px #0ea5e9' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'sos-ring': {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(2.5)', opacity: 0 },
        },
        wave: {
          '0%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(2.5)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
