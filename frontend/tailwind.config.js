/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0b0e17',
        'bg-surface': '#121829',
        'bg-surface-light': '#1a2138',
        'bg-surface-hover': '#222b45',
        'primary': '#e50914',
        'primary-hover': '#b2070f',
        'primary-light': 'rgba(229,9,20,0.1)',
        'accent': '#d4a843',
        'cinema-text': '#f0f0f0',
        'text-secondary': '#8892a4',
        'text-muted': '#5a6478',
        'success': '#00c853',
        'error': '#ff3d3d',
        'warning': '#ff9800',
        'border-dark': '#1e2a45',
        'border-light': '#2a3655',
        'seat-free': '#1e6b4a',
        'seat-selected': '#4a90d9',
        'seat-vip': '#b8860b',
      },
      borderRadius: {
        'cinema': '8px',
        'cinema-lg': '12px',
        'cinema-xl': '16px',
      },
      boxShadow: {
        'cinema': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'cinema-lg': '0 8px 40px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
