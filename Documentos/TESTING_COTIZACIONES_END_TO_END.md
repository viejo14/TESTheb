# 🧪 Guía de Testing End-to-End - Sistema de Cotizaciones TESTheb

## Información del Testing
- **Proyecto:** TESTheb - Sistema E-commerce Bordados
- **Funcionalidad:** Sistema de Cotizaciones
- **Fecha:** Octubre 2025
- **Responsables:** Francisco Campos, Sebastian Mella
- **Sprint:** 10 (Semana 10)

---

## 📋 Objetivo del Testing

Validar el flujo completo del sistema de cotizaciones desde que un cliente solicita una cotización hasta que el administrador la gestiona, incluyendo:

1. ✅ Formulario frontend funcional
2. ✅ Integración con API REST
3. ✅ Almacenamiento en base de datos
4. ✅ Envío automático de emails
5. ✅ Gestión desde panel admin

---

## 🔄 Flujo End-to-End Esperado

```mermaid
graph TD
    A[Cliente visita sitio] --> B[Llena formulario cotización]
    B --> C[Envía formulario]
    C --> D[API recibe datos]
    D --> E[Valida campos]
    E --> F[Guarda en PostgreSQL]
    F --> G[Email al cliente: Confirmación]
    F --> H[Email al admin: Notificación]
    G --> I[Cliente recibe confirmación]
    H --> J[Admin recibe alerta]
    J --> K[Admin revisa en panel]
    K --> L[Admin cambia estado]
    L --> M[Admin responde al cliente]
```

---

## ✅ CHECKLIST DE TESTING

### **FASE 1: Setup Inicial**
- [ ] Backend corriendo en http://localhost:3000
- [ ] Frontend corriendo en http://localhost:5173
- [ ] PostgreSQL activa con tabla `quotes`
- [ ] Variables de entorno configuradas (.env)
  - [ ] `EMAIL_USER` configurado
  - [ ] `EMAIL_PASS` configurado
  - [ ] `ADMIN_EMAIL` configurado
  - [ ] `FRONTEND_URL` configurado
  - [ ] `BACKEND_URL` configurado

### **FASE 2: Testing Frontend**

#### Test 1: Acceso al Formulario
- [ ] Navegar a página de cotizaciones
- [ ] Formulario visible y estilizado
- [ ] Todos los campos presentes:
  - [ ] Nombre
  - [ ] Email
  - [ ] Teléfono (opcional)
  - [ ] Mensaje
- [ ] Botón "Solicitar Cotización" visible

#### Test 2: Validaciones Frontend
- [ ] Intentar enviar formulario vacío → Error
- [ ] Nombre vacío → Error "Nombre requerido"
- [ ] Email inválido → Error "Email inválido"
- [ ] Email vacío → Error "Email requerido"
- [ ] Mensaje vacío → Error "Mensaje requerido"
- [ ] Email con formato correcto → Sin error
- [ ] Teléfono es opcional → Acepta vacío

#### Test 3: Envío Exitoso
- [ ] Llenar formulario con datos válidos:
  ```
  Nombre: Juan Pérez
  Email: juan.test@testheb.cl
  Teléfono: +56912345678
  Mensaje: Necesito cotizar 50 poleras con logo empresa
  ```
- [ ] Click en "Solicitar Cotización"
- [ ] Loading/spinner aparece
- [ ] Mensaje de éxito aparece
- [ ] Formulario se limpia o resetea
- [ ] Redirección (si aplica)

### **FASE 3: Testing Backend API**

#### Test 4: Endpoint POST /api/cotizaciones
Usando Postman/Insomnia/cURL:

```bash
curl -X POST "http://localhost:3000/api/cotizaciones" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María González",
    "email": "maria.test@testheb.cl",
    "phone": "+56987654321",
    "message": "Necesito bordar 30 gorros con diseño personalizado"
  }'
```

**Validar respuesta:**
- [ ] Status: 201 Created
- [ ] `success: true`
- [ ] `data.id` existe (ID de cotización)
- [ ] `data.status` = "pendiente"
- [ ] `data.created_at` existe
- [ ] Mensaje incluye "email"

#### Test 5: Verificar en Base de Datos
Conectar a PostgreSQL:
```sql
SELECT * FROM quotes ORDER BY created_at DESC LIMIT 5;
```

**Validar:**
- [ ] Nueva cotización existe en BD
- [ ] Campo `name` correcto
- [ ] Campo `email` correcto
- [ ] Campo `phone` correcto
- [ ] Campo `message` correcto
- [ ] Campo `status` = 'pendiente'
- [ ] Campo `created_at` tiene timestamp

### **FASE 4: Testing Emails Automáticos**

#### Test 6: Email al Cliente (Confirmación)
- [ ] Revisar inbox de `juan.test@testheb.cl`
- [ ] Email recibido con subject: "✅ Cotización Recibida #[ID] - TESTheb"
- [ ] Remitente: TESTheb
- [ ] Email contiene:
  - [ ] Nombre del cliente
  - [ ] Número de cotización
  - [ ] Mensaje "Hemos recibido tu solicitud"
  - [ ] Próximos pasos
  - [ ] Link al sitio web
- [ ] Diseño HTML correcto (no texto plano)
- [ ] Logo/branding visible

#### Test 7: Email al Admin (Notificación)
- [ ] Revisar inbox de admin (EMAIL_ADMIN)
- [ ] Email recibido con subject: "🔔 Nueva Cotización #[ID] - TESTheb"
- [ ] Email contiene:
  - [ ] Datos del cliente (nombre, email, teléfono)
  - [ ] Mensaje completo de cotización
  - [ ] Botón "Ver en Panel Admin" con link
  - [ ] Botón "Responder al Cliente" (mailto)
  - [ ] ID de cotización visible
- [ ] Links funcionan correctamente
- [ ] Diseño profesional

### **FASE 5: Testing Panel Admin**

#### Test 8: Visualizar Cotizaciones
- [ ] Login como admin en http://localhost:5173/admin/dashboard
- [ ] Navegar a sección "Cotizaciones"
- [ ] Lista de cotizaciones visible
- [ ] Nueva cotización aparece en la lista
- [ ] Datos mostrados correctamente:
  - [ ] ID
  - [ ] Nombre cliente
  - [ ] Email cliente
  - [ ] Estado (badge "pendiente")
  - [ ] Fecha de creación

#### Test 9: Ver Detalle de Cotización
- [ ] Click en cotización específica
- [ ] Modal/página de detalle se abre
- [ ] Información completa visible:
  - [ ] Nombre completo
  - [ ] Email (con link mailto)
  - [ ] Teléfono (con link tel, si existe)
  - [ ] Mensaje completo
  - [ ] Estado actual
  - [ ] Fecha y hora de creación

#### Test 10: Cambiar Estado de Cotización
- [ ] Seleccionar cotización con estado "pendiente"
- [ ] Cambiar estado a "en_proceso"
- [ ] Guardar cambio
- [ ] Mensaje de éxito
- [ ] Badge actualizado a "en_proceso"
- [ ] Verificar en BD:
  ```sql
  SELECT status FROM quotes WHERE id = [ID];
  ```
  - [ ] Estado = 'en_proceso'

#### Test 11: Estados Múltiples
- [ ] Cambiar de "en_proceso" → "aprobada" ✅
- [ ] Cambiar de "pendiente" → "rechazada" ❌
- [ ] Filtrar por estado "pendiente" → Solo muestra pendientes
- [ ] Filtrar por estado "aprobada" → Solo muestra aprobadas

#### Test 12: Búsqueda de Cotizaciones
- [ ] Buscar por nombre cliente → Encuentra
- [ ] Buscar por email → Encuentra
- [ ] Buscar por palabra en mensaje → Encuentra
- [ ] Búsqueda case-insensitive funciona

#### Test 13: Paginación
- [ ] Crear >10 cotizaciones de prueba
- [ ] Verificar paginación funciona
- [ ] Navegar página 1 → 2 → 1
- [ ] Cambiar límite por página (10, 20, 50)

### **FASE 6: Testing de Estadísticas**

#### Test 14: Endpoint de Stats
```bash
curl -H "Authorization: Bearer [ADMIN_TOKEN]" \
  "http://localhost:3000/api/cotizaciones/stats"
```

**Validar respuesta:**
- [ ] `totalCotizaciones` > 0
- [ ] `cotizacionesByStatus` es array
- [ ] Contiene count por cada estado
- [ ] `recentCotizaciones` (últimos 30 días)

#### Test 15: Dashboard Stats (Frontend)
- [ ] Ver sección de estadísticas en admin
- [ ] Total de cotizaciones correcto
- [ ] Gráfico/contadores por estado
- [ ] Cotizaciones recientes visible

### **FASE 7: Testing de Errores**

#### Test 16: Manejo de Errores Backend
- [ ] POST sin `name` → 400 Bad Request
- [ ] POST sin `email` → 400 Bad Request
- [ ] POST sin `message` → 400 Bad Request
- [ ] POST con email inválido → 400 Bad Request
- [ ] GET cotización inexistente → 404 Not Found
- [ ] PUT sin autenticación → 401 Unauthorized
- [ ] DELETE sin rol admin → 403 Forbidden

#### Test 17: Manejo de Errores Frontend
- [ ] API caída → Mensaje error amigable
- [ ] Timeout de red → Mensaje "Intenta de nuevo"
- [ ] Email duplicado (si aplica) → Manejo correcto

### **FASE 8: Testing de Seguridad**

#### Test 18: Autenticación y Autorización
- [ ] Endpoint público POST `/api/cotizaciones` → ✅ Funciona sin auth
- [ ] Endpoint protegido GET `/api/cotizaciones` → ❌ Requiere auth
- [ ] Usuario customer intenta ver cotizaciones → ❌ 403 Forbidden
- [ ] Admin ve todas las cotizaciones → ✅ 200 OK

#### Test 19: Validación de Datos
- [ ] XSS en mensaje → Sanitizado/escapado
- [ ] SQL Injection en búsqueda → Protegido (prepared statements)
- [ ] HTML tags en campos → Escapados en email

### **FASE 9: Testing de Performance**

#### Test 20: Carga y Respuesta
- [ ] POST cotización responde en <500ms
- [ ] GET lista de cotizaciones <1s (con 100+ registros)
- [ ] Emails se envían async (no bloquean respuesta)
- [ ] Frontend responsive en diferentes dispositivos

---

## 📊 CASOS DE PRUEBA DETALLADOS

### Caso 1: Cliente solicita cotización (Happy Path)

**Pre-condiciones:**
- Sistema corriendo
- BD conectada
- Email configurado

**Pasos:**
1. Usuario navega a formulario
2. Completa campos:
   - Nombre: "Carlos Ramírez"
   - Email: "carlos@empresa.cl"
   - Teléfono: "+56945678901"
   - Mensaje: "Necesito cotizar uniformes corporativos"
3. Click "Solicitar Cotización"

**Resultado Esperado:**
- ✅ Mensaje: "Cotización enviada exitosamente"
- ✅ Email confirmación a carlos@empresa.cl
- ✅ Email notificación a admin
- ✅ Cotización en BD con status "pendiente"
- ✅ Visible en panel admin

---

### Caso 2: Admin gestiona cotización

**Pre-condiciones:**
- Cotización existe con ID=5, status="pendiente"
- Admin autenticado

**Pasos:**
1. Login como admin
2. Ir a "Cotizaciones"
3. Buscar cotización #5
4. Abrir detalle
5. Cambiar estado a "en_proceso"
6. Guardar

**Resultado Esperado:**
- ✅ Estado actualizado en BD
- ✅ Badge en UI muestra "en_proceso"
- ✅ Log registrado en sistema

---

### Caso 3: Validación de email inválido

**Pasos:**
1. Llenar formulario con email: "correo_invalido"
2. Click "Solicitar Cotización"

**Resultado Esperado:**
- ❌ Error: "Formato de email inválido"
- ❌ No se envía al backend
- ❌ No se crea cotización en BD

---

## 🐛 REGISTRO DE BUGS ENCONTRADOS

| # | Descripción | Severidad | Estado | Responsable |
|---|-------------|-----------|--------|-------------|
| 1 | Email no llega si SMTP mal configurado | Alta | ⏳ | Francisco |
| 2 | Paginación falla con >100 registros | Media | ⏳ | Sebastian |
| 3 | ... | ... | ... | ... |

---

## 📝 CHECKLIST DE VARIABLES DE ENTORNO

### Backend (.env)
```bash
# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/bordados_testheb

# Email (Gmail/Outlook/etc)
EMAIL_USER=testheb@gmail.com
EMAIL_PASS=app_password_here
ADMIN_EMAIL=admin@testheb.cl
EMAIL_FROM_NAME=TESTheb

# URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your-secret-key
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000/api
```

---

## 🚀 COMANDOS ÚTILES PARA TESTING

### Iniciar servicios
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: PostgreSQL
psql -U postgres -d bordados_testheb
```

### Limpiar datos de prueba
```sql
-- Eliminar todas las cotizaciones de prueba
DELETE FROM quotes WHERE email LIKE '%test%';

-- Reset auto-increment
ALTER SEQUENCE quotes_id_seq RESTART WITH 1;
```

### Testing con cURL
```bash
# Crear cotización
curl -X POST http://localhost:3000/api/cotizaciones \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.cl","message":"Test message"}'

# Listar cotizaciones (requiere auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/cotizaciones

# Ver estadísticas
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/cotizaciones/stats
```

---

## ✅ CRITERIOS DE ACEPTACIÓN

El sistema de cotizaciones se considera **COMPLETO** si:

1. ✅ Cliente puede enviar cotización sin autenticarse
2. ✅ Datos se guardan correctamente en PostgreSQL
3. ✅ Cliente recibe email de confirmación inmediato
4. ✅ Admin recibe email de notificación inmediato
5. ✅ Admin puede ver todas las cotizaciones en panel
6. ✅ Admin puede cambiar estado de cotizaciones
7. ✅ Búsqueda y filtros funcionan correctamente
8. ✅ Validaciones frontend y backend operativas
9. ✅ Manejo de errores apropiado
10. ✅ Performance aceptable (<2s para todas las operaciones)

---

## 📅 TIMELINE DE TESTING

| Fase | Tiempo Estimado | Responsable | Completado |
|------|-----------------|-------------|------------|
| Setup inicial | 30 min | Ambos | ⏳ |
| Testing frontend | 1 hora | Sebastian | ⏳ |
| Testing backend | 1 hora | Francisco | ⏳ |
| Testing emails | 30 min | Francisco | ⏳ |
| Testing admin panel | 1 hora | Sebastian | ⏳ |
| Testing errores | 30 min | Ambos | ⏳ |
| Documentar bugs | 30 min | Ambos | ⏳ |
| **TOTAL** | **5 horas** | | ⏳ |

---

## 📞 CONTACTOS

**En caso de problemas:**
- **Francisco Campos** - Backend, Emails, BD
- **Sebastian Mella** - Frontend, UI/UX

**Recursos:**
- Documentación API: `Documentos/COTIZACIONES_API_DOCS.md`
- Issues GitHub: [link]
- Postman Collection: `Documentos/TESTheb_API.postman_collection.json`

---

**Documento generado:** Octubre 2025
**Versión:** 1.0
**Estado:** Listo para testing 🧪
