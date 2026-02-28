import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VanillaGantt',
      formats: ['es', 'umd'],
      fileName: 'vanilla-gantt',
    },
  },
});
