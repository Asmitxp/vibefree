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
        brand: {
          green: '#1db954',
          neon: '#1ed760',
          dark: '#121212',
          black: '#070707',
          elevated: '#181818',
          highlight: '#242424',
          subtext: '#b3b3b3',
          border: 'rgba(255, 255, 255, 0.08)'
        }
      },
      fontFamily: {
        sans: ['Circular', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(29, 185, 84, 0.4)',
        'glow-lg': '0 0 40px -5px rgba(30, 215, 96, 0.5)',
        'player': '0 -4px 20px rgba(0, 0, 0, 0.7)'
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 }
        },
        equalizer: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '16px' }
        }
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'equalizer-1': 'equalizer 0.8s ease-in-out infinite',
        'equalizer-2': 'equalizer 0.6s ease-in-out infinite 0.2s',
        'equalizer-3': 'equalizer 0.9s ease-in-out infinite 0.4s'
      }
    },
  },
  plugins: [],
}
