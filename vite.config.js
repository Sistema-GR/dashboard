import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const BASE_URL = process.env.VITE_APP_BASE_URL || 'http://10.203.2.141:8000';

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
            target: BASE_URL,
            changeOrigin: true,
        },

        '/auth': {
            target: BASE_URL,
            changeOrigin: true,
        },
        '/csv': {
            target: BASE_URL,
            changeOrigin: true,
        },
        '/api/': {
            target: BASE_URL,

            changeOrigin: true,
        }
      }
    }
})


