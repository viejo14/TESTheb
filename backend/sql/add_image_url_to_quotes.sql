-- Agregar campo image_url a la tabla quotes
ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Comentario sobre el nuevo campo
COMMENT ON COLUMN quotes.image_url IS 'URL de la imagen de referencia adjunta a la cotización (opcional)';
