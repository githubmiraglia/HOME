import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,    // Expose to Docker host
    port: 3000     // Match docker-compose.dev.yml
  }
})