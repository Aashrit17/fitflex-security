import tailwindcss from '@tailwindcss/vite' // ✅ left as is
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../certs/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../certs/server.crt')),
    },
    port: 5173,
    strictPort: true,
    cors: {
      origin: 'https://localhost:3001', // ✅ backend should match protocol (https)
      credentials: true,
    },
  },
})
