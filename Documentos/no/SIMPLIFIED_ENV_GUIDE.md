# 📋 Guía Simplificada de .env - TESTheb

## 🎯 Configuración Recomendada (Simple)

### Backend - Solo 2 archivos:

```
backend/
├── .env.example     ✅ SUBIR a GitHub (plantilla)
└── .env             ❌ NO SUBIR (credenciales reales)
```

**Workflow:**
1. Copiar: `cp backend/.env.example backend/.env`
2. Editar `.env` con tus credenciales reales
3. Subir solo el `.env.example` a GitHub

---

### Frontend - Solo 2 archivos:

```
frontend/
├── .env.example     ✅ SUBIR a GitHub (plantilla)
└── .env.local       ❌ NO SUBIR (credenciales reales)
```

**Workflow:**
1. Copiar: `cp frontend/.env.example frontend/.env.local`
2. Editar `.env.local` con tus credenciales reales
3. Subir solo el `.env.example` a GitHub

**¿Por qué `.env.local`?**
- Vite lo carga automáticamente en desarrollo Y producción
- No necesitas archivos separados para dev/prod
- Es más simple de mantener

---

## 🗑️ Archivos que puedes ELIMINAR:

```bash
# Estos complican innecesariamente:
frontend/.env.development
frontend/.env.development.example
frontend/.env.production.example
```

**Reemplázalos con UN SOLO archivo:**
```bash
frontend/.env.example
```

---

## 📝 Contenido de los archivos

### `backend/.env.example` (plantilla):
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tu_nombre_bd
DB_USER=tu_usuario
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=genera_con_crypto
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=genera_otro_diferente
JWT_REFRESH_EXPIRES_IN=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password

# URLs
FRONTEND_URL=http://localhost:5173
```

### `backend/.env` (real - NO subir):
```env
# Tus valores reales aquí
DB_PASSWORD=admin123
JWT_SECRET=a8f7d6e5c4b3...
EMAIL_PASSWORD=hdgufefbhuquxyeu
```

---

### `frontend/.env.example` (plantilla):
```env
# Backend API (usa proxy en desarrollo)
VITE_API_URL=/api

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_API_KEY=tu_api_key
VITE_CLOUDINARY_API_SECRET=tu_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=tu_preset

# SOLO si usas ngrok para móvil:
# VITE_BACKEND_URL=http://TU_IP:3000
```

### `frontend/.env.local` (real - NO subir):
```env
# Tus valores reales aquí
VITE_API_URL=/api
VITE_CLOUDINARY_CLOUD_NAME=dvmif7ngh
VITE_CLOUDINARY_API_KEY=344177843931449
VITE_CLOUDINARY_API_SECRET=OHOEEsFeZsqzCNaSOnr4WhpZP7c
VITE_CLOUDINARY_UPLOAD_PRESET=testheb-products

# Para desarrollo con ngrok:
VITE_BACKEND_URL=http://192.168.100.40:3000
```

---

## 🚀 ¿Y en Producción?

**NO uses archivos .env en producción**, usa variables de entorno del hosting:

### En Vercel/Netlify:
1. Dashboard → Settings → Environment Variables
2. Agregar cada variable manualmente
3. Deploy

### En Render:
1. Dashboard → Environment → Add Environment Variable
2. Agregar cada variable
3. Deploy

**Ventajas:**
- ✅ Más seguro (no hay archivo .env en el servidor)
- ✅ Fácil de cambiar sin re-deploy
- ✅ Diferentes valores por entorno (staging, production)

---

## 📊 Comparación

### ❌ Configuración Actual (Complicada):

```
frontend/
├── .env.local
├── .env.development
├── .env.development.example
├── .env.production.example
└── vite.config.js
```

**Problemas:**
- 4 archivos diferentes
- Confuso cuál usar
- Duplicación de valores
- Difícil de mantener

### ✅ Configuración Simplificada:

```
frontend/
├── .env.example     (plantilla)
└── .env.local       (tus credenciales)
```

**Beneficios:**
- Solo 2 archivos
- Claro y simple
- Un solo lugar para credenciales
- Fácil de mantener

---

## 🔧 Migración (Simplificar ahora)

### Paso 1: Consolidar archivos

```bash
cd frontend

# 1. Crear .env.example unificado
cat > .env.example << 'EOF'
# Backend API
VITE_API_URL=/api

# Backend URL para proxy (solo desarrollo)
VITE_BACKEND_URL=http://TU_IP:3000

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_API_KEY=tu_api_key
VITE_CLOUDINARY_API_SECRET=tu_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=tu_preset
VITE_CLOUDINARY_FOLDER=tu_folder
EOF

# 2. Si NO tienes .env.local, crearlo desde .env.development
cp .env.development .env.local

# 3. Eliminar archivos innecesarios
rm .env.development
rm .env.development.example
rm .env.production.example
```

### Paso 2: Actualizar .gitignore

```bash
cd frontend

# En .gitignore debe tener:
# .env.local
# !.env.example
```

### Paso 3: Verificar

```bash
# Solo deberían quedar:
ls .env*
# .env.example  ← Subir a GitHub
# .env.local    ← NO subir
```

---

## 🎯 Resultado Final

### Backend (2 archivos):
```
✅ .env.example   → GitHub
❌ .env           → Git ignore
```

### Frontend (2 archivos):
```
✅ .env.example   → GitHub
❌ .env.local     → Git ignore
```

**Total: 4 archivos en todo el proyecto** (en lugar de 7+)

---

## 💡 Regla Simple

**Un proyecto = Un archivo de credenciales por carpeta**

- Backend: `.env`
- Frontend: `.env.local`

**+ Plantillas:**
- Backend: `.env.example`
- Frontend: `.env.example`

**¿Múltiples entornos?**
→ Usa variables de entorno del hosting, NO archivos .env

---

## ❓ FAQ

### ¿Por qué .env.local en frontend y no .env?

Porque Vite tiene esta prioridad:
```
.env.local > .env.development > .env
```

`.env.local` sobreescribe todo y funciona en cualquier modo.

### ¿Y si quiero diferentes valores en dev y prod?

**Opción 1 (Recomendada):**
Variables de entorno del hosting en producción.

**Opción 2:**
Usar `.env.development` y `.env.production` (más complejo).

### ¿Cuándo NECESITO múltiples .env?

Solo si:
- Equipo grande (10+ devs) con diferentes configuraciones
- Múltiples entornos (dev, staging, qa, prod)
- CI/CD complejo

Para TESTheb → **NO lo necesitas**

---

**Recomendación:** Simplifica a 2 archivos por carpeta (total 4 en el proyecto).
