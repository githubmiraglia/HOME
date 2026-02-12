import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // IMPORTANT: must end with trailing slash
  base: '/family-gallery/',

  plugins: [react()],

  server: {
    host: true,          // Required for Docker
    port: 3000,          // Must match docker-compose.dev.yml

    // Needed when accessing via localhost or custom domain
    allowedHosts: [
      'localhost',
      'wrrm.lat',
      'www.wrrm.lat'
    ],

    // Ensures HMR works correctly behind reverse proxy
    hmr: {
      host: 'localhost',
      protocol: 'ws'
    }
  },

  // Optional but recommended for production consistency
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
