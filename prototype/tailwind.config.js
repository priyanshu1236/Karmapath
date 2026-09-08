/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#fff8f0",
        "surface-dim": "#dfd9d1",
        "surface-bright": "#fff8f1",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#fbf3e4",
        "surface-container": "#f5eddf",
        "surface-container-high": "#efe7d9",
        "surface-container-highest": "#eae2d4",
        "surface-variant": "#e8e1da",
        "background": "#fff8f0",
        "on-background": "#1f2421",
        "on-surface": "#1f2421",
        "on-surface-variant": "#5f5e59",
        "outline": "#747874",
        "outline-variant": "#c4c7c3",
        "primary": "#1f2421",
        "primary-container": "#2b322e",
        "on-primary": "#ffffff",
        "on-primary-container": "#c3c8c3",
        "secondary": "#5f5e59",
        "secondary-container": "#e2dfd9",
        "on-secondary": "#ffffff",
        "teal-brand": "#176B67",
        "teal-brand-container": "#e2f2f1",
        "teal-brand-dark": "#0e4542",
        "terracotta": "#C86B45",
        "terracotta-container": "#fbeae2",
        "terracotta-dark": "#913c19",
        "saffron": "#D99A2B",
        "saffron-container": "#fdf5e2",
        "saffron-dark": "#8f6211",
        "plum": "#66445C",
        "plum-container": "#f5edf3",
        "plum-dark": "#43263c"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        "body-lg": ["Manrope", "sans-serif"],
        "display-lg": ["DM Serif Display", "serif"],
        "headline-lg": ["DM Serif Display", "serif"],
        "display-md": ["DM Serif Display", "serif"],
        "headline-md": ["DM Serif Display", "serif"],
        "body-md": ["Manrope", "sans-serif"],
        "label-md": ["Manrope", "sans-serif"],
        "label-sm": ["Manrope", "sans-serif"],
        "mono-data": ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      }
    },
  },
  plugins: [],
}

