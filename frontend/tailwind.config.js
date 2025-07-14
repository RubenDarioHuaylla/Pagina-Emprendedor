/** @type {import('tailwindcss').Config} */
export default  {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          600: '#0284c7', // Color principal
          700: '#0369a1',},
        secondary: '#10B981', // Verde Emerald
        danger: '#EF4444',    // Rojo 
        dark: '#1F2937',      // Gris oscuro
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Fuente Inter
        serif: ['Merriweather', 'serif'], // Fuente Merriweather
      },
    },
  },
  plugins: [],
}