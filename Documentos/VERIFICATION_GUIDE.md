# 🔍 Guía de Verificación - Variables de Entorno

## 🎯 Objetivo

Verificar que las variables de entorno se están cargando correctamente y que:
1. ✅ Cloudinary está configurado
2. ✅ El proxy de Vite funciona
3. ✅ El backend responde

---

## 🚀 Método 1: Página de Prueba (Recomendado)

### Paso 1: Iniciar el proyecto

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Paso 2: Abrir la página de prueba

Ir a: **http://localhost:5173/test-env**

### Paso 3: Verificar resultados

La página mostrará:

#### ✅ Cloudinary Configuration
```
Cloud Name: ✅ dvmif7...
API Key: ✅ 344177...
Upload Preset: ✅ testheb-products
Folder: ✅ testheb/products
```

- **Si ves ❌ No definido:** Tu archivo `.env.local` no existe o está mal configurado
- **Si ves ✅ con valores:** Las variables se están cargando correctamente

#### ✅ API & Proxy Configuration
```
API URL: ✅ /api
Backend URL (Proxy): ✅ http://192.168.100.40:3000
```

### Paso 4: Probar conexiones

1. **Click en "🧪 Probar Conexión a Cloudinary"**
   - ✅ Debe mostrar: "✅ Conexión exitosa"
   - ❌ Si falla: Verifica el Cloud Name

2. **Click en "🧪 Probar Conexión al Backend"**
   - ✅ Debe mostrar: "✅ Proxy funcionando" + mensaje del backend
   - ❌ Si falla: Verifica que el backend esté corriendo

---

## 🛠️ Método 2: Consola del Navegador

### Paso 1: Abrir DevTools

Presiona `F12` o `Ctrl+Shift+I` en el navegador

### Paso 2: En la pestaña Console, ejecutar:

```javascript
// Verificar variables de entorno
console.log('🔍 Variables de Entorno:')
console.log('API URL:', import.meta.env.VITE_API_URL)
console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL)
console.log('Cloudinary:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)
```

**Resultado esperado:**
```
🔍 Variables de Entorno:
API URL: /api
Backend URL: http://192.168.100.40:3000
Cloudinary: dvmif7ngh
```

### Paso 3: Probar el proxy

```javascript
// Probar conexión al backend a través del proxy
fetch('/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend response:', data))
  .catch(err => console.error('❌ Error:', err))
```

**Resultado esperado:**
```
✅ Backend response: {
  message: "TESTheb API funcionando correctamente ✅",
  timestamp: "2025-10-02T...",
  version: "1.0.0"
}
```

---

## 🔧 Método 3: Network Tab (Verificar Proxy)

### Paso 1: Abrir DevTools → Network

### Paso 2: Hacer una petición

En cualquier página que use la API (ej: login, catálogo)

### Paso 3: Buscar request a `/api/...`

**Verificar:**
- ✅ Request URL: `http://localhost:5173/api/health`
- ✅ El navegador lo envía a `localhost:5173`
- ✅ Vite lo redirige automáticamente a `192.168.100.40:3000`

Si ves esto → **El proxy funciona** ✅

---

## ❌ Problemas Comunes

### Problema 1: "❌ No definido" en todas las variables

**Causa:** No existe el archivo `.env.local`

**Solución:**
```bash
cd frontend
cp .env.example .env.local
nano .env.local  # Editar con tus valores
```

Luego **reinicia el servidor de desarrollo:**
```bash
npm run dev
```

---

### Problema 2: Variables se muestran pero conexión a Cloudinary falla

**Causa:** Cloud Name incorrecto

**Verificar:**
```bash
cat frontend/.env.local | grep CLOUDINARY_CLOUD_NAME
# Debe ser: dvmif7ngh
```

**Probar manualmente:**
```bash
# Este URL debe abrir una imagen
https://res.cloudinary.com/dvmif7ngh/image/upload/sample.jpg
```

---

### Problema 3: "❌ Error" al probar backend

**Causa 1:** Backend no está corriendo

**Solución:**
```bash
cd backend
npm run dev
```

**Causa 2:** Puerto incorrecto en `VITE_BACKEND_URL`

**Verificar:**
```bash
cat frontend/.env.local | grep BACKEND_URL
# Debe coincidir con el puerto del backend
```

**Verificar backend está corriendo:**
```bash
curl http://192.168.100.40:3000/api/health
# Debe responder con JSON
```

---

### Problema 4: Variables no se actualizan

**Causa:** Vite cachea las variables al iniciar

**Solución:**
1. Guardar cambios en `.env.local`
2. **Detener el servidor** (Ctrl+C)
3. **Reiniciar:** `npm run dev`

**IMPORTANTE:** Debes reiniciar el dev server cada vez que cambies `.env.local`

---

## ✅ Checklist de Verificación

### Backend:
- [ ] Backend corriendo en puerto 3000
- [ ] `http://localhost:3000/api/health` responde
- [ ] Base de datos conectada

### Frontend:
- [ ] Archivo `.env.local` existe
- [ ] Variables visibles en consola
- [ ] Página `/test-env` carga sin errores
- [ ] Test de Cloudinary pasa ✅
- [ ] Test de Backend pasa ✅

### Proxy:
- [ ] Requests a `/api/...` funcionan
- [ ] No hay errores CORS
- [ ] Network tab muestra requests a `localhost:5173/api/...`

---

## 🎯 Resultado Esperado

Al final de la verificación deberías ver:

```
✅ Cloudinary Configuration
   - Cloud Name: ✅ dvmif7...
   - API Key: ✅ 344177...
   - Upload Preset: ✅ testheb-products
   - Folder: ✅ testheb/products
   - Status: ✅ Conexión exitosa

✅ API & Proxy Configuration
   - API URL: ✅ /api
   - Backend URL: ✅ http://192.168.100.40:3000
   - Status: ✅ Proxy funcionando
   - Message: TESTheb API funcionando correctamente ✅
```

---

## 🚨 Si Nada Funciona

### Reset Completo:

```bash
# 1. Detener todos los servidores
Ctrl+C en ambas terminales

# 2. Verificar archivo .env.local
cd frontend
cat .env.local

# Si no existe:
cp .env.example .env.local
nano .env.local  # Agregar tus valores

# 3. Limpiar cache de Vite
rm -rf .vite

# 4. Reinstalar dependencias
npm install

# 5. Reiniciar
npm run dev

# 6. Ir a http://localhost:5173/test-env
```

---

## 📝 Comandos Útiles

```bash
# Ver variables de entorno cargadas
cat frontend/.env.local

# Probar backend directamente
curl http://192.168.100.40:3000/api/health

# Ver logs del frontend (errores de variables)
npm run dev

# Ver logs del backend
cd backend && npm run dev
```

---

## 💡 Tips

1. **Siempre reinicia el dev server después de cambiar .env**
2. **Las variables DEBEN empezar con `VITE_`** en el frontend
3. **No uses comillas** en los valores del .env
4. **El proxy solo funciona en desarrollo**, no en producción

---

**Archivo de prueba:** `frontend/src/pages/TestEnvPage.jsx`
**Ruta:** http://localhost:5173/test-env

**¡Listo para verificar!** 🚀
