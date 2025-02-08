const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand Primary Colors
        button: "#001630",
        "primary-green": "#24D680",
        "secondary-green": "#E8F8EE",
        "background-grey": "#F5F5F5",
        
        // Design System Greys
        grey: {
          1: "#FAFAFA",
          2: "#D6D7D9",
          3: "#B4B4B5",
          4: "#909091",
          5: "#68696B",
          6: "#414447",
          7: "#202326",
          8: "#0C0F12",
          9: "#040609",
          10: "#000000",
        },

        // Original Color System (kept for compatibility)
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
          500: "#2EE578",
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
          500: "#66656B",
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

      // Updated Typography System
      fontSize: {
        'title': ['32px', {
          lineHeight: '42px',
          letterSpacing: '-0.015em',
          fontWeight: '700',
          fontFamily: 'Ubuntu',
        }],
        'h1': ['20px', {
          lineHeight: '32px',
          letterSpacing: '-1px',
          fontWeight: '500',
          fontFamily: 'Ubuntu',
        }],
        'h2': ['18px', {
          lineHeight: '26px',
          letterSpacing: '-0.01em',
          fontWeight: '500',
          fontFamily: 'Ubuntu',
        }],
        'sub-header': ['16px', {
          lineHeight: '22px',
          letterSpacing: '0',
          fontWeight: '500',
          fontFamily: 'Ubuntu',
        }],
        'body1': ['16px', {
          lineHeight: '26px',
          letterSpacing: '0.015em',
          fontWeight: '400',
          fontFamily: 'SF Pro Display',
        }],
        'body2': ['14px', {
          lineHeight: '24px',
          letterSpacing: '0.015em',
          fontWeight: '400',
          fontFamily: 'SF Pro Display',
        }],
        'button': ['14px', {
          lineHeight: '20px',
          letterSpacing: '0.015em',
          fontWeight: '500',
          fontFamily: 'SF Pro Display',
        }],
      },

      // Font Families
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
        'sf-pro': ['SF Pro Display', 'sans-serif'],
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    
    // Responsive Breakpoints
    screens: {
      sm: {
        min: '320px',
        max: '768px'
      },
      md: {
        min: '769px',
        max: '1023px'
      },
      lg: {
        min: '1024px',
        max: '1279px'
      },
      xl: {
        min: '1280px',
        max: '1728px'
      },
      '2xl': {
        min: '1729px'
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".scrollbar-default": {
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