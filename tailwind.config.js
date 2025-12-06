/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0f',
        'dark-card': '#1a1a2e',
        'accent-blue': '#00d4ff',
        'accent-purple': '#a855f7',
        'accent-green': '#10b981',
        'accent-red': '#ef4444',
      },
    },
  },
  plugins: [],
}
