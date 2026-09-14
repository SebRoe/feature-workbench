import { ocrMiddleware } from './server/api.ts'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
export default defineConfig({
  plugins: [react(), tailwindcss(), { name: 'workbench-local-api', configureServer(server) { server.middlewares.use(ocrMiddleware()) }, configurePreviewServer(server) { server.middlewares.use(ocrMiddleware()) } }],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
})
