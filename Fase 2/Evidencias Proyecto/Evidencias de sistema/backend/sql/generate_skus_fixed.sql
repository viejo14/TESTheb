-- Script corregido para generar SKUs automáticos para productos existentes
-- Formato: [CATEGORIA]-[ID_PRODUCTO]-[TALLA]
-- Ejemplo: BOR-12-M (Bordados, producto 12, talla M)

-- OPCIÓN 1: Actualizar productos CON categoría
UPDATE products p
SET sku = CONCAT(
    UPPER(SUBSTRING(c.name FROM 1 FOR 3)),
    '-',
    p.id,
    '-',
    COALESCE(s.name, 'U')
)
FROM categories c
LEFT JOIN sizes s ON p.size_id = s.id
WHERE p.category_id = c.id
  AND p.sku IS NULL;

-- OPCIÓN 2: Actualizar productos SIN categoría pero CON talla
UPDATE products p
SET sku = CONCAT('GEN-', p.id, '-', s.name)
FROM sizes s
WHERE p.category_id IS NULL
  AND p.size_id = s.id
  AND p.sku IS NULL;

-- OPCIÓN 3: Actualizar productos SIN categoría y SIN talla
UPDATE products
SET sku = CONCAT('GEN-', id, '-U')
WHERE category_id IS NULL
  AND size_id IS NULL
  AND sku IS NULL;

-- Verificar resultados
SELECT
    p.id,
    p.sku,
    p.name AS producto,
    c.name AS categoria,
    s.name AS talla,
    p.stock
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN sizes s ON p.size_id = s.id
ORDER BY p.id;
