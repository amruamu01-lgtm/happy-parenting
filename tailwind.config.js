/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Requested Premium Green Palette:
        // Deep Forest Green: #164B3C
        // Emerald Green: #2E7D5B
        // Soft Sage: #EAF3EE
        // Light Background: #F7FAF8
        // White: #FFFFFF
        // Dark Text: #1F2933
        forest: {
          DEFAULT: '#164B3C',
          dark: '#0F352B',
          light: '#1F614E',
          surface: '#EAF3EE',
          border: '#C7DFD3',
        },
        emerald: {
          DEFAULT: '#2E7D5B',
          dark: '#226146',
          light: '#3C9B72',
          surface: '#EAF3EE',
          border: '#C7DFD3',
          deep: '#164B3C',
          forest: '#0F352B',
        },
        sage: {
          DEFAULT: '#EAF3EE',
          dark: '#D5E5DC',
          light: '#F2F7F4',
        },
        lightbg: {
          DEFAULT: '#F7FAF8',
          dark: '#E8EFEA',
        },
        white: '#FFFFFF',
        text: {
          primary: '#1F2933',
          secondary: '#4B5563',
          muted: '#85909B',
        },

        // Backward compatibility mappings to ensure seamless rendering across all components
        burgundy: {
          DEFAULT: '#164B3C', // Deep Forest Green
          dark: '#0F352B',
          light: '#2E7D5B',
          surface: '#EAF3EE',
          border: '#C7DFD3',
        },
        orange: {
          DEFAULT: '#2E7D5B', // Emerald Green
          dark: '#226146',
          light: '#3C9B72',
          surface: '#EAF3EE',
          border: '#C7DFD3',
        },
        ivory: {
          DEFAULT: '#F7FAF8', // Light Background
          light: '#FFFFFF',
          dark: '#EAF3EE',
        },
        cultured: {
          DEFAULT: '#F7FAF8',
          light: '#FFFFFF',
          dark: '#EAF3EE',
        },
        richblack: {
          DEFAULT: '#164B3C',
          dark: '#0F352B',
          light: '#1F614E',
          surface: '#EAF3EE',
        },
        darksienna: {
          DEFAULT: '#164B3C',
          dark: '#0F352B',
          light: '#2E7D5B',
          surface: '#EAF3EE',
        },
        grullo: {
          DEFAULT: '#2E7D5B',
          dark: '#226146',
          light: '#3C9B72',
          surface: '#EAF3EE',
        },
        umber: {
          DEFAULT: '#4B5563',
          dark: '#1F2933',
          light: '#85909B',
          surface: '#EAF3EE',
        },
        gold: {
          antique: '#2E7D5B',
          champagne: '#3C9B72',
          light: '#EAF3EE',
          dark: '#226146',
        },
        amber: {
          warm: '#2E7D5B',
          dark: '#226146',
          light: '#3C9B72',
          surface: '#EAF3EE',
        },
      },
      fontFamily: {
        heading: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        montserrat: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        malayalam: ['"Anek Malayalam"', '"Noto Sans Malayalam"', 'sans-serif'],
        anek: ['"Anek Malayalam"', '"Noto Sans Malayalam"', 'sans-serif'],
      },
      boxShadow: {
        'forest': '0 4px 20px -2px rgba(22, 75, 60, 0.25)',
        'emerald': '0 4px 20px -2px rgba(46, 125, 91, 0.25)',
        'card': '0 10px 30px -5px rgba(31, 41, 51, 0.05), 0 4px 6px -2px rgba(31, 41, 51, 0.02)',
      },
      backgroundImage: {
        'islamic-pattern': "radial-gradient(#2E7D5B 0.75px, transparent 0.75px), radial-gradient(#2E7D5B 0.75px, #164B3C 0.75px)",
      }
    },
  },
  plugins: [],
};
