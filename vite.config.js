import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    watch: {
      ignored: [
        '**/.env',
        '**/.env.*',
        '**/vite.config.js',
        '**/node_modules/**',
      ],
    },
  },
});
