/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1021",
        surface: "#F5F7FF",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#4F46E5",
          50: "#EEF0FF",
          100: "#E0E3FF",
          400: "#7C74F1",
          500: "#4F46E5",
          600: "#3F37C9",
          700: "#2F28A0",
        },
        accent: {
          DEFAULT: "#06B6D4",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
        },
        success: "#1FB88E",
        danger: "#F0625F",
        muted: "#6B7280",
        gold: {
          DEFAULT: "#F5B301",
          400: "#FBC531",
          500: "#F5B301",
          600: "#D89A00",
        },
        sidebar: {
          DEFAULT: "#120B2E",
          light: "#1B1244",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #EEF0FF 0%, #E0FBFF 100%)",
        "brand-radial": "radial-gradient(circle at 20% 20%, #4F46E5 0%, #0B1021 60%)",
      },
      boxShadow: {
        glow: "0 8px 30px rgba(79, 70, 229, 0.25)",
        card: "0 4px 24px rgba(11, 16, 33, 0.06)",
      },
      keyframes: {
        fillBubble: {
          "0%": { transform: "scale(0)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      animation: {
        fillBubble: "fillBubble 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
