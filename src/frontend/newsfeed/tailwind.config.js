module.exports = {
  purge: [
    './app/**/*.{js,ts,jsx,tsx}',
    './node_modules/@mui/material/**/*.d.ts',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {},
  prefix: 'tw-',
}