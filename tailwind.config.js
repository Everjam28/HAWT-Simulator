/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        base: {
          950: "#0A0F16",
          900: "#0F1620",
          850: "#131C28",
          800: "#182233",
          700: "#212E42",
          600: "#2C3B54",
        },
        ink: {
          100: "#EFF3F8",
          300: "#B7C2D0",
          500: "#7E8CA0",
          700: "#4C5A70",
        },
        accent: {
          DEFAULT: "#3ED6C4",
          dim: "#1F7A70",
          soft: "#1B3A38",
        },
        warn: {
          DEFAULT: "#E8A93B",
          soft: "#3A2E16",
        },
        danger: {
          DEFAULT: "#E5555A",
          soft: "#3A1A1C",
        },
        ok: {
          DEFAULT: "#4CC77E",
          soft: "#173324",
        },
      },
      boxShadow: {
        panel: "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 24px -12px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};