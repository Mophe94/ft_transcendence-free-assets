import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // Permet à Vite d'écouter sur le réseau du conteneur
    port: 5173,
    allowedHosts: [
      'free-assets.42belgium.com' // <-- Tu autorises ton domaine ici
    ]
  }
})
