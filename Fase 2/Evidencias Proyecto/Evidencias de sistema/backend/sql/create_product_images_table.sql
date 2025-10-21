-- Crear tabla para múltiples imágenes de productos
-- Esta tabla permitirá que cada producto tenga hasta 4 imágenes

CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice para mejorar performance en búsquedas por producto
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(product_id, is_primary);

-- Migrar imagen actual de productos a la nueva tabla
-- Solo migrar si hay una imagen_url válida
INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT 
  id,
  image_url,
  0 as display_order,
  true as is_primary
FROM products
WHERE image_url IS NOT NULL AND image_url != ''
ON CONFLICT DO NOTHING;

COMMENT ON TABLE product_images IS 'Tabla para almacenar múltiples imágenes por producto (máximo 4)';
COMMENT ON COLUMN product_images.display_order IS 'Orden de visualización de las imágenes (0-3)';
COMMENT ON COLUMN product_images.is_primary IS 'Indica si es la imagen principal del producto';
