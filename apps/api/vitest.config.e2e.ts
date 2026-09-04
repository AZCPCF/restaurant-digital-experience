import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({
  path: '.env.test',
  override: true,
});

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    env: {
      NODE_ENV: 'test',
    },
  },
});
