# 📁 Carpeta SQL - TESTheb Backend

Esta carpeta contiene los archivos SQL para la base de datos del proyecto TESTheb.

## 📋 Archivos disponibles:

### 🏗️ **Estructura de base de datos:**
- **`schema_completo.sql`** - Esquema completo de la base de datos (todas las tablas, índices, funciones)
- **`seed_data.sql`** - Datos iniciales (categorías, tallas, usuario admin por defecto)

### 🔍 **Utilidades de debugging:**
- **`check_current_structure.sql`** - Consultas para verificar estructura actual
- **`show_database_structure.sql`** - Muestra información detallada de las tablas
- **`consultas_ventas.sql`** - Consultas analíticas de ventas

### 📦 **Backup automático:**
- **`ACTUAL_schema.sql`** - Backup automático del esquema actual (generado por pg_dump)
- **`ACTUAL_tables_list.txt`** - Lista de tablas actuales

---

## 🚀 Uso de los archivos:

### **Para crear una base de datos desde cero:**

```bash
# 1. Crear base de datos
psql -U postgres -c "CREATE DATABASE bordados_testheb;"

# 2. Aplicar esquema
psql -U postgres -d bordados_testheb -f schema_completo.sql

# 3. Insertar datos iniciales
psql -U postgres -d bordados_testheb -f seed_data.sql
```

### **Con Docker:**

```bash
# 1. Copiar archivo al contenedor
docker cp schema_completo.sql testheb-postgres:/tmp/

# 2. Ejecutar
docker exec -i testheb-postgres psql -U postgres -d bordados_testheb -f /tmp/schema_completo.sql
```

---

## 📊 Tablas principales:

1. **categories** - Categorías de productos
2. **sizes** - Tallas disponibles
3. **products** - Productos de la tienda
4. **product_images** - Imágenes de productos (múltiples por producto)
5. **users** - Usuarios del sistema
6. **orders** - Órdenes de compra (WebPay)
7. **order_items** - Items de cada orden
8. **quotes** - Cotizaciones de clientes
9. **newsletter_subscribers** - Suscriptores del newsletter

---

## ⚠️ Notas importantes:

- **NO modificar** `ACTUAL_schema.sql` (es generado automáticamente)
- Los archivos `schema_completo.sql` y `seed_data.sql` son los maestros para recrear la BD
- Siempre hacer backup antes de ejecutar migraciones

---

**Última actualización:** 2025-01-27
