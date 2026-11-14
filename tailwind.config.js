/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Specified Exact Palette:
        // Rich Black – #0A0908
        // Dark Sienna – #49111C
        // Cultured – #F2F4F3
        // Grullo – #A9927D
        // Umber – #5E503F
        richblack: {
          DEFAULT: '#0A0908',
          dark: '#050404',
          light: '#181615',
          surface: '#11100F',
        },
        darksienna: {
          DEFAULT: '#49111C',
          dark: '#350B13',
          light: '#631827',
          surface: '#F8F1F2',
        },
        cultured: {
          DEFAULT: '#F2F4F3',
          light: '#FAFBFA',
          dark: '#E2E5E3',
        },
        grullo: {
          DEFAULT: '#A9927D',
          dark: '#8C7764',
          light: '#C7B7A7',
          surface: '#F5F1ED',
        },
        umber: {
          DEFAULT: '#5E503F',
          dark: '#473C2F',
          light: '#786852',
          surface: '#EAE6E1',
        },

        // Mapped Semantic aliases for seamless compatibility & luxury styling
        emerald: {
          deep: '#0A0908',      // Rich Black
          forest: '#181615',    // Rich Black Light
          light: '#282422',
          surface: '#050404',   // Ultra Rich Black
        },
        gold: {
          antique: '#A9927D',   // Grullo
          champagne: '#C7B7A7', // Grullo Light
          light: '#F2F4F3',     // Cultured
          dark: '#8C7764',      // Grullo Dark
        },
        burgundy: {
          deep: '#49111C',      // Dark Sienna
          dark: '#350B13',
          light: '#631827',
          surface: '#F8F1F2',   // Dark Sienna subtle tint
        },
        amber: {
          warm: '#5E503F',      // Umber
          dark: '#473C2F',
          light: '#786852',
          surface: '#EAE6E1',
        },
        ivory: {
          DEFAULT: '#F2F4F3',   // Cultured
          light: '#FAFBFA',
          dark: '#E2E5E3',
        },
        text: {
          primary: '#0A0908',   // Rich Black
          secondary: '#5E503F', // Umber
          muted: '#8C7764',     // Grullo Dark
        }
      },
      fontFamily: {
        heading: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        montserrat: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        malayalam: ['"Manjari"', '"Anek Malayalam"', '"Noto Sans Malayalam"', 'sans-serif'],
        manjari: ['"Manjari"', '"Anek Malayalam"', '"Noto Sans Malayalam"', 'sans-serif'],
      },
      boxShadow: {
        'grullo': '0 4px 20px -2px rgba(169, 146, 125, 0.25)',
        'sienna': '0 8px 30px -4px rgba(73, 17, 28, 0.35)',
        'black': '0 10px 30px -4px rgba(10, 9, 8, 0.45)',
        'card': '0 10px 30px -5px rgba(10, 9, 8, 0.06), 0 4px 6px -2px rgba(10, 9, 8, 0.03)',
      },
      backgroundImage: {
        'islamic-pattern': "radial-gradient(#A9927D 0.75px, transparent 0.75px), radial-gradient(#A9927D 0.75px, #0A0908 0.75px)",
      }
    },
  },
  plugins: [],
};
