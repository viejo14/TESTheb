-- Tabla para suscriptores del newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas rápidas por email
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Índice para filtrar por estado
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

-- Comentarios para documentación
COMMENT ON TABLE newsletter_subscribers IS 'Almacena suscriptores del newsletter';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Email del suscriptor (único)';
COMMENT ON COLUMN newsletter_subscribers.status IS 'Estado: active o unsubscribed';
COMMENT ON COLUMN newsletter_subscribers.subscribed_at IS 'Fecha de suscripción';
COMMENT ON COLUMN newsletter_subscribers.unsubscribed_at IS 'Fecha de desuscripción (si aplica)';
