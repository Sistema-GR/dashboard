import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { apiClient } from '@/service/apiService'

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
        '/recursos': {
            target: apiClient.defaults.baseURL,
            changeOrigin: true,
        },

        '/auth': {
            target: apiClient.defaults.baseURL,
            changeOrigin: true,
        },
        '/csv': {
            target: apiClient.defaults.baseURL,
            changeOrigin: true,
        },
        '/api/': {
            target: apiClient.defaults.baseURL,
            changeOrigin: true,
        },
        '/process': {
            target: apiClient.defaults.baseURL,
            changeOrigin: true,
        },
      }
    }
})


