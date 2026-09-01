import type { Theme } from "../types/theme";

export const defaultTheme: Theme = {
  id: "default",
  name: "Default",

  tokens: {
    colors: {
      primary: "#000000",
      secondary: "#666666",

      background: "#ffffff",
      surface: "#ffffff",

      text: "#111111",
      textMuted: "#666666",

      border: "#e5e5e5",

      success: "#16a34a",
      warning: "#ca8a04",
      danger: "#dc2626",
    },

    typography: {
      fontFamily: "sans-serif",

      heading: {
        fontWeight: 700,
      },

      body: {
        fontWeight: 400,
      },

      caption: {
        fontWeight: 400,
      },
    },

    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
    },

    radius: {
      sm: "6px",
      md: "10px",
      lg: "16px",
      full: "9999px",
    },

    shadows: {
      sm: "0 1px 2px rgb(0 0 0 / 0.05)",
      md: "0 4px 6px rgb(0 0 0 / 0.08)",
      lg: "0 10px 20px rgb(0 0 0 / 0.1)",
    },
  },
};
