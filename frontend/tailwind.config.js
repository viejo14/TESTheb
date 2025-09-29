/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your existing dark theme colors
        'bg-primary': 'rgb(29, 29, 29)',
        'bg-secondary': 'rgb(39, 39, 39)',
        'bg-tertiary': 'rgb(49, 49, 49)',
        'bg-accent': 'rgb(59, 59, 59)',
        'text-primary': '#f8fafc',
        'text-secondary': '#e2e8f0',
        'text-muted': '#94a3b8',
        'border-color': '#334155',
        'border-light': '#475569',

        // Primary color palette
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slideIn 0.6s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'carousel-slide': 'carouselSlide 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideIn: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        carouselSlide: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        glow: {
          from: {
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.4), 0 8px 25px rgba(0, 0, 0, 0.3)'
          },
          to: {
            boxShadow: '0 0 35px rgba(251, 191, 36, 0.8), 0 0 70px rgba(251, 191, 36, 0.5), 0 8px 25px rgba(0, 0, 0, 0.3)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}