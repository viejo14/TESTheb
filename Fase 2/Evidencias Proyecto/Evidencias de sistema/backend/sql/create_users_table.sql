-- Crear tabla de usuarios para TESTheb
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'employee')),
  active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at en cada UPDATE
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar usuario administrador por defecto
INSERT INTO users (name, email, password_hash, role, active, email_verified)
VALUES (
  'Administrador TESTheb',
  'admin@testheb.cl',
  -- Contraseña: admin123 (hash generado con bcrypt, salt rounds: 12)
  '$2b$12$LQv3c1yqBwEHxkbxdUlhre3wd7uw8zZZhq0dJ8UwuOLc5vfJ6K5Ae',
  'admin',
  true,
  true
)
ON CONFLICT (email) DO NOTHING;

-- Comentarios sobre la tabla
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema TESTheb';
COMMENT ON COLUMN users.id IS 'ID único del usuario';
COMMENT ON COLUMN users.name IS 'Nombre completo del usuario';
COMMENT ON COLUMN users.email IS 'Email único del usuario (usado para login)';
COMMENT ON COLUMN users.password_hash IS 'Hash de la contraseña usando bcrypt';
COMMENT ON COLUMN users.role IS 'Rol del usuario: customer, admin, employee';
COMMENT ON COLUMN users.active IS 'Estado activo/inactivo del usuario';
COMMENT ON COLUMN users.email_verified IS 'Estado de verificación del email';
COMMENT ON COLUMN users.email_verification_token IS 'Token para verificación de email';
COMMENT ON COLUMN users.password_reset_token IS 'Token para reset de contraseña';
COMMENT ON COLUMN users.password_reset_expires IS 'Expiración del token de reset';
COMMENT ON COLUMN users.last_login IS 'Última vez que el usuario inició sesión';
COMMENT ON COLUMN users.created_at IS 'Fecha de creación del usuario';
COMMENT ON COLUMN users.updated_at IS 'Fecha de última actualización';

-- Mostrar información de la tabla creada
SELECT
    'users' as table_name,
    count(*) as total_rows,
    count(*) FILTER (WHERE role = 'admin') as admin_users,
    count(*) FILTER (WHERE role = 'customer') as customer_users,
    count(*) FILTER (WHERE active = true) as active_users
FROM users;