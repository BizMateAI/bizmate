module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./themes/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1f2937",
        secondary: "#2563eb",
        accent: "#f97316"
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"]
      }
    },
  },
  plugins: [],
}
