# 🧵 TESTheb - E-commerce de Bordados

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Plataforma de e-commerce especializada en bordados personalizados. Proyecto capstone APT122 con sistema completo de autenticación, panel administrativo, integración WebPay y gestión de inventario en tiempo real.

**Características principales:** E-commerce completo, autenticación JWT, panel admin, pagos WebPay, control de inventario con descuento automático, responsive design, gestión de imágenes con Cloudinary.

## ✨ ¿Qué hace este sistema?

### ✅ **SÍ INCLUYE:**
- **Catálogo de productos** - Sistema completo con categorías, búsqueda y filtros
- **Cotizaciones automáticas** - Carrito de compras con cálculo de precios en tiempo real
- **Pagos Transbank/WebPay** - Integración completa con WebPay Plus para pagos en línea
- **Panel administrativo** - Dashboard con gestión de productos, categorías, usuarios y pedidos
- **Inventario en tiempo real** - Control de stock con descuento automático al realizar compras
- **Gestión de imágenes** - Múltiples imágenes por producto con Cloudinary
- **Autenticación JWT** - Sistema seguro de login y registro de usuarios
- **Responsive design** - Funciona perfectamente en móviles, tablets y desktop

### ❌ **NO INCLUYE:**
- **ERP completo** - No gestiona proveedores, contabilidad empresarial o recursos humanos
- **Inventario multi-bodega** - Stock en una sola ubicación (no múltiples sucursales)
- **Alertas de stock bajo** - No notifica automáticamente cuando el stock es bajo
- **Marketplace multi-vendedor** - Es una tienda única, no una plataforma de múltiples vendedores
- **Trazabilidad de movimientos** - No registra historial detallado de entradas/salidas de inventario

**En resumen:** Es una plataforma e-commerce B2C completa y funcional, ideal para una tienda online que quiere vender productos, gestionar inventario básico y procesar pagos en línea.

## 🛠️ Tecnologías

**Frontend:** React 19, Vite, TailwindCSS, Framer Motion, React Router
**Backend:** Node.js, Express, PostgreSQL, JWT, bcrypt, Transbank SDK
**Servicios:** Cloudinary (imágenes), WebPay (pagos), Winston (logs)

## 🏗️ Arquitectura del Sistema

```
TESTheb/
├── 🚀 Frontend (React + Vite)
│   ├── Interfaz de usuario moderna
│   ├── Gestión de estado con Context API
│   ├── Animaciones con Framer Motion
│   └── Estilos con TailwindCSS
│
├── ⚡ Backend (Node.js + Express)
│   ├── API RESTful robusta
│   ├── Autenticación JWT
│   ├── Middleware de seguridad
│   └── Integración con servicios externos
│
├── 🗄️ Base de Datos (PostgreSQL)
│   ├── Esquema optimizado
│   ├── Relaciones eficientes
│   └── Sistema de migraciones
│
└── 📁 Estructura de Fases
    ├── Fase 1/ (Documentación y diseño)
    └── Fase 2/ (Implementación actual)
```

## 📁 Estructura del Proyecto

```
testheb-proyecto/
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 config/          # Configuraciones (DB, Logger)
│   │   ├── 📂 controllers/     # Lógica de negocio
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── categoryController.js
│   │   │   ├── paymentController.js
│   │   │   └── webpayController.js
│   │   ├── 📂 middleware/      # Autenticación, validaciones
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── 📂 routes/          # Definición de rutas
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── webpayRoutes.js
│   │   │   └── uploadRoutes.js
│   │   └── 📂 models/          # Modelos de datos
│   ├── 📂 sql/                 # Scripts de migración
│   │   ├── create_users_table.sql
│   │   ├── create_orders_table.sql
│   │   ├── implement_simple_system.sql
│   │   └── add_product_sizes.sql
│   ├── 📂 logs/                # Logs del sistema
│   ├── package.json
│   └── server.js               # Punto de entrada
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/      # Componentes React reutilizables
│   │   │   ├── 📂 admin/       # Componentes del panel admin
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   └── AdminSidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   └── PageTransition.jsx
│   │   ├── 📂 pages/           # Páginas principales
│   │   │   ├── HomePage.jsx
│   │   │   ├── CatalogPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── PaymentReturnPage.jsx
│   │   ├── 📂 context/         # Context API (Auth, Cart)
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── 📂 hooks/           # Custom hooks
│   │   ├── 📂 services/        # APIs y servicios externos
│   │   │   ├── api.js
│   │   │   ├── cloudinaryService.js
│   │   │   └── uploadService.js
│   │   ├── 📂 utils/           # Utilidades y helpers
│   │   └── 📂 data/            # Datos estáticos
│   ├── 📂 public/              # Assets estáticos
│   │   ├── testheb-logo.png
│   │   ├── banner_servicios.jpg
│   │   └── 📂 images/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 📂 Fase 1/                  # Documentación Fase 1
│   ├── 📂 Evidencias Grupales/
│   ├── 📂 Evidencias Individuales/
│   └── 📂 Evidencias Proyecto/
│
├── 📂 Fase 2/                  # Implementación actual
│   └── 📂 Evidencias Proyecto/
│       └── 📂 Evidencias de sistema/
│           ├── 📂 backend/     # Código backend Fase 2
│           └── 📂 frontend/    # Código frontend Fase 2
│
├── 📄 README.md                # Este archivo
```

## 📊 Base de Datos

### Esquema Principal

```sql
📋 users           # Sistema de usuarios y autenticación
├── id (PK)
├── name, email, password_hash
├── role (customer/admin/employee)
├── active, email_verified
└── timestamps

🏷️ categories      # Organización de productos
├── id (PK)
├── name, description
├── active
└── timestamps

📦 products        # Catálogo principal
├── id (PK)
├── name, description, price
├── image_url, category_id (FK)
├── size_id (FK), stock (inventario)
├── sku (código único)
└── timestamps
# Stock se descuenta automáticamente al confirmar pago

📏 sizes           # Tallas disponibles
├── id (PK)
├── name (S,M,L,XL)
├── display_name, sort_order
└── active

🛒 orders          # Transacciones WebPay
├── id (PK)
├── buy_order, amount, session_id
├── status, token, authorization_code
├── order_data (JSON), result_data (JSON)
└── timestamps
```

### Variables de Entorno

Crea un archivo `.env` en el directorio `backend/` con la siguiente configuración:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=testheb_db
DB_USER=tu_usuario
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=tu_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Transbank (opcional)
TRANSBANK_INTEGRATION_TYPE=TEST
TRANSBANK_COMMERCE_CODE=tu_commerce_code
TRANSBANK_API_KEY_ID=tu_api_key_id
TRANSBANK_API_KEY_SECRET=tu_api_key_secret
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- PostgreSQL 15+
- npm o yarn
- Cuenta Cloudinary (para imágenes)
- Cuenta Transbank (para pagos)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/sebamellaisla-sketch/2025_MA_CAPSTONE_705D_GRUPO_7.git
cd testheb-proyecto
```

### 2. Configurar Backend

```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env
```

### 3. Configurar Base de Datos

```bash
# Crear base de datos
createdb testheb_db

# Ejecutar migraciones
psql -d testheb_db -f sql/create_users_table.sql
psql -d testheb_db -f sql/implement_simple_system.sql
psql -d testheb_db -f sql/create_orders_table.sql
```

### 4. Configurar Frontend

```bash
cd frontend
npm install

# El frontend usa proxy a localhost:3000 por defecto
# Revisar vite.config.js si necesitas cambiar la URL del backend
```

### 5. Ejecutar el Proyecto

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev     # Desarrollo con nodemon
# o
npm start       # Producción
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev     # http://localhost:5173
```

## 🎮 Uso del Sistema

### 👥 Credenciales de Prueba

> **⚠️ Nota**: Las credenciales de prueba están configuradas en el sistema para demos. En producción, estas deben ser cambiadas.

**Administrador:**
- Email: `admin@testheb.cl`
- Contraseña: `[Ver documentación interna]`

**Cliente de Prueba:**
- Email: `cliente@testheb.cl`
- Contraseña: `[Ver documentación interna]`

### 🛍️ Flujo de Usuario

1. **Exploración**: Navegar catálogo y filtrar por categorías
2. **Selección**: Ver detalles de productos y especificaciones
3. **Personalización**: Agregar bordados personalizados (próximamente)
4. **Carrito**: Gestionar productos seleccionados
5. **Checkout**: Proceso de compra con WebPay
6. **Confirmación**: Seguimiento del pedido

### ⚙️ Panel Administrativo

Acceder a `/admin` con credenciales de administrador:

- 📊 **Dashboard**: Estadísticas y métricas del sistema
- 📦 **Productos**: CRUD completo de productos con control de stock
- 🏷️ **Categorías**: Gestión de categorías
- 👥 **Usuarios**: Administración de cuentas
- 📸 **Imágenes**: Subida automática a Cloudinary
- 🛒 **Pedidos**: Seguimiento de transacciones

### 📦 Sistema de Inventario

El sistema incluye gestión de inventario básico pero funcional:

**Funcionalidades:**
- ✅ Cada producto tiene un campo `stock` que se visualiza en el panel admin
- ✅ Al crear/editar productos, el admin puede establecer la cantidad disponible
- ✅ Cuando un cliente completa una compra, el stock se **descuenta automáticamente**
- ✅ El frontend muestra la disponibilidad de productos en tiempo real
- ✅ El sistema previene ventas con stock negativo (`Math.max(0, stock - cantidad)`)

**Cómo funciona:**
1. Cliente agrega productos al carrito
2. Cliente procede al checkout y paga con WebPay
3. Al confirmar el pago exitoso, se crean los `order_items`
4. El sistema automáticamente ejecuta: `stock = stock - cantidad_comprada`
5. El nuevo stock se refleja inmediatamente en el admin y el catálogo

**Ubicación del código:**
- Modelo de productos: [backend/src/models/Product.js:240](backend/src/models/Product.js#L240)
- Descuento de stock: [backend/src/models/OrderItem.js:45-59](backend/src/models/OrderItem.js#L45-L59)

## 🔌 API Endpoints

### 🔐 Autenticación
```
POST   /api/auth/register       # Registro de usuario
POST   /api/auth/login          # Inicio de sesión
GET    /api/auth/profile        # Perfil de usuario (protegido)
PUT    /api/auth/profile        # Actualizar perfil (protegido)
POST   /api/auth/change-password # Cambiar contraseña (protegido)
POST   /api/auth/logout         # Cerrar sesión (protegido)
```

### 📦 Productos
```
GET    /api/products            # Listar todos los productos
GET    /api/products/:id        # Obtener producto específico
GET    /api/products/category/:id # Productos por categoría
GET    /api/products/search?q=  # Buscar productos
POST   /api/products            # Crear producto (admin)
PUT    /api/products/:id        # Actualizar producto (admin)
DELETE /api/products/:id        # Eliminar producto (admin)
```

### 🏷️ Categorías
```
GET    /api/categories          # Listar categorías
POST   /api/categories          # Crear categoría (admin)
PUT    /api/categories/:id      # Actualizar categoría (admin)
DELETE /api/categories/:id      # Eliminar categoría (admin)
```

### 💳 Pagos
```
POST   /api/webpay/create       # Crear transacción WebPay
POST   /api/webpay/commit       # Confirmar transacción
GET    /api/webpay/status/:id   # Estado de transacción
```

### 📸 Subidas
```
POST   /api/upload/image        # Subir imagen a Cloudinary (admin)
DELETE /api/upload/image/:id    # Eliminar imagen (admin)
```

## 🔧 Sistema de Tallas (Próximamente)

El proyecto incluye un sistema avanzado de tallas preparado para activar:

### Funcionalidades Preparadas
- ✅ **Base de datos** con tablas `sizes` y `product_sizes`
- ✅ **Código backend** para gestión de stock por talla
- ✅ **Componentes frontend** para selector de tallas
- ✅ **Panel admin** para configurar tallas por producto
- ✅ **Migraciones SQL** listas para ejecutar

### Para Activar el Sistema de Tallas
```bash
# 1. Ejecutar migración de tallas
psql -d testheb_db -f backend/sql/add_product_sizes.sql

# 2. Descomentar código avanzado en:
# - frontend/src/components/admin/ProductForm.jsx
# - frontend/src/pages/ProductDetailPage.jsx
# - backend/src/controllers/productController.js

# 3. Reiniciar servidores
```

Ver documentación completa en `COMO_ACTIVAR_TALLAS.md`

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run test
```

## 📦 Deployment

### Preparar para Producción

**Backend:**
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Servir desde dist/ con servidor web estático
```

### Variables de Entorno Producción

- Configurar SSL/HTTPS
- Usar credenciales reales de Transbank
- Configurar CORS para dominio de producción
- Usar base de datos PostgreSQL en la nube
- Configurar logs persistentes

## 👥 Equipo de Desarrollo

| Desarrollador | Rol | Contact |
|---------------|-----|---------|
| **Francisco Campos** | Full Stack Developer | [GitHub](https://github.com) |
| **Sebastian Mella** | Full Stack Developer | [GitHub](https://github.com) |

## 📝 Documentación Adicional

### **Documentación General**
- 📋 [Estado Actual del Sistema](Documentos/ESTADO_ACTUAL_SISTEMA.md)
- 🎯 [Resumen del Proyecto](Documentos/RESUMEN_PROYECTO_TALLAS.md)
- 🔧 [Cómo Activar Tallas](Documentos/COMO_ACTIVAR_TALLAS.md)
- 🚀 [Quick Start](Documentos/QUICK_START.md)

### **Documentación de Autenticación**
- 🔐 [Documentación de API Auth](Documentos/AUTH_API_DOCS.md)

### **Documentación de Pagos** ⭐ NUEVO
- 💳 [Documentación del Flujo de Pago](Documentos/PAYMENT_FLOW_DOCUMENTATION.md) - Guía completa del sistema de pagos
- 🧪 [Casos de Prueba de Pagos](Documentos/PAYMENT_TEST_CASES.md) - Casos de prueba detallados
- 📖 [Guía de Testing](Documentos/TESTING_GUIDE.md) - Instrucciones para ejecutar tests
- 📊 [Resumen de Testing](Documentos/TESTING_SUMMARY.md) - Resumen de completitud
- ⚡ [Quick Start Testing](Documentos/QUICK_START_TESTING.md) - Inicio rápido en 5 minutos
- 📄 [Documentación Completa de Pagos](Documentos/PAYMENT_DOCUMENTATION_COMPLETE.md) - Resumen ejecutivo

## 🔄 Changelog

### Fase 2 (Actual) - Septiembre 2025
- ✅ Sistema de autenticación JWT completo
- ✅ Panel administrativo funcional con gestión de inventario
- ✅ Control de stock en tiempo real con descuento automático
- ✅ Integración WebPay Plus operativa
- ✅ Frontend React moderno con TailwindCSS
- ✅ Sistema de tallas preparado (no activado)
- ✅ Gestión de imágenes múltiples con Cloudinary
- ✅ API RESTful robusta y segura

### Fase 1 - Septiembre 2025
- 📋 Documentación del proyecto
- 🎨 Diseño de wireframes y mockups
- 📊 Modelado de base de datos
- 📋 Planificación y casos de uso

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

Este es un proyecto académico para el programa APT122. Las contribuciones están limitadas al equipo de desarrollo actual.

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:

- 📧 Email: contacto@testheb.cl
- 🐛 Issues: [GitHub Issues](https://github.com/sebamellaisla-sketch/2025_MA_CAPSTONE_705D_GRUPO_7/issues)
- 📚 Documentación: Ver archivos `.md` en el repositorio

---

<div align="center">

**🧵 TESTheb - Bordados Personalizados 🧵**

*Desarrollado con ❤️ por Francisco Campos & Sebastian Mella*

*APT122 - Capstone Project 2025*

</div>
