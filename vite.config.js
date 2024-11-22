// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve();  

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl', 'server.key')),  
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl', 'server.crt')), 
    },
    host: 'localhost',
    port: 5173,
  },
})
