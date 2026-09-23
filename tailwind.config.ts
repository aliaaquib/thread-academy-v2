import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#ffffff",
        surface: "#f7f7f5",
        surface2: "#fbfbfa",
        ink: "#1a1a1a",
        muted: "#5f5f5c",
        faint: "#8a8a86",
        line: "#e9e9e4",
        linestrong: "#dcdcd4",
        accent: "#a3c614",
        accentdark: "#7c9a0c",
        accentink: "#4c6106",
        accentsoft: "#f3f8dc",
        codebg: "#161616",
      },
      borderRadius: {
        DEFAULT: "14px",
        lg: "22px",
      },
      maxWidth: {
        container: "1180px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: ["Georgia", "Times New Roman", "serif"],
        mono: ["SF Mono", "ui-monospace", "Menlo", "Consolas", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
