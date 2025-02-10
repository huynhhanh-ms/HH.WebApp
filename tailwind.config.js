/** @type {import('tailwindcss').Config} */
// import medusaPreset from "@medusajs/ui-preset"
// import twAnimate from "tailwindcss-animate";
export default {
  mode: ['jit'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        times: ['"Noto Serif"', 'serif'],
      },
      // colors: {
      //   'blue': '#3366FF',
      // },
      zIndex: {
        inputDropdown: 5,
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        sm: '5px',
        md: '7px',
        lg: '12px',
        full: '50%',
      },
      height: {
        'header-sm': '6rem',
        'header-md': '7rem',
        'header-lg': '8rem',
      },
      backgroundColor: {
        hightlight: '#9DBEBB',
      },
    },
  },
  plugins: [],
  // presets: [medusaPreset],
};
