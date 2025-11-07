import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';
import process from 'process';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const useHttps = env.VITE_USE_HTTPS === "true";

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.svg',
          'favicon.ico',
          'robots.txt',
          'apple-touch-icon.png',
        ],
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith('/api'),
              handler: 'NetworkFirst', 
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 5, 
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        manifest: {
          name: 'FarmaMedic',
          short_name: 'FarmaMedic',
          description: 'Gestión de citas médicas',
          theme_color: '#4f46e5',
          background_color: '#ffffff',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone'],
          start_url: '/',
          id: '/',
          scope: '/',
          screenshots: [
            {
              src: '/screen1280x960.png',
              sizes: '1280x960',
              type: 'image/png',
              form_factor: 'wide',
            },
            {
              src: '/screen1280x960.png',
              sizes: '1280x960',
              type: 'image/png',
              form_factor: 'narrow',
            },
          ],
          icons: [
            { purpose: 'any', sizes: '5000x5000', src: 'maskable_icon.png', type: 'image/png' },
            { purpose: 'any', sizes: '48x48', src: 'maskable_icon_x48.png', type: 'image/png' },
            { purpose: 'any', sizes: '72x72', src: 'maskable_icon_x72.png', type: 'image/png' },
            { purpose: 'any', sizes: '96x96', src: 'maskable_icon_x96.png', type: 'image/png' },
            { purpose: 'any', sizes: '128x128', src: 'maskable_icon_x128.png', type: 'image/png' },
            { purpose: 'any', sizes: '144x144', src: 'maskable_icon_x144.png', type: 'image/png' },
            { purpose: 'any', sizes: '192x192', src: 'maskable_icon_x192.png', type: 'image/png' },
            { purpose: 'any', sizes: '384x384', src: 'maskable_icon_x384.png', type: 'image/png' },
            { purpose: 'any', sizes: '512x512', src: 'maskable_icon_x512.png', type: 'image/png' },
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
    },
  };
});
