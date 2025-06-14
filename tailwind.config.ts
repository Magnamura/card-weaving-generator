/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  // Add this:
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
}