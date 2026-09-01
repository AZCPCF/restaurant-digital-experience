export type ColorScaleStep =
  50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type ColorScale = Record<ColorScaleStep, string>;

export type ColorInput = string;

export type OklchColor = {
  mode: "oklch";
  l: number;
  c: number;
  h?: number;
  alpha?: number;
};
