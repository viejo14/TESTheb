# Quick Start - Deploy TESTheb a Railway

## Resumen: Lo que vamos a hacer

Vamos a subir **3 servicios** a Railway:
1. **PostgreSQL** - Base de datos
2. **Backend** - API Node.js/Express
3. **Frontend** - React/Vite

**Tiempo estimado:** 2-3 horas

---

## Fase 1: Preparación (10 minutos)

### 1.1 Crear cuenta en Railway
- Ve a [railway.app](https://railway.app)
- Click en "Start a New Project"
- Conecta con GitHub

### 1.2 Verificar que el proyecto funciona local
```bash
# Backend
cd backend
npm install
npm test     # Debe pasar 52/52 tests
npm run dev  # Debe arrancar en puerto 3000

# Frontend
cd frontend
npm install
npm run dev  # Debe arrancar en puerto 5173
```

### 1.3 Subir código a GitHub (si no lo has hecho)
```bash
git init
git add .
git commit -m "Preparar para Railway deployment"
git remote add origin https://github.com/TU_USUARIO/testheb.git
git push -u origin main
```

---

## Fase 2: Crear Proyecto en Railway (15 minutos)

### 2.1 Crear nuevo proyecto
1. En Railway: "New Project" → "Deploy from GitHub repo"
2. Selecciona tu repositorio `testheb`
3. Railway detectará que es un monorepo

### 2.2 Agregar PostgreSQL
1. En tu proyecto, click "+ New"
2. Selecciona "Database" → "Add PostgreSQL"
3. Espera 1-2 minutos mientras se aprovisiona
4. Railway genera automáticamente `DATABASE_URL`

---

## Fase 3: Configurar Backend (30 minutos)

### 3.1 Crear servicio de Backend
1. Click "+ New" → "GitHub Repo"
2. Selecciona tu repo nuevamente
3. Railway preguntará qué servicio desplegar
4. Configurar:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### 3.2 Configurar Variables de Entorno

En el servicio Backend → "Variables" → "Raw Editor", pegar:

```bash
# Database (Railway reference)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Server
PORT=${{PORT}}
NODE_ENV=production

# JWT (CAMBIAR ESTO!)
JWT_SECRET=GENERA_UNO_SEGURO_CON_node_-e_"console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_EXPIRES_IN=7d

# Cloudinary (obtener de cloudinary.com)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Transbank (modo test)
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=tu_api_key
TRANSBANK_INTEGRATION_MODE=TEST

# Email (Gmail App Password)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_16_chars

# CORS
FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
CORS_ORIGINS=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}

# Setup (cambiar a false después)
ALLOW_SETUP=true
```

### 3.3 Deploy y verificar
1. Railway hará deploy automáticamente
2. Espera 2-3 minutos
3. Copia la URL del backend: `https://backend-production-xxxx.up.railway.app`
4. Prueba: `https://TU-BACKEND-URL/api/health`

**Debe responder:**
```json
{
  "message": "TESTheb API funcionando correctamente ✅",
  "timestamp": "...",
  "version": "1.0.0"
}
```

---

## Fase 4: Configurar Frontend (20 minutos)

### 4.1 Crear servicio de Frontend
1. Click "+ New" → "GitHub Repo"
2. Selecciona el mismo repo
3. Configurar:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview -- --host 0.0.0.0 --port $PORT`

### 4.2 Configurar Variables de Entorno

En el servicio Frontend → "Variables":

```bash
# API URL (apunta a tu backend de Railway)
VITE_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}/api

# Environment
NODE_ENV=production
```

### 4.3 Deploy y verificar
1. Espera 2-3 minutos al build
2. Copia la URL: `https://frontend-production-xxxx.up.railway.app`
3. Abre en navegador
4. Debe cargar la página principal

---

## Fase 5: Setup de Base de Datos (30 minutos)

### 5.1 Obtener credenciales de PostgreSQL

En Railway → PostgreSQL → "Connect" → copiar credenciales:
- Host
- Port
- Database
- Username
- Password

O copiar `DATABASE_URL` completo.

### 5.2 Conectar con cliente de base de datos

**Opción A: psql (terminal)**
```bash
psql "postgresql://username:password@host:port/database"
```

**Opción B: pgAdmin o DBeaver (recomendado)**
1. Crear nueva conexión
2. Pegar credenciales de Railway
3. Test Connection → Save

### 5.3 Ejecutar Schema

```sql
-- Copiar y pegar todo el contenido de backend/sql/schema_completo.sql
-- Ejecutar en el cliente de base de datos
```

O desde terminal:
```bash
psql "postgresql://..." < backend/sql/schema_completo.sql
```

### 5.4 Ejecutar Seed Data

```sql
-- Copiar y pegar todo el contenido de backend/sql/seed_data.sql
```

O desde terminal:
```bash
psql "postgresql://..." < backend/sql/seed_data.sql
```

### 5.5 Crear Admin User

**Opción A: Usar endpoint de setup**
```bash
curl https://TU-BACKEND-URL/api/setup/create-admin
```

**Opción B: SQL directo**
```sql
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

**Credenciales:** `admin@testheb.cl` / `admin123`

### 5.6 Verificar

```sql
-- Verificar tablas
\dt

-- Verificar datos
SELECT COUNT(*) FROM categories;  -- Debe ser > 0
SELECT COUNT(*) FROM products;    -- Debe ser > 0
SELECT COUNT(*) FROM users WHERE role = 'admin';  -- Debe ser 1
```

---

## Fase 6: Testing Final (30 minutos)

### 6.1 Backend Health Checks

```bash
# Health
curl https://TU-BACKEND-URL/api/health

# Database
curl https://TU-BACKEND-URL/api/test-db

# Categories
curl https://TU-BACKEND-URL/api/categories

# Products
curl https://TU-BACKEND-URL/api/products
```

### 6.2 Frontend Testing

1. **Home Page**
   - Abre `https://TU-FRONTEND-URL`
   - Debe cargar sin errores
   - Verifica que el header y footer se ven bien

2. **Catálogo**
   - Click en "Catálogo"
   - Deben aparecer productos
   - Imágenes deben cargar

3. **Login/Registro**
   - Click en "Login"
   - Registra un nuevo usuario
   - Verifica que funciona el login

4. **Admin Dashboard**
   - Login como admin: `admin@testheb.cl` / `admin123`
   - Ir a Admin Dashboard
   - Probar crear un producto
   - Probar subir imagen

### 6.3 Revisar Logs

En Railway:
- Backend → "Deployments" → Ver logs
- Buscar errores (líneas rojas)
- Verificar que las requests lleguen

---

## Fase 7: Seguridad Post-Deploy (10 minutos)

### 7.1 Desactivar endpoints de debug

En Backend → "Variables":
```bash
ALLOW_SETUP=false
```

Redeploy del backend (Railway lo hace automático).

### 7.2 Verificar

```bash
curl https://TU-BACKEND-URL/api/setup/create-admin
# Debe retornar 403: "Endpoints de setup/debug deshabilitados"
```

### 7.3 Generar JWT Secret seguro

```bash
# Generar nuevo secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Actualizar en Railway → Backend → Variables
JWT_SECRET=el_nuevo_secret_generado
```

---

## Troubleshooting Rápido

### Backend no arranca
- Verificar logs en Railway
- Verificar que `DATABASE_URL` esté configurado
- Verificar que todas las variables estén correctas

### Frontend no carga
- Verificar que el build terminó exitosamente
- Verificar logs de errores
- Verificar que `VITE_API_URL` apunte al backend correcto

### CORS error
- Verificar que `CORS_ORIGINS` en backend incluya la URL del frontend
- Verificar que `FRONTEND_URL` esté configurado

### Base de datos no conecta
- Verificar que PostgreSQL esté "Active" en Railway
- Verificar que `DATABASE_URL` esté en las variables del backend
- Probar `curl https://TU-BACKEND-URL/api/test-db`

---

## URLs Finales

Anota tus URLs de Railway:

- **Frontend:** `https://frontend-production-xxxx.up.railway.app`
- **Backend:** `https://backend-production-xxxx.up.railway.app`
- **Database:** `internal` (solo accesible desde backend)

---

## Próximos Pasos

1. **Dominio personalizado:** Configura `testheb.cl` en Railway
2. **Transbank producción:** Cambiar a modo PROD con credenciales reales
3. **Monitoreo:** Configurar alertas en Railway
4. **Backups:** Railway hace backups automáticos de PostgreSQL
5. **CI/CD:** Ya está configurado (push a GitHub = auto-deploy)

---

## Ayuda

Si algo falla:
1. Revisa los logs en Railway (botón "View Logs")
2. Consulta `RAILWAY_DEPLOYMENT.md` para guía detallada
3. Verifica variables de entorno en `backend/.env.example`

**¡Listo! Tu aplicación está en producción 🚀**
