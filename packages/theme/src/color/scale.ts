import { converter, formatCss, inGamut, parse } from "culori";

import type {
  ColorInput,
  ColorScale,
  ColorScaleStep,
  OklchColor,
} from "./types";

const toOklch = converter("oklch");

const STEPS: readonly ColorScaleStep[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
];

const LIGHTNESS_FACTORS: Record<ColorScaleStep, number> = {
  50: 1.45,
  100: 1.35,
  200: 1.25,
  300: 1.15,
  400: 1.07,
  500: 1,
  600: 0.9,
  700: 0.78,
  800: 0.65,
  900: 0.52,
  950: 0.42,
};

function getLightness(sourceLightness: number, step: ColorScaleStep): number {
  if (step === 500) {
    return sourceLightness;
  }

  return Math.min(1, Math.max(0, sourceLightness * LIGHTNESS_FACTORS[step]));
}

function isInSrgbGamut(color: OklchColor): boolean {
  const fn = inGamut("oklch");
  return fn(color);
}

function mapToSrgb(color: OklchColor): OklchColor {
  if (isInSrgbGamut(color)) {
    return color;
  }

  let low = 0;
  let high = color.c;
  let best = 0;

  for (let i = 0; i < 24; i++) {
    const chroma = (low + high) / 2;

    const candidate: OklchColor = {
      mode: "oklch",
      l: color.l,
      c: chroma,
      h: color.h,
    };

    if (isInSrgbGamut(candidate)) {
      best = chroma;
      low = chroma;
    } else {
      high = chroma;
    }
  }

  return {
    ...color,
    c: best,
  };
}

function generateStep(source: OklchColor, step: ColorScaleStep): string {
  const color: OklchColor = {
    mode: "oklch",
    l: getLightness(source.l, step),
    c: source.c,
    h: source.h,
  };

  const mapped = mapToSrgb(color);

  return formatCss(mapped);
}

export function generateColorScale(input: ColorInput): ColorScale {
  const parsed = parse(input);

  if (!parsed) {
    throw new Error(`Invalid color: "${input}"`);
  }

  const source = toOklch(parsed);

  if (!source) {
    throw new Error(`Unable to convert "${input}" to OKLCH.`);
  }

  const scale = {} as ColorScale;

  for (const step of STEPS) {
    if (step === 500) {
      scale[step] = formatCss(source);
      continue;
    }

    scale[step] = generateStep(source, step);
  }

  return scale;
}
