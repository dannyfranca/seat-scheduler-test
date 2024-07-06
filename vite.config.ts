/// <reference types='vitest' />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  ssr: {
    target: 'node',
    noExternal: true,
  },
  build: {
    ssr: true,
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      input: 'src/index.ts',
    },
  },
  test: {
    globals: true,
    clearMocks: true,
    environment: 'node',
    coverage: {
      provider: 'istanbul',
    },
    include: ['src/**/*.{test,spec}.{js,mjs,ts,mts,jsx,tsx}'],
  },
});
