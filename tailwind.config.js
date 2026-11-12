/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1F3A',
          700: '#12315C',
          600: '#1B4380',
          100: '#E3EAF4',
        },
        gray: {
          50: '#F6F8FA',
          100: '#EEF1F5',
          200: '#DDE2E9',
          500: '#6B7685',
          800: '#1F2937',
        },
        danger: {
          600: '#C0392B',
        },
        success: {
          600: '#1E7F4F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Tinos', '"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        'card': '0 1px 2px rgba(11, 31, 58, 0.06)',
        'paper': '0 8px 24px rgba(11, 31, 58, 0.12)',
        'paper-lg': '0 12px 32px rgba(11, 31, 58, 0.16)',
      },
    },
  },
  plugins: [],
}
