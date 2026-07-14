/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color - soft indigo for a calm, professional feel
        brand: {
          50: '#eff6ff',
          100: '#dbe4ff',
          200: '#bac8ff',
          300: '#9aaeff',
          400: '#7c92ff',
          500: '#5e76ff', // Main brand color
          600: '#4c5ee6',
          700: '#3a47c1',
          800: '#2d3799',
          900: '#282e6a',
          950: '#1a1f4a',
        },
        // Neutral slate background and text
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Background color for the app
        background: '#FCFBFF', // Off-white for main background
        // Accent colors for variety (we can keep some for variety but use sparingly)
        accent: {
          blue: '#3b82f6',
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
        // We can keep Outfit for headings if desired, but let's use a clean sans-serif for everything
        // If we want to keep a touch of elegance for headings, we can use a different font for headings only.
        // Let's use Inter for body and maybe a serif for headings? But the requirement is minimal and easy to access.
        // We'll stick with Inter for all for simplicity and readability.
          heading: ['Georgia', 'serif'], // Optional: for headings if we want a touch of elegance
      },
    },
  },
  plugins: []
}