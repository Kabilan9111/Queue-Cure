/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B5CF0',
        secondary: '#7B61FF',
        accent: '#00D4FF',
        background: '#FAFBFF',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'premium': '0 20px 40px -15px rgba(91, 92, 240, 0.15)',
      }
    },
  },
  plugins: [],
}
