# 📋 Guía de Instalación y Despliegue Local - TESTheb

## 🔧 Requisitos Previos

### Software Necesario
- **Node.js** v18 o superior
- **PostgreSQL** v12 o superior
- **Git** para clonar el repositorio
- **npm** (incluido con Node.js)

### Verificar Instalaciones
```bash
node --version
npm --version
psql --version
git --version
```

## 🚀 Instalación del Proyecto

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd testheb-proyecto
```

### 2. Configurar Backend

#### 2.1 Navegar al directorio backend
```bash
cd backend
```

#### 2.2 Instalar dependencias
```bash
npm install
```

#### 2.3 Configurar variables de entorno
Crear archivo `.env` en el directorio `backend/`:
```env
# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bordados_testheb
DB_USER=postgres
DB_PASSWORD=admin123

# JWT Secret
JWT_SECRET=testheb-super-secret-key-2025

# Puerto del servidor
PORT=3000

# Entorno
NODE_ENV=development
```

### 3. Configurar Base de Datos PostgreSQL

#### 3.1 Crear base de datos
```sql
CREATE DATABASE bordados_testheb;
```

#### 3.2 Conectar a la base de datos
```sql
\c bordados_testheb;
```

#### 3.3 Crear tablas necesarias
El sistema ya incluye las siguientes tablas:
- ✅ `users` - Usuarios del sistema
- ✅ `categories` - Categorías de productos
- ✅ `products` - Productos disponibles
- ✅ `quotes` - Cotizaciones/solicitudes
- ✅ `orders` - Órdenes de compra
- ✅ `order_items` - Items de órdenes

### 4. Configurar Frontend

#### 4.1 Navegar al directorio frontend
```bash
cd ../frontend
```

#### 4.2 Instalar dependencias
```bash
npm install
```

## 🏃‍♂️ Ejecución en Desarrollo

### Backend
```bash
cd backend
npm run dev
# o
npm start
```

El servidor estará disponible en: **http://localhost:3000**

### Frontend
```bash
cd frontend
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

## 📡 Endpoints API Disponibles

### Core Endpoints
- **Health Check**: `GET /api/health`
- **Database Test**: `GET /api/test-db`

### Recursos CRUD
- **Categorías**: `/api/categories`
- **Productos**: `/api/products`
- **Usuarios**: `/api/users`
- **Cotizaciones**: `/api/cotizaciones`
- **Pagos**: `/api/payments`

### Ejemplos de Uso

#### Obtener todos los productos
```bash
curl http://localhost:3000/api/products
```

#### Crear nueva cotización
```bash
curl -X POST http://localhost:3000/api/cotizaciones \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@test.com",
    "phone": "987654321",
    "message": "Quiero cotizar 50 poleras con logo"
  }'
```

## 🛠 Funcionalidades Implementadas

### ✅ SEMANA 6 - BACKEND BASE
- [x] **Server Express (MVC)** - Estructura completa implementada
- [x] **Rutas productos** - CRUD completo con paginación
- [x] **Rutas usuarios** - CRUD completo con validaciones
- [x] **Rutas cotizaciones** - CRUD adaptado a tabla `quotes`
- [x] **Conexión PostgreSQL** - Pool de conexiones optimizado
- [x] **Tablas verificadas** - users, products, categories, quotes, orders
- [x] **Manejo de errores** - Winston logger + middleware profesional
- [x] **Logging básico** - Morgan + Winston con archivos rotativos

### 🔧 Dependencias Instaladas
- **Express** v5.1.0 - Framework web
- **PostgreSQL** v8.16.3 - Driver de base de datos
- **Winston** v3.17.0 - Logging profesional
- **Morgan** v1.10.1 - HTTP request logging
- **JWT** v9.0.2 - Autenticación (preparado)
- **Bcrypt** v6.0.0 - Hash de contraseñas (preparado)
- **Transbank SDK** v6.1.0 - Pagos sandbox
- **CORS** v2.8.5 - Cross-origin requests
- **Nodemailer** v7.0.6 - Envío de emails (preparado)

## 🚨 Troubleshooting

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo service postgresql status

# Verificar credenciales en .env
cat backend/.env
```

### Puerto ya en uso
```bash
# Matar proceso en puerto 3000
npx kill-port 3000

# O cambiar puerto en .env
PORT=3001
```

### Dependencias faltantes
```bash
# Reinstalar dependencias
cd backend && npm install
cd ../frontend && npm install
```

## 📂 Estructura del Proyecto

```
testheb-proyecto/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuraciones (DB, logger, transbank)
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── middleware/      # Middlewares personalizados
│   │   ├── routes/          # Definición de rutas
│   │   └── models/          # Modelos (preparado)
│   ├── logs/               # Archivos de logs
│   ├── .env                # Variables de entorno
│   ├── package.json        # Dependencias backend
│   └── server.js           # Punto de entrada
├── frontend/
│   ├── src/                # Código fuente React
│   ├── package.json        # Dependencias frontend
│   └── vite.config.js      # Configuración Vite
└── INSTALLATION_GUIDE.md   # Esta guía
```

## 🎯 Próximos Pasos (según Gantt)

1. **Autenticación JWT** - Sistema completo de login/register
2. **Frontend completo** - Interfaz React funcional
3. **Integración pagos** - Checkout con Transbank
4. **Tests** - Pruebas automatizadas
5. **Deployment** - Configuración para producción

---

**¿Problemas?** Revisa los logs en `backend/logs/` o contacta al equipo de desarrollo.