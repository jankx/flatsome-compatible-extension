import tailwindcss from '@tailwindcss/vite';
import solid from 'vite-plugin-solid';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [solid(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'assets/dist',
      emptyOutDir: true,
      manifest: true,
      rollupOptions: {
        input: path.resolve(__dirname, 'src/main.tsx'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
