import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = path.resolve();

const useHttps = false; // true = https y false = http

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },
      manifest: {
        name: 'FarmaMedic',
        short_name: 'FarmaMedic',
        description: 'Gestión de citas médicas',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/LogoFM.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/LogoFM.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/LogoFM.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  server: {
    ...(useHttps
      ? {
        https: {
          key: fs.readFileSync(path.resolve(__dirname, 'ssl', 'server.key')),
          cert: fs.readFileSync(path.resolve(__dirname, 'ssl', 'server.crt')),
        },
      }
      : {}),
    host: 'localhost',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
