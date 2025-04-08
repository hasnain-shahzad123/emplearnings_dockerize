import type { Config } from "tailwindcss";

const config: Config = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        // Add a custom screen size greater than 1533px
        xxl: "1534px", // Custom screen for widths >= 1534px
        ultrawide: "1920px", // Custom screen for widths >= 1920px
        nxl: "1150px",
        xs: "500px",
        xss: "400px",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        Inter: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        "custom-right-bottom": "10px 10px 15px #4A148C",
        "even-xl": "0 0 20px rgba(0, 0, 0, 0.25)",
      },
      colors: {
        empoweredFlag: "#4A148C",
        empoweredFlagLight: "#e3e3fa",
      },
      transitionProperty: {
        "grid-rows": "grid-template-rows",
      },
    },
  },
};

export default config;
