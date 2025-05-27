import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    fs: {
      // Allow serving files from one level up from the package root
      allow: ['..'],
    },
    proxy: {
      // For local Netlify development using netlify dev
      '/.netlify': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
      },
      // Simple redirect for the savePayment endpoint
      '/api/savePayment': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => '/.netlify/functions/savePayment',
      },
      // For any other API requests
      '/api/': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\//, '/.netlify/functions/'),
      },
    },
  },
});
