/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Specified Premium Identity Palette:
        // Primary Burgundy: #952F2F
        // Golden Orange: #D9883F
        // Background: #FFFBF7
        // Soft Cream: #F8EFE7
        // Dark Text: #292323
        // Secondary Text: #756A65
        // White: #FFFFFF

        burgundy: {
          DEFAULT: '#952F2F',
          dark: '#7A2424',
          deep: '#952F2F',
          light: '#B03838',
          surface: '#FDF2F2',
          border: '#F2D3D3',
        },
        orange: {
          DEFAULT: '#D9883F',
          golden: '#D9883F',
          dark: '#BC6E2A',
          light: '#E6A05E',
          surface: '#FDF7F0',
          border: '#F5DECB',
        },
        cream: {
          DEFAULT: '#F8EFE7',
          soft: '#F8EFE7',
          dark: '#ECDCCF',
          light: '#FCF7F2',
        },
        bg: {
          DEFAULT: '#FFFBF7',
          soft: '#F8EFE7',
          pure: '#FFFFFF',
        },
        white: '#FFFFFF',
        text: {
          primary: '#292323',
          secondary: '#756A65',
          muted: '#9E948F',
        },

        // Backward-compatibility aliases mapped strictly to the new palette
        forest: {
          DEFAULT: '#952F2F',
          dark: '#7A2424',
          light: '#B03838',
          surface: '#FDF2F2',
          border: '#F2D3D3',
        },
        emerald: {
          DEFAULT: '#D9883F',
          dark: '#BC6E2A',
          light: '#E6A05E',
          surface: '#FDF7F0',
          border: '#F5DECB',
          deep: '#952F2F',
          forest: '#7A2424',
        },
        sage: {
          DEFAULT: '#F8EFE7',
          dark: '#ECDCCF',
          light: '#FCF7F2',
        },
        lightbg: {
          DEFAULT: '#FFFBF7',
          dark: '#F8EFE7',
        },
        ivory: {
          DEFAULT: '#FFFBF7',
          light: '#FFFFFF',
          dark: '#F8EFE7',
        },
        gold: {
          antique: '#D9883F',
          champagne: '#E6A05E',
          light: '#FDF7F0',
          dark: '#BC6E2A',
        },
        amber: {
          warm: '#D9883F',
          dark: '#BC6E2A',
          light: '#E6A05E',
          surface: '#FDF7F0',
        },
      },
      fontFamily: {
        // STRICT FONT PRESERVATION - EXACT FONTS KEPT
        heading: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        montserrat: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        malayalam: ['"Anek Malayalam"', '"Noto Sans Malayalam"', 'sans-serif'],
        anek: ['"Anek Malayalam"', '"Noto Sans Malayalam"', 'sans-serif'],
      },
      boxShadow: {
        'burgundy': '0 4px 20px -2px rgba(149, 47, 47, 0.25)',
        'orange': '0 4px 20px -2px rgba(217, 136, 63, 0.25)',
        'card': '0 10px 30px -5px rgba(41, 35, 35, 0.05), 0 4px 6px -2px rgba(41, 35, 35, 0.02)',
      },
      backgroundImage: {
        'islamic-pattern': "radial-gradient(#D9883F 0.75px, transparent 0.75px), radial-gradient(#D9883F 0.75px, #952F2F 0.75px)",
      }
    },
  },
  plugins: [],
};
