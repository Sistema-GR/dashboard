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
 // ADICIONE ESTE BLOCO DE CÓDIGO
  server: {
    proxy: {
      // Qualquer requisição que comece com /api
      '/api': {
        // será redirecionada para o seu servidor Django
        target: 'http://localhost:8000',
        // Necessário para que o servidor de destino não recuse a requisição
        changeOrigin: true,
      },
    }
  }
})
