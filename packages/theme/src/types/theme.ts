import { DeepPartial } from "@rde/types";
import { ThemeColors } from "./colors";
import { ThemeRadius } from "./radius";
import { ThemeShadows } from "./shadows";
import { ThemeSpacing } from "./spacing";
import { ThemeTypography } from "./typography";

export interface Theme {
  id: string;
  name: string;

  tokens: ThemeTokens;
}

export interface ThemeTokens {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  shadows: ThemeShadows;
}

export type ThemeOverrides = DeepPartial<ThemeTokens>;
