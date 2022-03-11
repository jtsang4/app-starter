import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dynamicClient from '../../vite-plugins/vite-plugin-dynamic-client'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
    cors: true,
    origin: 'https://localhost:2026/',
  },
  plugins: [react()],
})
