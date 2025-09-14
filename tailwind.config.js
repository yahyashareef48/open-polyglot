/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'link': 'var(--color-link)',
        'link-hover': 'var(--color-link-hover)',
        'hover-bg': 'var(--color-hover-bg)',
        'card-bg': 'var(--color-card-bg)',
      }
    },
  },
  plugins: [],
}