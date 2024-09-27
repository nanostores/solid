import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';

export default defineConfig({
  test: {
    environment: 'jsdom',
    deps: {
      inline: [/solid-js/],
    },
    setupFiles: ['./vitest.setup.ts'],
  },
  plugins: [solid()],
  resolve: {
    conditions: ['development', 'browser'],
  },
});
