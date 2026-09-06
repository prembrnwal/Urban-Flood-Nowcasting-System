/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'flood-safe':     '#22c55e',
        'flood-low':      '#eab308',
        'flood-moderate': '#f97316',
        'flood-high':     '#ef4444',
        'flood-critical': '#7c3aed',
        'panel-bg':       '#0f172a',
        'panel-border':   '#1e3a5f',
        'panel-header':   '#0d2137',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
