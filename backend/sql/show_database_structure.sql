-- Consulta para mostrar la estructura completa de la base de datos
-- Fecha: 2025-09-28

-- 1. Mostrar todas las tablas
SELECT
    table_name as "TABLA",
    table_type as "TIPO"
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Mostrar columnas de cada tabla principal
SELECT
    'TABLA: users' as info;

SELECT
    column_name as "COLUMNA",
    data_type as "TIPO",
    is_nullable as "NULO",
    column_default as "DEFAULT"
FROM information_schema.columns
WHERE table_name = 'users'
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT
    'TABLA: categories' as info;

SELECT
    column_name as "COLUMNA",
    data_type as "TIPO",
    is_nullable as "NULO",
    column_default as "DEFAULT"
FROM information_schema.columns
WHERE table_name = 'categories'
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT
    'TABLA: products' as info;

SELECT
    column_name as "COLUMNA",
    data_type as "TIPO",
    is_nullable as "NULO",
    column_default as "DEFAULT"
FROM information_schema.columns
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT
    'TABLA: sizes' as info;

SELECT
    column_name as "COLUMNA",
    data_type as "TIPO",
    is_nullable as "NULO",
    column_default as "DEFAULT"
FROM information_schema.columns
WHERE table_name = 'sizes'
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT
    'TABLA: product_sizes' as info;

SELECT
    column_name as "COLUMNA",
    data_type as "TIPO",
    is_nullable as "NULO",
    column_default as "DEFAULT"
FROM information_schema.columns
WHERE table_name = 'product_sizes'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Mostrar vistas
SELECT
    'VISTAS DISPONIBLES' as info;

SELECT
    table_name as "VISTA"
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- 4. Mostrar datos de tallas disponibles
SELECT
    'TALLAS DISPONIBLES' as info;

SELECT
    id,
    name as "TALLA",
    display_name as "NOMBRE_COMPLETO",
    sort_order as "ORDEN",
    active as "ACTIVO"
FROM sizes
ORDER BY sort_order;

-- 5. Contar registros en cada tabla
SELECT
    'CONTEO DE REGISTROS' as info;

SELECT
    'users' as tabla,
    COUNT(*) as total
FROM users
UNION ALL
SELECT
    'categories' as tabla,
    COUNT(*) as total
FROM categories
UNION ALL
SELECT
    'products' as tabla,
    COUNT(*) as total
FROM products
UNION ALL
SELECT
    'sizes' as tabla,
    COUNT(*) as total
FROM sizes
UNION ALL
SELECT
    'product_sizes' as tabla,
    COUNT(*) as total
FROM product_sizes;