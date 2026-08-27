export type RestaurantTheme = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    foreground: string;
    muted: string;
    border: string;
  };

  typography: {
    headingFont: string;
    bodyFont: string;
  };

  radius: {
    sm: string;
    md: string;
    lg: string;
  };

  layout: {
    contentWidth: string;
    spacingScale: number;
  };
};

export const defaultTheme: RestaurantTheme = {
  colors: {
    primary: "#111827",
    secondary: "#6b7280",
    background: "#ffffff",
    surface: "#f9fafb",
    foreground: "#111827",
    muted: "#6b7280",
    border: "#e5e7eb",
  },

  typography: {
    headingFont: "system-ui",
    bodyFont: "system-ui",
  },

  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
  },

  layout: {
    contentWidth: "1200px",
    spacingScale: 1,
  },
};
