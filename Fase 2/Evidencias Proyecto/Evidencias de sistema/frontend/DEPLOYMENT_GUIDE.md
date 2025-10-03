# 🚀 Guía de Despliegue - TESTheb Frontend

## 📋 Preparación para Producción

### 1. Variables de Entorno

Crea un archivo `.env.production` en la raíz del frontend:

```bash
# Copia el ejemplo
cp .env.production.example .env.production
```

Edita `.env.production` con la URL de tu backend en producción:

```env
# Ejemplo 1: Backend en Render/Heroku/Railway
VITE_API_URL=https://testheb-backend.onrender.com/api

# Ejemplo 2: Backend en el mismo dominio (con reverse proxy)
VITE_API_URL=/api

# Cloudinary (mismo que desarrollo)
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_API_KEY=tu_api_key
VITE_CLOUDINARY_API_SECRET=tu_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=testheb-products
```

### 2. Build para Producción

```bash
npm run build
```

Esto genera una carpeta `dist/` con los archivos estáticos optimizados.

---

## 🌐 Opciones de Despliegue

### Opción 1: Vercel (Recomendado - Gratis)

**Paso 1:** Instala Vercel CLI
```bash
npm i -g vercel
```

**Paso 2:** Deploy
```bash
vercel
```

**Paso 3:** Configura Variables de Entorno en Vercel
1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Agrega:
   - `VITE_API_URL` → URL de tu backend
   - Las variables de Cloudinary

**Paso 4:** Redeploy
```bash
vercel --prod
```

### Opción 2: Netlify (Gratis)

**Paso 1:** Instala Netlify CLI
```bash
npm i -g netlify-cli
```

**Paso 2:** Deploy
```bash
netlify deploy --prod
```

**Paso 3:** Configura Variables de Entorno
1. Ve a [app.netlify.com](https://app.netlify.com)
2. Site Settings → Environment Variables
3. Agrega las variables necesarias

### Opción 3: Render (Gratis)

1. Conecta tu repositorio en [render.com](https://render.com)
2. Selecciona "Static Site"
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Agrega variables de entorno

### Opción 4: GitHub Pages

**Nota:** GitHub Pages no soporta rutas dinámicas de React Router fácilmente. Mejor usar Vercel/Netlify.

---

## 🔧 Configuración de Backend en Producción

Asegúrate que tu backend tenga configurado CORS correctamente:

```javascript
// backend/server.js
const corsOptions = {
  origin: [
    'https://testheb.vercel.app', // Tu frontend en producción
    'http://localhost:5173' // Desarrollo
  ],
  credentials: true
}

app.use(cors(corsOptions))
```

---

## ✅ Checklist de Producción

- [ ] Crear `.env.production` con VITE_API_URL correcto
- [ ] Verificar que el backend esté desplegado y funcionando
- [ ] Configurar CORS en el backend para permitir tu dominio frontend
- [ ] Configurar variables de entorno en la plataforma de deploy
- [ ] Actualizar `FRONTEND_URL` en el backend `.env` para emails
- [ ] Probar flujo de recuperación de contraseña (email con enlaces)
- [ ] Probar flujo de pago con WebPay
- [ ] Verificar que todas las imágenes carguen desde Cloudinary

---

## 🔍 Debugging en Producción

### Ver logs del build:
```bash
npm run build
```

### Preview del build local:
```bash
npm run preview
```

Esto sirve la carpeta `dist/` en `http://localhost:4173`

### Verificar variables de entorno:
```bash
# Ver qué variables están disponibles
echo $VITE_API_URL
```

---

## 📱 Testing Móvil en Desarrollo

Para probar en móvil mientras desarrollas:

1. Asegúrate de estar en la misma red WiFi
2. Usa la URL Network que aparece en la terminal
3. Para emails con enlaces, usa ngrok (ya configurado)

---

## 🆘 Problemas Comunes

### Error: "Cannot fetch from /api"

**Causa:** La variable `VITE_API_URL` no está configurada

**Solución:**
```bash
# Verifica que .env.production existe
cat .env.production

# Verifica que la variable está correcta
VITE_API_URL=https://tu-backend.com/api
```

### Error CORS en producción

**Causa:** Backend no permite tu dominio frontend

**Solución:** Actualiza CORS en backend con tu URL de producción

### Links de recuperación de contraseña no funcionan

**Causa:** `FRONTEND_URL` en backend apunta a localhost

**Solución:** Actualiza `FRONTEND_URL` en backend `.env`:
```env
FRONTEND_URL=https://testheb.vercel.app
```

---

**¿Necesitas ayuda?** Revisa los logs de la plataforma de deploy.
