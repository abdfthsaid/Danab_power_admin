// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ This is important
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
