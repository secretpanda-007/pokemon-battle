/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JS/JSX files in src for Tailwind classes
  ],
  theme: {
    extend: {
      // Custom animations for fade-in and other effects
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'pulse': 'pulse 1s infinite',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      // Custom colors inspired by Pokémon theme
      colors: {
        'poke-blue': '#3b82f6', // A vibrant Pokémon blue
        'poke-red': '#ef4444',   // Classic Pokémon red
        'poke-yellow': '#facc15', // Pikachu yellow
        'poke-green': '#22c55e', // Forest green for Grass types
        'poke-purple': '#a855f7', // Psychic purple
      },
      // Custom font sizes and shadows for better typography
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
