🛒 TESTheb E-commerce
Sistema de E-commerce Especializado en Bordados Personalizados
📖 Descripción del Proyecto
Sistema e-commerce completo para Bordados TESTheb que automatiza cotizaciones, gestiona catálogo de productos, procesa pagos con Transbank y proporciona panel administrativo para el negocio de bordados personalizados.
Cliente: Amaro Abate - Bordados TESTheb
Duración: 18 semanas (3 fases)
Metodología: Scrum con sprints de 1-2 semanas
🎯 Objetivos Principales

✅ Automatizar cotizaciones - Reducir tiempo de 48h a 5 minutos
✅ Catálogo digital - 4 categorías especializadas de bordados
✅ Pagos seguros - Integración con Transbank WebPay Plus
✅ Panel administrativo - Gestión completa de productos y pedidos
✅ Experiencia móvil - Sistema responsive para smartphones

🛠️ Stack Tecnológico
Frontend

React 19 - Interfaz de usuario moderna
Vite 5.0+ - Build tool ultrarrápido
CSS3 Vanilla - Estilos personalizados sin frameworks

Backend

Node.js 18+ - Servidor y APIs REST
Express.js - Framework web minimalista
JWT + bcrypt - Autenticación segura

Base de Datos

PostgreSQL 14.9+ - Base de datos relacional
Modelo normalizado - Usuarios, productos, órdenes, cotizaciones

Servicios Externos

Transbank SDK - Pasarela de pagos chilena
Nodemailer - Envío de notificaciones por email

Deploy

Frontend: Vercel (serverless)
Backend: Railway (contenedores)
Base de Datos: Railway PostgreSQL

📋 Funcionalidades Principales
Para Clientes

 Registro e inicio de sesión
 Navegación de catálogo por categorías
 Carrito de compras persistente
 Proceso de checkout completo
 Pagos seguros con Transbank
 Solicitud de cotizaciones personalizadas
 Historial de pedidos

Para Administradores

 Panel de administración completo
 CRUD de productos y categorías
 Gestión de órdenes y estados
 Visualización de cotizaciones
 Métricas básicas de ventas

🏗️ Arquitectura del Sistema
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │   Base de       │
│   React 19      │◄──►│   Node.js +      │◄──►│   Datos         │
│   (Vercel)      │    │   Express.js     │    │   PostgreSQL    │
│                 │    │   (Railway)      │    │   (Railway)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Servicios      │
                       │   Externos       │
                       │                  │
                       │ • Transbank      │
                       │ • Email SMTP     │
                       └──────────────────┘
📁 Estructura del Proyecto
2025_MA_CAPSTONE_705D_GRUPO_7/
├── 📁 frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── services/        # APIs y lógica de negocio
│   │   └── utils/           # Funciones auxiliares
│   └── package.json
├── 📁 backend/               # API Node.js
│   ├── controllers/         # Lógica de endpoints
│   ├── models/             # Modelos de base de datos
│   ├── routes/             # Definición de rutas
│   ├── middleware/         # Autenticación, validaciones
│   └── package.json
├── 📁 docs/                 # Documentación del proyecto
│   ├── api/                # Documentación de APIs
│   ├── diagrams/           # UML, MER, wireframes
│   └── guides/             # Guías técnicas
└── README.md               # Este archivo
🚀 Instalación y Setup
Requisitos Previos

Node.js 18.18.0 o superior
PostgreSQL 14.9 o superior
Git instalado

Instalación Rápida
bash# 1. Clonar repositorio
git clone https://github.com/fcampos/testheb-ecommerce.git
cd testheb-ecommerce

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
npm run migrate
npm run seed

# 3. Setup Frontend  
cd ../frontend
npm install
cp .env.example .env

# 4. Ejecutar en desarrollo
# Terminal 1 (Backend):
cd backend && npm run dev

# Terminal 2 (Frontend):
cd frontend && npm run dev
Verificación

Frontend: http://localhost:5173
Backend: http://localhost:3000
API Health: http://localhost:3000/api/health

📖 Ver Guía Completa de Instalación
📊 Estado del Proyecto
✅ Fase 1 - Planificación (Semanas 1-7) - COMPLETADA

 Análisis de requerimientos y validación con cliente
 Diseño de arquitectura y stack tecnológico
 Product Backlog con 15 historias de usuario priorizadas
 Wireframes y mockups de interfaces principales
 Documentación técnica completa (APIs, instalación, calidad)
 Setup de herramientas y metodología Scrum

🚧 Fase 2 - Desarrollo (Semanas 8-12) - EN PROGRESO

 Sistema de autenticación y usuarios
 CRUD de productos y categorías
 Carrito de compras y checkout
 Integración con Transbank WebPay Plus
 Sistema de cotizaciones
 Panel administrativo básico

📅 Fase 3 - Cierre (Semanas 13-18) - PENDIENTE

 Testing completo y optimización
 Deploy a producción
 Documentación de usuario final
 Capacitación al cliente
 Entrega y cierre del proyecto

👥 Equipo de Desarrollo
RolNombreResponsabilidadesContactoProject Manager / Backend DevFrancisco CamposGestión proyecto, APIs, Base de datosfrancisco.campos@duocuc.clFrontend Dev / QA LeaderSebastian MellaInterfaces React, Testing, Calidadsebastian.mella@duocuc.clProduct Owner / ClienteAmaro AbateRequerimientos, Validaciónamaro@testheb.com
📚 Documentación
📋 Gestión del Proyecto

📄 Acta de Constitución
📊 Product Backlog
📅 Cronograma Gantt
🎯 Matriz RACI
⚠️ Gestión de Riesgos

🛠️ Documentación Técnica

🏗️ Ficha Técnica del Sistema
🔌 Documentación API Usuarios
⚙️ Guía de Instalación
📐 Diagramas UML
🗃️ Modelo de Base de Datos

🎨 Diseño y UX

🖼️ Wireframes
🎭 Mockups
👤 Casos de Uso

🔄 Metodología de Trabajo
Scrum Framework

Sprints: 1-2 semanas
Sprint Planning: Inicio de cada sprint
Daily Standup: Coordinación diaria del equipo
Sprint Review: Demo al cliente cada sprint
Sprint Retrospective: Mejora continua del proceso

Control de Calidad

Definition of Done (DoD) para cada tipo de entregable
Code Review obligatorio en Pull Requests
Testing manual y automatizado por Sebastian (QA)
Validación continua con cliente Amaro

Herramientas

Gestión: GitHub Projects, Excel
Comunicación: WhatsApp, Email, Google Meet
Desarrollo: VS Code, Git, GitHub
Diseño: Figma, Draw.io

🎯 Próximos Hitos
HitoFechaDescripciónSetup Técnico CompletoSemana 8Repositorio, base de datos, CI/CD básicoSistema Base FuncionandoSemana 10Autenticación, CRUD productos, MVP básicoMVP CompletoSemana 12Carrito, pagos Transbank, panel adminSistema en ProducciónSemana 15Deploy completo, testing, optimizaciónEntrega FinalSemana 18Documentación, capacitación, cierre
🤝 Contribución
Este es un proyecto académico cerrado, pero se aceptan sugerencias y feedback del cliente Amaro Abate y evaluadores académicos.
Convenciones de Desarrollo

Ramas: feature/nombre-funcionalidad, bugfix/descripcion
Commits: [FEAT] Descripción / [BUG] Descripción / [DOCS] Descripción
Pull Requests: Revisión obligatoria antes de merge a main

📄 Licencia
Proyecto académico - Duoc UC
©2025 Francisco Campos, Sebastian Mella - Todos los derechos reservados
📞 Contacto
Para consultas sobre el proyecto:

Issues: GitHub Issues
Email Equipo: francisco.campos@duocuc.cl
Cliente: amaro@testheb.com


Última actualización: Septiembre 2025 - Fase 1 Completada
Próxima revisión: Inicio Fase 2 - Semana 8
