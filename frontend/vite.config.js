import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',
  server: {
  port: 5002, 
  proxy: {
    // Прокси для REST API
    '/api': {
      target: 'http://localhost:5001',  
    },
    // Прокси для WebSocket (чат)
    '/socket.io': {
      target: 'ws://localhost:5001',   
      ws: true,                     
      rewriteWsOrigin: true,           
    },
  },
  }
})
