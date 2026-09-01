import { deepMerge } from "@rde/types";
import { ThemeOverrides, ThemeTokens } from "../types";

export function mergeThemeTokens(
  base: ThemeTokens,
  overrides?: ThemeOverrides,
): ThemeTokens {
  if (!overrides) {
    return base;
  }

  return deepMerge(base, overrides);
}
