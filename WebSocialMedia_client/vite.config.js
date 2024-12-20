import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {}
  },
  server: {
    host: '0.0.0.0', // hoặc host: '0.0.0.0'
    port: 5173 // cổng mặc định
  }
})
