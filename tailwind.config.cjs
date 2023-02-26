// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './node_modules/daisyui/dist/**/*.{js,css}',
    './node_modules/react-daisyui/dist/**/*.{js,css,cjs}',
  ],
  theme: {
    screens: {
      xs: '400px',
      ...defaultTheme.screens,
    },
    extend: {},
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  daisyui: {
    themes: [
      {
        dark: {
          primary: '#dca54c',
          primaryContent: '#c3c3c7',
          secondary: '#00aed6',
          accent: '#00c7b2',
          neutral: '#171618',
          'base-100': '#09090b',
          'base-200': '#171618',
          'base-300': '#2e2d2f',
          info: '#66c6ff',
          success: '#87d039',
          warning: '#e2d562',
          error: '#ff6f6f',
        },
      },
    ],
  },
}
