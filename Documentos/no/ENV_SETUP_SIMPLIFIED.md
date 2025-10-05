# ✨ Configuración Simplificada de .env - TESTheb

## 🎯 Estructura Final (Simple y Clara)

```
testheb-proyecto/
├── backend/
│   ├── .env.example     ✅ SUBIR a GitHub (plantilla)
│   └── .env             ❌ NO SUBIR (tus credenciales)
│
└── frontend/
    ├── .env.example     ✅ SUBIR a GitHub (plantilla)
    └── .env.local       ❌ NO SUBIR (tus credenciales)
```

**Total: 4 archivos .env en todo el proyecto** ✨

---

## 🚀 Setup para Nuevo Desarrollador

### Paso 1: Clonar el proyecto
```bash
git clone https://github.com/tu-repo/testheb-proyecto.git
cd testheb-proyecto
```

### Paso 2: Configurar Backend
```bash
cd backend
cp .env.example .env
nano .env  # Editar con tus credenciales
```

### Paso 3: Configurar Frontend
```bash
cd ../frontend
cp .env.example .env.local
nano .env.local  # Editar con tus credenciales
```

### Paso 4: Instalar y Correr
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

---

## 📝 Contenido de los Archivos

### Backend

**`.env.example` (plantilla - GitHub):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=testheb_db
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_password_postgres

JWT_SECRET=genera_con_crypto
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=genera_otro_diferente
JWT_REFRESH_EXPIRES_IN=7d

EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password_16_caracteres
EMAIL_FROM_NAME=TESTheb

FRONTEND_URL=http://localhost:5173
```

**`.env` (tus credenciales - NO subir):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bordados_testheb
DB_USER=postgres
DB_PASSWORD=admin123

JWT_SECRET=testheb-super-secret-key-2025
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=testheb-refresh-secret-key-2025
JWT_REFRESH_EXPIRES_IN=7d

EMAIL_SERVICE=gmail
EMAIL_USER=franciscocampos0754@gmail.com
EMAIL_PASSWORD=hdgufefbhuquxyeu
EMAIL_FROM_NAME=TESTheb

FRONTEND_URL=https://nonoptional-rohan-undefaulting.ngrok-free.dev
```

---

### Frontend

**`.env.example` (plantilla - GitHub):**
```env
VITE_API_URL=/api
VITE_BACKEND_URL=http://TU_IP_LOCAL:3000

VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_API_KEY=tu_api_key
VITE_CLOUDINARY_API_SECRET=tu_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
VITE_CLOUDINARY_FOLDER=tu_folder
```

**`.env.local` (tus credenciales - NO subir):**
```env
VITE_API_URL=/api
VITE_BACKEND_URL=http://192.168.100.40:3000

VITE_CLOUDINARY_CLOUD_NAME=dvmif7ngh
VITE_CLOUDINARY_API_KEY=344177843931449
VITE_CLOUDINARY_API_SECRET=OHOEEsFeZsqzCNaSOnr4WhpZP7c
VITE_CLOUDINARY_UPLOAD_PRESET=testheb-products
VITE_CLOUDINARY_FOLDER=testheb/products
```

---

## 🔒 Protección en .gitignore

### Raíz del proyecto:
```gitignore
# Archivos protegidos
.env
.env.local
.env.*.local

# Permitir plantillas
!.env.example
!**/.env.example
```

### Frontend específico:
```gitignore
.env
.env.local
.env.*.local

!.env.example
```

---

## ✅ Verificación Rápida

### ¿Qué archivos están protegidos?
```bash
# Estos NO deben aparecer:
git status | grep "\.env$"
git status | grep "\.env.local"

# Este SÍ debe aparecer (para subir):
git status | grep "\.env.example"
```

### ¿Están ignorados correctamente?
```bash
git check-ignore backend/.env
# Debe mostrar: backend/.env

git check-ignore frontend/.env.local
# Debe mostrar: frontend/.env.local
```

---

## 🎯 Qué Archivos Subir a GitHub

```bash
# ✅ SUBIR estos archivos
git add backend/.env.example
git add frontend/.env.example
git add .gitignore
git add frontend/.gitignore
git commit -m "Add environment templates"
git push
```

**NUNCA subir:**
- ❌ `backend/.env`
- ❌ `frontend/.env.local`

---

## 💡 Por Qué Esta Configuración

### ✅ Ventajas:

1. **Simple:** Solo 2 archivos por carpeta
2. **Claro:** Nombres descriptivos (.env.local vs .env)
3. **Seguro:** Credenciales protegidas por .gitignore
4. **Vite-friendly:** `.env.local` funciona en dev y producción
5. **Team-friendly:** `.env.example` documenta qué configurar

### ❌ Eliminamos:

- `.env.development` → Redundante
- `.env.development.example` → Redundante
- `.env.production.example` → Redundante

**Ahora solo hay UN archivo con credenciales por carpeta.**

---

## 🚀 Producción

**NO uses archivos .env en el servidor de producción.**

### En Vercel/Netlify/Render:
1. Dashboard → Environment Variables
2. Agregar cada variable manualmente
3. Deploy

**Ventajas:**
- ✅ Más seguro (no hay .env en el repo del servidor)
- ✅ Fácil de cambiar sin redeploy
- ✅ Valores diferentes por entorno

---

## 🆘 Troubleshooting

### Error: "Cannot find .env.local"
```bash
cd frontend
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

### Error: Variables no se cargan
```bash
# Vite requiere reiniciar el dev server después de cambios en .env
# Ctrl+C y luego:
npm run dev
```

### Accidentalmente subiste .env
```bash
# 1. Eliminar del repo
git rm --cached backend/.env
git rm --cached frontend/.env.local

# 2. Commit y push
git commit -m "Remove sensitive files"
git push

# 3. Cambiar TODAS las contraseñas inmediatamente
```

---

## 📊 Comparación Antes/Después

### ❌ Antes (Complicado):
```
frontend/
├── .env.local
├── .env.development
├── .env.development.example
└── .env.production.example
```
**4 archivos**, confuso qué usar

### ✅ Después (Simple):
```
frontend/
├── .env.example
└── .env.local
```
**2 archivos**, claro y directo

---

## 🎓 Regla de Oro

**Un proyecto = Un archivo de credenciales por carpeta**

- Backend: `.env`
- Frontend: `.env.local`

**+ Plantillas:**
- Backend: `.env.example`
- Frontend: `.env.example`

**Nada más. Así de simple.** ✨

---

**Última actualización:** Octubre 2025
**Estado:** ✅ Simplificado y optimizado
