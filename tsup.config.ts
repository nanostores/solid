import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  minify: false,
});
