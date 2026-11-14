/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          deep: '#123F32',
          forest: '#174B3B',
          light: '#1e5a47',
          surface: '#0d2d24',
        },
        gold: {
          antique: '#C6A45B',
          champagne: '#DCC58E',
          light: '#f5edd8',
          dark: '#a8853b',
        },
        burgundy: {
          deep: '#952F2F',
          dark: '#732323',
          light: '#b63d3d',
          surface: '#fbf0f0',
        },
        amber: {
          warm: '#D9883F',
          dark: '#b96e2b',
          light: '#e8a96d',
          surface: '#fdf6ee',
        },
        ivory: {
          DEFAULT: '#F7F3E9',
          light: '#FAF7F0',
          dark: '#EDE7D5',
        },
        text: {
          primary: '#183D32',
          secondary: '#77766D',
          muted: '#9a988d',
        }
      },
      fontFamily: {
        heading: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        montserrat: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        malayalam: ['"Manjari"', '"Noto Sans Malayalam"', 'system-ui', 'sans-serif'],
        manjari: ['"Manjari"', '"Noto Sans Malayalam"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 20px -2px rgba(198, 164, 91, 0.25)',
        'emerald': '0 8px 30px -4px rgba(18, 63, 50, 0.35)',
        'card': '0 10px 30px -5px rgba(24, 61, 50, 0.08), 0 4px 6px -2px rgba(24, 61, 50, 0.04)',
      },
      backgroundImage: {
        'islamic-pattern': "radial-gradient(#C6A45B 0.75px, transparent 0.75px), radial-gradient(#C6A45B 0.75px, #123F32 0.75px)",
      }
    },
  },
  plugins: [],
};
