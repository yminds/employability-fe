const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        greens: {
          100: "#DBFFEA",
          200: "#AEFDCE",
          300: "#7DFDB1",
          400: "#5AFA9A",
          500: "#2EE578",
          600: "#1FD167",
          700: "#10B754",
          800: "#03963F",
          900: "#003D19",
        },
        greys: {
          100: "#F6F5FA",
          200: "#D7D6D9",
          300: "#B4B4B5",
          400: "#8E8E91",
          500: "#66656B",
          600: "#3E3D47",
          700: "#1D1C26",
          800: "#0B0A12",
          900: "#003D19",
        },
        primary: {
          DEFAULT: "#2EE578",
          50: "#DBFFEA",
          100: "#AEFDCE",
          200: "#7DFDB1",
          300: "#5AFA9A",
          400: "#2EE578",
          500: "#2EE578", // Your main primary color
          600: "#1FD167",
          700: "#10B754",
          800: "#03963F",
          900: "#003D19",
        },
        secondary: {
          DEFAULT: "#66656B",
          50: "#F6F5FA",
          100: "#D7D6D9",
          200: "#B4B4B5",
          300: "#8E8E91",
          400: "#66656B",
          500: "#66656B", // Your main secondary color
          600: "#3E3D47",
          700: "#1D1C26",
          800: "#0B0A12",
          900: "#003D19",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
        'sf-pro': ['SF Pro Display', 'sans-serif'],
      },
      
    },
    screens: {
      sm : {
        min: '320px',
        max: '768px'
      },
      md : {
        min: '769px',
        max: '1023px'
      },
      lg : {
        min: '1024px',
        max: '1279px'
      },
      xl : {
        min: '1280px',
        max: '1728px'
      },
      '2xl' : {
        min: '1729px'
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* Hide the scrollbar */
          "-ms-overflow-style": "none", /* IE and Edge */
          "scrollbar-width": "none", /* Firefox */
          "&::-webkit-scrollbar": {
            display: "none", /* Chrome, Safari, and Opera */
          },
        },
        ".scrollbar-default": {
          /* Restore default scrollbar */
          "-ms-overflow-style": "auto",
          "scrollbar-width": "auto",
          "&::-webkit-scrollbar": {
            display: "block",
          },
        },
      });
    }),
  ],
};
