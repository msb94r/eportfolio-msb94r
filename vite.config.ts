import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // On remet le moteur de style !

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Crucial pour le CSS
  ],
  server: {
    port: 3000,
    proxy: {
      // Le tunnel vers ton serveur server.js
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});