# 🧵 TESTheb Frontend

Frontend de la aplicación TESTheb - Plataforma de Bordados Personalizados.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:
- **Local:** http://localhost:5173
- **Network:** http://[tu-ip-local]:5173 (para testing en móvil)

### Build para Producción

```bash
npm run build
npm run preview  # Preview del build
```

---

## 🔧 Configuración

### Variables de Entorno

El proyecto usa diferentes archivos `.env` según el entorno:

#### `.env.development` (Auto-cargado en desarrollo)
```env
VITE_BACKEND_URL=http://192.168.100.40:3000
VITE_API_URL=/api
```

#### `.env.production` (Crear para producción)
```env
VITE_API_URL=https://tu-backend-produccion.com/api
```

**Ver `.env.production.example` para más detalles.**

---

## 📁 Estructura

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/          # Páginas de la aplicación
│   ├── context/        # Context API (Auth, Cart, etc.)
│   ├── services/       # Servicios API
│   ├── config/         # Configuración (api.js)
│   └── App.jsx         # Componente principal
├── public/             # Archivos estáticos
├── .env.development    # Variables de desarrollo
├── .env.production.example  # Ejemplo para producción
└── vite.config.js      # Configuración de Vite
```

---

## 🌐 Proxy de Desarrollo

En desarrollo, Vite hace proxy de `/api/*` al backend:

```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://192.168.100.40:3000',
    changeOrigin: true,
  }
}
```

Esto permite:
- ✅ Evitar problemas de CORS en desarrollo
- ✅ Usar rutas relativas en fetch: `/api/auth/login`
- ✅ Testing en móvil con ngrok

---

## 📱 Testing en Móvil (ngrok)

1. Asegúrate de tener ngrok instalado y configurado
2. El dominio ngrok está permitido en `vite.config.js`
3. El backend debe tener `FRONTEND_URL` configurado con la URL de ngrok

Ver `DEPLOYMENT_GUIDE.md` para más detalles.

---

## 🛠️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Genera build de producción |
| `npm run preview` | Preview del build localmente |
| `npm run lint` | Ejecuta ESLint |

---

## 📦 Dependencias Principales

- **React 18** - Framework UI
- **React Router** - Enrutamiento
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **Cloudinary** - Gestión de imágenes

---

## 🔗 Enlaces Útiles

- [Guía de Despliegue](./DEPLOYMENT_GUIDE.md)
- [Documentación de la API](../backend/API_DOCUMENTATION.md)
- [Guía de Postman](../POSTMAN_GUIDE.md)

---

## 📝 Notas

- **NO** subir archivos `.env` ni `.env.production` al repositorio
- Usar **rutas relativas** (`/api/...`) en lugar de URLs hardcodeadas
- El proxy de Vite **solo funciona en desarrollo**

---

**Desarrollado por:** Equipo TESTheb - Capstone APT122
