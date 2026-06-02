import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f4efe6",
        surface: "#fbf7f1",
        ink: "#171410",
        muted: "#6d655d",
        line: "rgba(23, 20, 16, 0.12)",
        sky: "#6b98b5",
        clay: "#c8857b",
        honey: "#d2926f",
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Satoshi"', "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 20, 16, 0.08)",
        glow: "0 0 0 1px rgba(23, 20, 16, 0.08), 0 24px 80px rgba(107, 152, 181, 0.12)",
      },
      borderRadius: {
        xl2: "1.5rem",
        xl3: "2rem",
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(23,20,16,0.08) 1px, transparent 0)",
        hero: "radial-gradient(circle at 20% 20%, rgba(107,152,181,0.16), transparent 32%), radial-gradient(circle at 80% 10%, rgba(200,133,123,0.18), transparent 28%), radial-gradient(circle at 50% 90%, rgba(210,146,111,0.14), transparent 26%)",
      },
    },
  },
  plugins: [],
};

export default config;
