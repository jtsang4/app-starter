import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.thml'),
        'app-a': resolve(__dirname, 'apps/app-a/index.thml'),
      }
    },
  },
  plugins: [react()],
})
