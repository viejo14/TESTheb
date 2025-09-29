-- Verificar estructura actual de la base de datos
-- Para entender qué tenemos después de las migraciones

-- 1. Ver estructura de products
SELECT
    'TABLA: products' as info;

SELECT
    column_name as "COLUMNA",
    data_type as "TIPO",
    is_nullable as "NULO"
FROM information_schema.columns
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Ver estructura de product_sizes
SELECT
    'TABLA: product_sizes' as info;

SELECT
    column_name as "COLUMNA",
    data_type as "TIPO",
    is_nullable as "NULO"
FROM information_schema.columns
WHERE table_name = 'product_sizes'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Ver datos actuales en products (incluyendo el producto problema)
SELECT
    'PRODUCTOS ACTUALES' as info;

SELECT
    id,
    name,
    price,
    size_id,
    stock,
    default_stock,
    uses_sizes
FROM products
ORDER BY id;

-- 4. Ver datos en product_sizes
SELECT
    'DATOS EN PRODUCT_SIZES' as info;

SELECT
    ps.id,
    ps.product_id,
    ps.size_id,
    ps.stock,
    p.name as product_name,
    s.name as size_name
FROM product_sizes ps
LEFT JOIN products p ON ps.product_id = p.id
LEFT JOIN sizes s ON ps.size_id = s.id
ORDER BY ps.product_id;

-- 5. Identificar productos sin stock visible
SELECT
    'PRODUCTOS CON PROBLEMAS DE STOCK' as info;

SELECT
    p.id,
    p.name,
    p.stock as "stock_directo",
    p.default_stock,
    p.size_id,
    s.name as size_name,
    CASE
        WHEN p.stock IS NOT NULL THEN 'stock directo'
        WHEN p.default_stock IS NOT NULL THEN 'default_stock'
        ELSE 'SIN STOCK DEFINIDO'
    END as "fuente_stock"
FROM products p
LEFT JOIN sizes s ON p.size_id = s.id
WHERE p.name ILIKE '%chaqueta%' OR p.name ILIKE '%azul%'
ORDER BY p.id;