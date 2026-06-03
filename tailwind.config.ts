import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5bafc",
          400: "#8194f8",
          500: "#6370f1",
          600: "#4f4ee5",
          700: "#4340ca",
          800: "#3737a3",
          900: "#323381",
          950: "#1e1d4c",
        },
        surface: {
          DEFAULT: "#ffffff",
          secondary: "#f8f9fc",
          tertiary: "#f1f3f9",
        },
        dark: {
          DEFAULT: "#0a0a0f",
          secondary: "#111118",
          tertiary: "#1a1a24",
          border: "#2a2a38",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, #6370f1 0%, #8194f8 50%, #a5bafc 100%)",
        "gradient-dark": "linear-gradient(135deg, #1e1d4c 0%, #3737a3 100%)",
        "glass-light": "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)",
        "glass-dark": "linear-gradient(135deg, rgba(26,26,36,0.9) 0%, rgba(26,26,36,0.6) 100%)",
      },
      backdropBlur: {
        xs: "2px",
        "4xl": "72px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(99, 112, 241, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        brand: "0 4px 24px rgba(99, 112, 241, 0.4)",
        "brand-lg": "0 8px 40px rgba(99, 112, 241, 0.5)",
        soft: "0 2px 16px rgba(0, 0, 0, 0.08)",
        "soft-dark": "0 2px 16px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
