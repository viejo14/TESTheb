# Guía de Deployment TESTheb a Railway

## Cronograma de Deployment

### Fase 1: Preparación Local (30 minutos)
- [ ] Verificar que el proyecto funciona localmente
- [ ] Crear cuenta en Railway (railway.app)
- [ ] Instalar Railway CLI (opcional pero recomendado)
- [ ] Preparar variables de entorno
- [ ] Hacer commit de todos los cambios pendientes
- [ ] Crear repositorio en GitHub (si no existe)

### Fase 2: Configuración Railway (20 minutos)
- [ ] Crear nuevo proyecto en Railway
- [ ] Provisionar base de datos PostgreSQL
- [ ] Conectar repositorio de GitHub
- [ ] Configurar servicios (Backend + Frontend)

### Fase 3: Deployment Backend (30 minutos)
- [ ] Desplegar servicio de backend
- [ ] Configurar variables de entorno del backend
- [ ] Esperar build y verificar logs
- [ ] Probar endpoints de salud
- [ ] Verificar conexión a base de datos

### Fase 4: Deployment Frontend (20 minutos)
- [ ] Desplegar servicio de frontend
- [ ] Configurar variables de entorno del frontend
- [ ] Esperar build de Vite
- [ ] Verificar que carga correctamente

### Fase 5: Configuración Base de Datos (30 minutos)
- [ ] Conectar a PostgreSQL de Railway
- [ ] Ejecutar schema_completo.sql
- [ ] Ejecutar seed_data.sql
- [ ] Crear usuario admin
- [ ] Verificar tablas creadas

### Fase 6: Integración y Testing (40 minutos)
- [ ] Configurar CORS con URL de Railway
- [ ] Probar autenticación (login/registro)
- [ ] Probar catálogo de productos
- [ ] Probar upload de imágenes a Cloudinary
- [ ] Probar integración Transbank (modo integración)
- [ ] Verificar emails

### Fase 7: Configuración Final (20 minutos)
- [ ] Configurar dominio personalizado (opcional)
- [ ] Desactivar endpoints de debug (ALLOW_SETUP=false)
- [ ] Configurar monitoreo y logs
- [ ] Documentar URLs de producción

**Tiempo Total Estimado: ~3 horas**

---

## PASO 1: Preparación Local

### 1.1 Verificar Funcionamiento Local

```bash
# Backend
cd backend
npm install
npm test  # Verificar que todos los tests pasen (52/52)
npm run dev  # Verificar que arranca sin errores

# Frontend
cd frontend
npm install
npm run build  # Verificar que el build funciona
npm run dev  # Verificar que arranca sin errores
```

### 1.2 Instalar Railway CLI (Opcional)

```bash
# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# Mac/Linux
curl -fsSL https://railway.app/install.sh | sh

# Verificar instalación
railway --version

# Login
railway login
```

### 1.3 Crear Repositorio GitHub

```bash
# Si no tienes git inicializado
git init
git add .
git commit -m "Preparar proyecto para deployment en Railway"

# Crear repo en GitHub y conectar
git remote add origin https://github.com/TU_USUARIO/testheb.git
git branch -M main
git push -u origin main
```

---

## PASO 2: Configuración Inicial en Railway

### 2.1 Crear Proyecto

1. Ir a [railway.app](https://railway.app)
2. Click en "New Project"
3. Seleccionar "Deploy from GitHub repo"
4. Autorizar acceso a GitHub
5. Seleccionar repositorio `testheb`

### 2.2 Provisionar Base de Datos PostgreSQL

1. En tu proyecto Railway, click "+ New"
2. Seleccionar "Database" → "Add PostgreSQL"
3. Esperar a que se aprovisione (1-2 minutos)
4. Railway generará automáticamente:
   - `DATABASE_URL`
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### 2.3 Configurar Servicios

Railway detectará automáticamente tu monorepo. Necesitas crear 2 servicios:

**Servicio 1: Backend (Node.js)**
- Root directory: `/backend`
- Build command: `npm install`
- Start command: `npm start`

**Servicio 2: Frontend (Vite)**
- Root directory: `/frontend`
- Build command: `npm install && npm run build`
- Start command: `npm run preview`

---

## PASO 3: Deployment del Backend

### 3.1 Configurar Variables de Entorno

En Railway, ir a tu servicio de Backend → "Variables" y agregar:

```bash
# Base de Datos (Railway lo proporciona automáticamente)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Puerto (Railway asigna dinámicamente)
PORT=${{PORT}}

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_esto_12345
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Transbank
TRANSBANK_COMMERCE_CODE=tu_commerce_code
TRANSBANK_API_KEY=tu_api_key
TRANSBANK_INTEGRATION_MODE=TEST  # Cambiar a PROD cuando estés listo

# Email
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password

# URLs
FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
CORS_ORIGINS=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}

# Seguridad
ALLOW_SETUP=true  # Cambiar a false después de setup inicial
NODE_ENV=production
```

### 3.2 Configurar Railway.toml (Backend)

Crear archivo `backend/railway.toml`:

```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### 3.3 Verificar package.json

Verificar que `backend/package.json` tenga:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "npx nodemon server.js"
  },
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 3.4 Deploy y Verificar

1. Railway detectará cambios y hará deploy automáticamente
2. Ver logs en Railway → tu servicio → "Deployments" → último deployment
3. Esperar a que el status sea "Active" (verde)
4. Copiar la URL pública: `https://tu-backend.up.railway.app`
5. Probar health check: `https://tu-backend.up.railway.app/api/health`

---

## PASO 4: Deployment del Frontend

### 4.1 Configurar Variables de Entorno

En Railway, ir a tu servicio de Frontend → "Variables":

```bash
# API URL (apunta a tu backend de Railway)
VITE_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}/api

# Node
NODE_ENV=production
```

### 4.2 Configurar Railway.toml (Frontend)

Crear archivo `frontend/railway.toml`:

```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm run preview -- --host 0.0.0.0 --port $PORT"
```

### 4.3 Actualizar vite.config.js

Modificar `frontend/vite.config.js` para producción:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### 4.4 Actualizar package.json

Verificar que `frontend/package.json` tenga:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 4.5 Deploy y Verificar

1. Commit y push cambios
2. Railway hará deploy automáticamente
3. Ver logs y esperar a que esté "Active"
4. Copiar URL: `https://tu-frontend.up.railway.app`
5. Abrir en navegador y verificar

---

## PASO 5: Configuración de Base de Datos

### 5.1 Conectar a PostgreSQL de Railway

**Opción A: Usar Railway CLI**

```bash
railway link  # Vincular al proyecto
railway connect Postgres  # Conectar a la BD
```

**Opción B: Usar psql con credenciales**

```bash
# Copiar DATABASE_URL desde Railway
psql "postgresql://usuario:password@host:puerto/database"
```

**Opción C: Usar cliente GUI (recomendado)**

Usar pgAdmin o DBeaver:
1. En Railway → PostgreSQL → "Connect"
2. Copiar credenciales (host, port, user, password, database)
3. Crear nueva conexión en tu cliente GUI

### 5.2 Ejecutar Schema

```bash
# Desde Railway CLI
railway run psql < backend/sql/schema_completo.sql

# O desde psql directo
psql "postgresql://..." -f backend/sql/schema_completo.sql
```

### 5.3 Ejecutar Seed Data

```bash
railway run psql < backend/sql/seed_data.sql

# O
psql "postgresql://..." -f backend/sql/seed_data.sql
```

### 5.4 Crear Usuario Admin

```bash
# Usar endpoint de setup (asegúrate ALLOW_SETUP=true)
curl https://tu-backend.up.railway.app/api/setup/create-admin

# O crear manualmente en psql
INSERT INTO users (name, email, password_hash, role, active, email_verified)
VALUES (
  'Admin TESTheb',
  'admin@testheb.cl',
  '$2b$12$LQv3c1yqBwEHxkbxdUlhre3wd7uw8zZZhq0dJ8UwuOLc5vfJ6K5Ae',
  'admin',
  true,
  true
);
```

Credenciales: `admin@testheb.cl` / `admin123`

### 5.5 Verificar Tablas

```sql
-- Conectado a Railway PostgreSQL
\dt  -- Listar tablas

-- Verificar datos
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM users;
```

---

## PASO 6: Integración y Testing

### 6.1 Actualizar CORS en Backend

Las variables de entorno ya deberían incluir:

```bash
CORS_ORIGINS=https://tu-frontend.up.railway.app
FRONTEND_URL=https://tu-frontend.up.railway.app
```

Si Railway cambió las URLs, actualizar en Variables.

### 6.2 Testing Sistemático

**Health Checks:**
```bash
# Backend health
curl https://tu-backend.up.railway.app/api/health

# Database test
curl https://tu-backend.up.railway.app/api/test-db

# Categories (público)
curl https://tu-backend.up.railway.app/api/categories

# Products (público)
curl https://tu-backend.up.railway.app/api/products
```

**Frontend:**
1. Abrir `https://tu-frontend.up.railway.app`
2. Verificar que carga el home
3. Navegar a catálogo
4. Ver detalle de producto

**Autenticación:**
1. Registrar nuevo usuario
2. Login con credenciales
3. Verificar que obtienes token
4. Probar rutas protegidas

**Admin Dashboard:**
1. Login como admin (`admin@testheb.cl` / `admin123`)
2. Ir a dashboard admin
3. Probar crear/editar producto
4. Probar subir imagen a Cloudinary

**Transbank (Modo Test):**
1. Agregar producto al carrito
2. Ir a checkout
3. Iniciar proceso de pago
4. Verificar redirección a Transbank
5. Usar tarjeta de prueba Transbank

### 6.3 Verificar Logs

En Railway:
- Backend → Deployments → Ver logs en tiempo real
- Buscar errores o warnings
- Verificar que las requests lleguen correctamente

---

## PASO 7: Configuración Final de Producción

### 7.1 Seguridad Post-Deployment

**Desactivar endpoints de debug:**
```bash
# En Railway Variables del Backend
ALLOW_SETUP=false
```

**Verificar que estén bloqueados:**
```bash
curl https://tu-backend.up.railway.app/api/setup/create-admin
# Debe retornar 403: "Endpoints de setup/debug deshabilitados"
```

### 7.2 Configurar Dominio Personalizado (Opcional)

En Railway:
1. Ir a tu servicio → "Settings"
2. Click en "Generate Domain" para subdominio Railway
3. O "Custom Domain" para tu dominio:
   - Agregar dominio (ej: `testheb.cl`)
   - Railway dará un CNAME
   - Agregar CNAME en tu proveedor DNS:
     - `testheb.cl` → CNAME → `tu-proyecto.up.railway.app`
     - `www.testheb.cl` → CNAME → `tu-proyecto.up.railway.app`

Repetir para backend:
- `api.testheb.cl` → CNAME → `tu-backend.up.railway.app`

**Actualizar variables de entorno con nuevos dominios:**
```bash
# Backend
FRONTEND_URL=https://testheb.cl
CORS_ORIGINS=https://testheb.cl,https://www.testheb.cl

# Frontend
VITE_API_URL=https://api.testheb.cl/api
```

### 7.3 Configurar Variables de Producción

**Transbank en Producción:**
```bash
TRANSBANK_INTEGRATION_MODE=PROD
TRANSBANK_COMMERCE_CODE=tu_codigo_produccion
TRANSBANK_API_KEY=tu_key_produccion
```

**Optimizaciones Node.js:**
```bash
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=2048
```

### 7.4 Monitoreo y Logs

Railway incluye:
- **Metrics**: CPU, RAM, Network
- **Logs**: Real-time logs de aplicación
- **Deployments**: Historial de deployments

**Configurar alertas** (opcional):
- Railway → Settings → Notifications
- Agregar webhook o email para alertas

---

## Checklist Final de Verificación

### Backend
- [ ] API responde en `/api/health`
- [ ] Base de datos conectada (`/api/test-db`)
- [ ] Endpoints públicos funcionan (categories, products)
- [ ] Autenticación funciona (login/register)
- [ ] Endpoints protegidos requieren token
- [ ] Admin puede acceder a dashboard
- [ ] Logs no muestran errores críticos
- [ ] CORS configurado correctamente
- [ ] Variables de entorno sensibles no están expuestas
- [ ] `ALLOW_SETUP=false` en producción

### Frontend
- [ ] Home page carga correctamente
- [ ] Catálogo muestra productos
- [ ] Detalle de producto funciona
- [ ] Carrito funciona
- [ ] Login/registro funcional
- [ ] Imágenes de Cloudinary cargan
- [ ] Navegación funciona
- [ ] Responsive design OK

### Base de Datos
- [ ] Todas las tablas creadas
- [ ] Datos seed insertados
- [ ] Usuario admin existe
- [ ] Conexiones funcionan
- [ ] Backups configurados (Railway automático)

### Integraciones
- [ ] Cloudinary: uploads funcionan
- [ ] Transbank: modo test funciona
- [ ] Emails: se envían correctamente
- [ ] CORS: frontend puede llamar backend

### Seguridad
- [ ] HTTPS habilitado (Railway automático)
- [ ] JWT_SECRET es seguro y único
- [ ] Passwords hasheadas con bcrypt
- [ ] Rate limiting activo
- [ ] Endpoints de debug deshabilitados
- [ ] Variables sensibles en Railway (no en código)

---

## Variables de Entorno - Referencia Completa

### Backend (Railway)

```bash
# Database (Railway automático)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Server
PORT=${{PORT}}
NODE_ENV=production

# JWT
JWT_SECRET=CAMBIAR_ESTO_POR_ALGO_SUPER_SEGURO_RANDOM
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Transbank
TRANSBANK_COMMERCE_CODE=tu_commerce_code_test
TRANSBANK_API_KEY=tu_api_key_test
TRANSBANK_INTEGRATION_MODE=TEST

# Email (Gmail App Password)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_16_caracteres

# CORS
FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
CORS_ORIGINS=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}

# Setup (cambiar a false después de configurar BD)
ALLOW_SETUP=true
```

### Frontend (Railway)

```bash
# API
VITE_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}/api

# Environment
NODE_ENV=production
```

---

## Comandos Útiles Railway CLI

```bash
# Login
railway login

# Link proyecto
railway link

# Ver variables
railway variables

# Set variable
railway variables set KEY=value

# Ver logs en vivo
railway logs

# Ejecutar comando en Railway
railway run npm test

# Conectar a PostgreSQL
railway connect Postgres

# Deploy manual
railway up

# Ver status
railway status
```

---

## Troubleshooting Común

### Error: "Cannot find module"
**Causa:** Dependencias no instaladas
**Solución:** Verificar que `package.json` tenga todas las deps y Railway ejecute `npm install`

### Error: "Port already in use"
**Causa:** No usar `process.env.PORT` de Railway
**Solución:** En `server.js`: `const PORT = process.env.PORT || 3000`

### Error: "Database connection failed"
**Causa:** `DATABASE_URL` mal configurada
**Solución:** Usar `${{Postgres.DATABASE_URL}}` en variables Railway

### Frontend no puede llamar al backend
**Causa:** CORS no configurado
**Solución:** Agregar frontend URL a `CORS_ORIGINS` en backend

### Build de Vite falla
**Causa:** Memoria insuficiente
**Solución:** Agregar `NODE_OPTIONS=--max-old-space-size=2048`

### Imágenes no cargan
**Causa:** Cloudinary mal configurado
**Solución:** Verificar las 3 variables de Cloudinary

---

## Costos Estimados Railway

**Plan Hobby (Gratis):**
- $5 de crédito gratis/mes
- Suficiente para desarrollo/testing
- ~500 horas de ejecución

**Plan Developer ($5/mes):**
- $5 de crédito + $5 adicionales
- ~1000 horas de ejecución
- Suficiente para producción pequeña

**Costos típicos TESTheb:**
- Backend: ~$3-5/mes
- Frontend: ~$2-3/mes
- PostgreSQL: ~$5-10/mes (según uso)
- **Total: ~$10-18/mes**

---

## Próximos Pasos Después del Deployment

1. **Monitoreo**: Configurar Sentry o LogRocket para error tracking
2. **Analytics**: Agregar Google Analytics o Plausible
3. **SEO**: Configurar meta tags y sitemap
4. **Performance**: Optimizar imágenes y lazy loading
5. **Testing**: Ejecutar load tests contra producción
6. **Backups**: Configurar backups automáticos de BD (Railway lo hace)
7. **CI/CD**: Configurar GitHub Actions para tests automáticos
8. **Dominio**: Comprar y configurar dominio personalizado

---

**¿Listo para empezar?** Comienza por la Fase 1 y ve marcando cada item del checklist.
