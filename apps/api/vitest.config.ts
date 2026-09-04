import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({
  path: '.env.test',
  override: true,
});
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
    env: {
      NODE_ENV: 'test',
    },
  },
});
