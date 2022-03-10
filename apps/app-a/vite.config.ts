import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
    cors: true,
    origin: 'https://localhost:2026/',
  },
  plugins: [react()],
});
