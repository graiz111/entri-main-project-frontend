/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/ui/**/*.{js,ts,jsx,tsx}" // Ensure it scans UI components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};


