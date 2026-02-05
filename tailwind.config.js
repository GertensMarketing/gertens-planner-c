/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gertens-blue': '#1e40af',
        'gertens-light-blue': '#3b82f6',
        'blueprint-bg': '#f0f4f8',
      },
    },
  },
  plugins: [],
}
