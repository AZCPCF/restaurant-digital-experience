import { useMemo, useState, type CSSProperties } from "react";

import {
  defaultTheme,
  generateColorScale,
  resolveTheme,
  type ColorScaleStep,
} from "@rde/theme";

const steps: ColorScaleStep[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
];

export default function ThemePlaygroundPage() {
  const [color, setColor] = useState("#abcdef");

  const scale = useMemo(() => {
    try {
      return generateColorScale(color);
    } catch {
      return null;
    }
  }, [color]);

  const theme = useMemo(() => {
    if (!scale) {
      return resolveTheme(defaultTheme);
    }

    return resolveTheme(defaultTheme, {
      colors: {
        primary: scale,
      },
    });
  }, [scale]);

  return (
    <main
      className="min-h-screen bg-primary-500 p-8 text-text"
      style={theme as CSSProperties}
    >
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold">Theme Playground</h1>

        <p className="mb-8 text-text/60">
          Test RDE color scale generation using OKLCH.
        </p>

        {/* Color Input */}
        <section className="mb-8 rounded-xl bg-surface p-6">
          <label className="mb-2 block text-sm font-medium">Base Color</label>

          <div className="flex gap-3">
            <input
              type="text"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="#4DC488"
            />

            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(color) ? color : "#4DC488"}
              onChange={(event) => setColor(event.target.value)}
              className="h-12 w-16 cursor-pointer rounded-lg"
            />
          </div>

          {!scale && <p className="mt-3 text-sm text-danger">Invalid color</p>}
        </section>

        {/* Color Scale */}
        {scale && (
          <section className="rounded-xl bg-surface p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Primary Color Scale</h2>

              <p className="mt-1 text-sm text-text-muted">
                Generated from OKLCH.
              </p>
            </div>

            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step}
                  className="grid grid-cols-[60px_1fr_180px] items-center gap-4"
                >
                  <span className="text-sm font-medium">{step}</span>

                  <div
                    className="h-14 rounded-lg border border-border"
                    style={{
                      backgroundColor: scale[step],
                    }}
                  />

                  <code className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-text-muted">
                    {scale[step]}
                  </code>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Theme Preview */}
        {scale && (
          <section className="mt-8 rounded-xl bg-surface p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Theme Preview</h2>

              <p className="mt-1 text-sm text-text-muted">
                These components use the resolved theme.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="rounded-lg bg-primary-500 px-5 py-3 font-medium text-white transition hover:bg-primary-600">
                Primary
              </button>

              <button className="rounded-lg bg-primary-100 px-5 py-3 font-medium text-primary-800 transition hover:bg-primary-200">
                Light
              </button>

              <button className="rounded-lg bg-primary-700 px-5 py-3 font-medium text-white transition hover:bg-primary-800">
                Dark
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
