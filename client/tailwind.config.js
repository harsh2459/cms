/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef2f8',
          100: '#d5dff0',
          200: '#abbfe1',
          300: '#809fcf',
          400: '#557fbc',
          500: '#3A7BD5',
          600: '#2d5ea6',
          700: '#1B2A4A',
          800: '#162240',
          900: '#101935',
        },
        primary: '#1B2A4A',
        accent:  '#3A7BD5',
        success: '#1A7A4A',
        warning: '#B07D00',
        danger:  '#A02020',
        surface: '#F7F9FC',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['DM Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        card:  '8px',
        input: '4px',
      },
      boxShadow: {
        card:  '0 1px 3px rgba(27,42,74,0.08), 0 1px 8px rgba(27,42,74,0.04)',
        modal: '0 20px 60px rgba(27,42,74,0.18)',
      },
      spacing: {
        sidebar: '240px',
      },
    },
  },
  plugins: [],
}
