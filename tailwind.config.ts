import type { Config } from 'tailwindcss';

// Preflight is disabled: this site's existing hand-rolled globals.css already
// supplies its own reset (see the `* { margin/padding/box-sizing }` rules) and
// full light/dark theme system. Tailwind's preflight would double-reset the
// same properties and risks subtly shifting spacing on ported markup, so
// utilities are available without Tailwind's base layer fighting the existing CSS.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
