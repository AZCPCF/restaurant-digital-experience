import { deepMerge } from "@rde/types";
import type { Theme, ThemeOverrides } from "../types/theme";

export function resolveTheme(
  baseTheme: Theme,
  overrides?: ThemeOverrides,
): Theme {
  if (!overrides) {
    return baseTheme;
  }

  return {
    ...baseTheme,

    tokens: deepMerge(baseTheme.tokens, overrides),
  };
}
