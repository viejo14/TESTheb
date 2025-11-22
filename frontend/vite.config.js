import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // RAILWAY FIX: Forzar VITE_API_URL en producción si no está definido
  // Railway tiene problemas con .env.production, así que lo inyectamos aquí
  if (mode === 'production' && !env.VITE_API_URL) {
    env.VITE_API_URL = 'https://backend-production-fc49.up.railway.app/api'
  }

  return {
    plugins: [react()],
    define: {
      // Inyectar variables de entorno manualmente en el build
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || '/api'),
    },
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
      strictPort: false,
      allowedHosts: 'all' // Permitir acceso desde Railway y otros dominios
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
