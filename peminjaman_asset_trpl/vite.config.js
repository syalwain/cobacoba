import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy dipakai saat development supaya tidak terkena masalah CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.melangkah.my.id',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
