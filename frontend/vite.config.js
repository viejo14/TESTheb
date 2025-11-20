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
      allowedHosts: 'all', // Permitir acceso desde cualquier tunnel (ngrok, cloudflare, localtunnel, etc)
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://192.168.100.40:3000', // IP local de tu PC
          changeOrigin: true,
          secure: false,
        }
      }
    },
    preview: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT) || 5173,
      strictPort: false
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['framer-motion', 'react-icons']
          }
        }
      }
    }
  }
})
