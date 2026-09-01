import type { Theme } from "../types/theme";
import type { ColorScale } from "../color/types";

function colorScaleToVariables(
  name: string,
  scale: ColorScale,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(scale).map(([step, value]) => [
      `--rde-color-${name}-${step}`,
      value,
    ]),
  );
}

export function themeToCssVariables(theme: Theme): Record<string, string> {
  const { colors, typography, spacing, radius, shadows } = theme.tokens;

  return {
    // Colors

    ...colorScaleToVariables("primary", colors.primary),

    ...colorScaleToVariables("secondary", colors.secondary),

    ...colorScaleToVariables("success", colors.success),

    ...colorScaleToVariables("warning", colors.warning),

    ...colorScaleToVariables("danger", colors.danger),

    "--rde-color-background": colors.background[500],

    "--rde-color-surface": colors.surface[500],

    "--rde-color-text": colors.text[500],

    // Typography

    "--rde-font-family": typography.fontFamily,

    "--rde-font-weight-heading": String(typography.heading.fontWeight),

    "--rde-font-weight-body": String(typography.body.fontWeight),

    "--rde-font-weight-caption": String(typography.caption.fontWeight),

    // Spacing

    "--rde-space-xs": spacing.xs,
    "--rde-space-sm": spacing.sm,
    "--rde-space-md": spacing.md,
    "--rde-space-lg": spacing.lg,
    "--rde-space-xl": spacing.xl,

    // Radius

    "--rde-radius-sm": radius.sm,
    "--rde-radius-md": radius.md,
    "--rde-radius-lg": radius.lg,
    "--rde-radius-full": radius.full,

    // Shadows

    "--rde-shadow-sm": shadows.sm,
    "--rde-shadow-md": shadows.md,
    "--rde-shadow-lg": shadows.lg,
  };
}
