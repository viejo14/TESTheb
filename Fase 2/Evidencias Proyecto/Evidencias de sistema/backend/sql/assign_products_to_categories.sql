-- Asignar productos existentes a categorías apropiadas
-- ID 8: Colegios
-- ID 9: Empresas/Pymes
-- ID 10: Mascotas
-- ID 11: Diseño Personalizado

-- Asignar productos
UPDATE products SET category_id = 8, updated_at = NOW() WHERE id = 3; -- Polerón Niño -> Colegios
UPDATE products SET category_id = 9, updated_at = NOW() WHERE id = 1; -- Polera Hombre -> Empresas/Pymes
UPDATE products SET category_id = 9, updated_at = NOW() WHERE id = 4; -- Camiseta Polo Bordada -> Empresas/Pymes
UPDATE products SET category_id = 11, updated_at = NOW() WHERE id = 2; -- Vestido Mujer -> Diseño Personalizado
UPDATE products SET category_id = 10, updated_at = NOW() WHERE id = 5; -- Calcetín -> Mascotas
UPDATE products SET category_id = 11, updated_at = NOW() WHERE id = 7; -- Pantalón -> Diseño Personalizado

-- Verificar asignaciones
SELECT
    p.id,
    p.name,
    p.category_id,
    c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.id;