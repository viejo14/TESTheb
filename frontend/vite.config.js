import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Permite acceso desde la red local
      port: 5173,
      allowedHosts: ['nonoptional-rohan-undefaulting.ngrok-free.dev'], // Permitir acceso desde ngrok
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://192.168.100.40:3000', // IP local de tu PC
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
