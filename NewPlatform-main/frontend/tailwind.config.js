/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./client/**/*.{js,jsx,ts,tsx}",
    "./clinicianadmin/**/*.{js,jsx,ts,tsx}",
    "./clinician/**/*.{js,jsx,ts,tsx}",
    "./superadmin/**/*.{js,jsx,ts,tsx}",
    "./common/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
