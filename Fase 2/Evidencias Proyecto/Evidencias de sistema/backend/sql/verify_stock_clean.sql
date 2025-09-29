-- Verificar datos de stock sin caracteres especiales
-- Fecha: 2025-09-28
-- Version limpia sin emojis ni acentos especiales

-- 1. Ver todos los productos con su stock y talla
SELECT 'PRODUCTOS CON STOCK Y TALLA' as info;

SELECT
    p.id,
    p.name,
    p.price,
    s.name as talla,
    s.display_name as talla_completa,
    p.stock,
    CASE
        WHEN p.stock > 0 THEN 'CON STOCK'
        ELSE 'SIN STOCK'
    END as estado,
    p.created_at,
    p.updated_at
FROM products p
LEFT JOIN sizes s ON p.size_id = s.id
ORDER BY p.updated_at DESC;

-- 2. Ver el producto mas recientemente actualizado
SELECT 'PRODUCTO MAS RECIENTE' as info;

SELECT
    p.id,
    p.name,
    p.stock,
    s.name as talla,
    p.updated_at as ultima_actualizacion
FROM products p
LEFT JOIN sizes s ON p.size_id = s.id
ORDER BY p.updated_at DESC
LIMIT 1;

-- 3. Contar productos por nivel de stock
SELECT 'RESUMEN DE STOCK' as info;

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

-- 4. Verificar que los campos se actualizan correctamente
SELECT 'VERIFICACION DE ACTUALIZACION' as info;

SELECT
    COUNT(*) as total_productos,
    COUNT(CASE WHEN stock > 0 THEN 1 END) as productos_con_stock,
    COUNT(CASE WHEN size_id IS NOT NULL THEN 1 END) as productos_con_talla,
    AVG(stock) as promedio_stock
FROM products;

-- 5. Mostrar productos ordenados por stock
SELECT 'PRODUCTOS ORDENADOS POR STOCK' as info;

SELECT
    p.name,
    COALESCE(s.name, 'SIN TALLA') as talla,
    p.stock,
    p.price
FROM products p
LEFT JOIN sizes s ON p.size_id = s.id
ORDER BY p.stock DESC, p.name;