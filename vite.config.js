import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
        // Redireciona qualquer chamada para /recursos/...
        '/recursos': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
        },

        '/auth': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
        },
        '/csv': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
        },
        
      }
    }
})

