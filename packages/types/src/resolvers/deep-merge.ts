import { DeepPartial } from "./deep-partial";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T extends object>(
  base: T,
  overrides: DeepPartial<T>,
): T {
  const result = {
    ...base,
  };

  for (const key of Object.keys(overrides) as Array<keyof T>) {
    const overrideValue = overrides[key];

    if (overrideValue === undefined) {
      continue;
    }

    const baseValue = result[key];

    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(
        baseValue,
        overrideValue as DeepPartial<T[keyof T] & Record<string, unknown>>,
      );

      continue;
    }

    result[key] = overrideValue as T[typeof key];
  }

  return result;
}
