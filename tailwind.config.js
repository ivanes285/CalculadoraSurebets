
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: 'class', // <- importante para que toggle funcione
  theme: {
    extend: {},
  },
  safelist: [
    'dark:text-gray-300',
    'dark:text-yellow-400',
    'dark:text-blue-400',
    'dark:text-green-400',
    'dark:text-white',
    'dark:bg-gray-700',
    'dark:bg-gray-700/50',
    'dark:bg-gray-900',
    'dark:border-gray-600',
    'dark:border-gray-700',
    'dark:hover:bg-gray-700',
    'dark:focus:ring-offset-gray-800'
  ],
  plugins: [],
}
