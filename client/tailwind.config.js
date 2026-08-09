/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          canvas: '#fafafa',
          surface: '#ffffff',
          subtle: '#f5f5f7',
          border: '#e5e5e7',
          'border-strong': '#d2d2d7',
          text: '#1d1d1f',
          secondary: '#6e6e73',
          muted: '#86868b',
          accent: '#000000',
        },
        brand: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#0f172a',
          600: '#020617',
          700: '#000000',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'apple-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'apple-card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.03)',
        'apple-modal': '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
