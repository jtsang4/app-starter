import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3002,
    cors: true,
    origin: 'https://localhost:2026',
  },
  plugins: [react()],
});
