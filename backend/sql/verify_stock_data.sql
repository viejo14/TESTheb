-- Verificar que los datos de stock se guardan correctamente en la base de datos
-- Fecha: 2025-09-28

-- 1. Ver todos los productos con su stock y talla
SELECT
    'PRODUCTOS CON STOCK Y TALLA' as info;

SELECT
    p.id,
    p.name,
    p.price,
    s.name as talla,
    s.display_name as talla_completa,
    p.stock,
    CASE
        WHEN p.stock > 0 THEN '✅ CON STOCK'
        ELSE '❌ SIN STOCK'
    END as estado,
    p.created_at,
    p.updated_at
FROM products p
LEFT JOIN sizes s ON p.size_id = s.id
ORDER BY p.updated_at DESC;

-- 2. Ver estructura actual de la tabla products
SELECT
    'ESTRUCTURA DE TABLA PRODUCTS' as info;

SELECT
    column_name as "CAMPO",
    data_type as "TIPO",
    is_nullable as "PERMITE_NULL"
FROM information_schema.columns
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Ver el producto más recientemente actualizado (debería ser tu prueba)
SELECT
    'PRODUCTO MÁS RECIENTE' as info;

SELECT
    p.id,
    p.name,
    p.stock,
    s.name as talla,
    p.updated_at as "ultima_actualizacion"
FROM products p
LEFT JOIN sizes s ON p.size_id = s.id
ORDER BY p.updated_at DESC
LIMIT 1;

-- 4. Contar productos por nivel de stock
SELECT
    'RESUMEN DE STOCK' as info;

SELECT
    CASE
        WHEN stock = 0 THEN 'Sin stock'
        WHEN stock BETWEEN 1 AND 5 THEN 'Stock bajo (1-5)'
        WHEN stock BETWEEN 6 AND 20 THEN 'Stock medio (6-20)'
        ELSE 'Stock alto (20+)'
    END as nivel_stock,
    COUNT(*) as cantidad_productos
FROM products
GROUP BY
    CASE
        WHEN stock = 0 THEN 'Sin stock'
        WHEN stock BETWEEN 1 AND 5 THEN 'Stock bajo (1-5)'
        WHEN stock BETWEEN 6 AND 20 THEN 'Stock medio (6-20)'
        ELSE 'Stock alto (20+)'
    END
ORDER BY cantidad_productos DESC;