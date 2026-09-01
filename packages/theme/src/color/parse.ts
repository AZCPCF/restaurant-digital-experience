import { converter, parse } from "culori";

import type { ColorInput, OklchColor } from "./types";

const toOklch = converter("oklch");

export function parseColor(input: ColorInput): OklchColor {
  const parsed = parse(input);

  if (!parsed) {
    throw new Error(`Invalid color: "${input}"`);
  }

  const oklch = toOklch(parsed);

  if (!oklch) {
    throw new Error(`Unable to convert color to OKLCH: "${input}"`);
  }

  return {
    mode: "oklch",
    l: oklch.l,
    c: oklch.c,
    h: oklch.h,
    alpha: oklch.alpha,
  };
}
