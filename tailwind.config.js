/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "480px", // Custom breakpoint for xs
      },
      fontFamily: {
        ubuntu: ['"Ubuntu"', "sans-serif"], // Replace with your font name
      },
    },
  },
  plugins: [],
};
