import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/viceroys/',
  server: {
    host: '0.0.0.0',
    port: 3008
  }
})
