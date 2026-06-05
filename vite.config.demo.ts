import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/vanilla-gantt/',
  build: {
    outDir: 'dist-demo',
  },
});
