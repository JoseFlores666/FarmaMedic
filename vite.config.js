import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

//para que funcione desplegado en vercel y no marque error npm run build debe estar en false
const useHttps = false; // true = https y false = http

export default defineConfig({
  plugins: [react()],
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
});
