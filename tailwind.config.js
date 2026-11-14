/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original Brand Colours:
        // Primary Burgundy: #952F2F
        // Secondary Warm Orange: #D9883F
        // Supporting Colours: White #FFFFFF, Soft Ivory #F8F5F2, Dark Text #222222
        burgundy: {
          DEFAULT: '#952F2F',
          dark: '#7A2222',
          light: '#AB3B3B',
          surface: '#FDF6F6',
          border: '#E8C4C4',
        },
        orange: {
          DEFAULT: '#D9883F',
          dark: '#BA6E29',
          light: '#E59C5A',
          surface: '#FDF8F3',
          border: '#F4D8BF',
        },
        ivory: {
          DEFAULT: '#F8F5F2',
          light: '#FCFAF8',
          dark: '#EFE9E2',
        },
        text: {
          primary: '#222222',
          secondary: '#555555',
          muted: '#777777',
        },

        // Mapped Aliases for complete backward & cross-component compatibility
        richblack: {
          DEFAULT: '#952F2F', // Primary Burgundy
          dark: '#7A2222',
          light: '#AB3B3B',
          surface: '#FDF6F6',
        },
        darksienna: {
          DEFAULT: '#952F2F', // Burgundy
          dark: '#7A2222',
          light: '#AB3B3B',
          surface: '#FDF6F6',
        },
        cultured: {
          DEFAULT: '#F8F5F2', // Soft Ivory
          light: '#FCFAF8',
          dark: '#EFE9E2',
        },
        grullo: {
          DEFAULT: '#D9883F', // Warm Orange
          dark: '#BA6E29',
          light: '#E59C5A',
          surface: '#FDF8F3',
        },
        umber: {
          DEFAULT: '#555555', // Secondary Dark Text
          dark: '#222222',
          light: '#777777',
          surface: '#F8F5F2',
        },
        emerald: {
          deep: '#952F2F',      // Burgundy
          forest: '#7A2222',
          light: '#AB3B3B',
          surface: '#FDF6F6',
        },
        gold: {
          antique: '#D9883F',   // Warm Orange
          champagne: '#E59C5A', // Warm Orange Light
          light: '#F8F5F2',     // Soft Ivory
          dark: '#BA6E29',      // Warm Orange Dark
        },
        amber: {
          warm: '#D9883F',      // Warm Orange
          dark: '#BA6E29',
          light: '#E59C5A',
          surface: '#FDF8F3',
        },
      },
      fontFamily: {
        heading: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        montserrat: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        malayalam: ['"Anek Malayalam"', '"Noto Sans Malayalam"', 'sans-serif'],
        anek: ['"Anek Malayalam"', '"Noto Sans Malayalam"', 'sans-serif'],
        manjari: ['"Anek Malayalam"', '"Noto Sans Malayalam"', 'sans-serif'],
      },
      boxShadow: {
        'burgundy': '0 4px 20px -2px rgba(149, 47, 47, 0.3)',
        'orange': '0 4px 20px -2px rgba(217, 136, 63, 0.3)',
        'card': '0 10px 30px -5px rgba(34, 34, 34, 0.06), 0 4px 6px -2px rgba(34, 34, 34, 0.03)',
      },
      backgroundImage: {
        'islamic-pattern': "radial-gradient(#D9883F 0.75px, transparent 0.75px), radial-gradient(#D9883F 0.75px, #952F2F 0.75px)",
      }
    },
  },
  plugins: [],
};
