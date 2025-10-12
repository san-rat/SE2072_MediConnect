/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mc: {
          primary: '#0D8FAC',      // Brand teal
          'primary-hover': '#075A6B', // Hover/active
          'primary-100': '#E6F7F6',  // Tints/bg chips
          ink: '#0B3B4F',           // Headings
          text: '#1F2937',          // Body text
          muted: '#64748B',         // Muted text
          border: '#D4DFE6',        // Strong borders
          surface: '#FFFFFF',       // Surface
          page: '#F8FAFC',          // Page background
          accent: '#F97360',        // Coral (sparingly)
          focus: '#99E0E9',         // Focus ring
        }
      },
      backgroundColor: {
        'mc-page': '#F8FAFC',
        'mc-surface': '#FFFFFF',
        'mc-primary-100': '#E6F7F6',
      },
      textColor: {
        'mc-ink': '#0B3B4F',
        'mc-text': '#1F2937',
        'mc-muted': '#64748B',
      },
      borderColor: {
        'mc-border': '#D4DFE6',
        'mc-focus': '#99E0E9',
      },
      boxShadow: {
        'mc-card': '0 8px 30px rgba(2, 44, 55, 0.06)',
        'mc-card-hover': '0 12px 40px rgba(2, 44, 55, 0.08)',
      }
    },
  },
}
