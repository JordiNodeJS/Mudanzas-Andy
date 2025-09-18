/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  
  // Optimizaciones de CSS
  corePlugins: {
    preflight: false, // CSS reset manual más eficiente
  },
  
  // Tema optimizado con variables CSS
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)', 
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        highlight: 'rgb(var(--color-highlight) / <alpha-value>)',
        neutral: 'rgb(var(--color-neutral) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  
  // Optimizaciones de purge
  safelist: [
    'bg-primary', 'bg-secondary', 'bg-accent', 
    'text-primary', 'text-secondary', 'text-highlight',
    'translate-y-full', '-translate-y-full'
  ],
  
  plugins: [],
}