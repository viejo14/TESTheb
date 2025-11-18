# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TESTheb is a full-stack e-commerce platform for customized embroidery products. It features JWT authentication, admin panel, WebPay payment integration, real-time inventory management with automatic stock deduction, and Cloudinary image hosting.

**Tech Stack:**
- Frontend: React 19 + Vite + TailwindCSS 4 + Framer Motion
- Backend: Node.js + Express 5 + PostgreSQL 15
- Services: Cloudinary (images), Transbank WebPay (payments), Winston (logging)

## Development Commands

### Backend (Node.js + Express)
```bash
cd backend
npm install                    # Install dependencies
npm run dev                    # Development with nodemon (hot reload)
npm start                      # Production mode
npm test                       # Run Jest tests
npm run test:watch            # Watch mode for tests
npm run test:coverage         # Generate coverage report
```

### Frontend (React + Vite)
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Development server (http://localhost:5173)
npm run build                  # Production build
npm run preview               # Preview production build
npm run lint                   # ESLint check
```

### Database Setup
```bash
# Create database
createdb bordados_testheb

# Run migrations in order
psql -d bordados_testheb -f backend/sql/create_users_table.sql
psql -d bordados_testheb -f backend/sql/implement_simple_system.sql
psql -d bordados_testheb -f backend/sql/create_orders_table.sql
```

Alternatively, use the temporary setup endpoints:
- `GET /api/setup/create-users-table` - Creates users table with admin
- `GET /api/setup/create-orders-table` - Creates orders table
- `GET /api/setup/create-admin` - Creates admin@testheb.cl with password "admin123"

## Architecture & Key Patterns

### Authentication Flow
- **JWT-based** with access tokens (24h) and refresh tokens (7d)
- Middleware: `authenticateToken`, `requireRole(...roles)`, `optionalAuth`
- Auth stored in: `localStorage` (user, token, refreshToken)
- Frontend: `AuthContext` manages auth state globally
- Backend validates tokens on every protected route and checks user still exists/active in DB

### Database Design
The system uses a **simplified single-size-per-product model**:
- Each `product` has ONE `size_id` and ONE `stock` value
- No `product_sizes` join table (removed in migration `implement_simple_system.sql`)
- Stock is decremented automatically on successful payment via `OrderItem.createMany()`
- Key tables: `users`, `products`, `categories`, `sizes`, `orders`, `order_items`, `product_images`

### Payment Flow (WebPay)
1. Frontend calls `POST /api/webpay/create` with cart data
2. Backend creates transaction in Transbank, saves order as `status: 'created'`
3. User redirected to WebPay
4. After payment, WebPay redirects to `POST /api/webpay/commit`
5. Backend verifies transaction, updates order status, **decrements stock**, creates `order_items`
6. Frontend polls or redirects to `/payment-result?token=XXX` to display result

**Stock Deduction:** Happens in `backend/src/models/OrderItem.js` in `createMany()` method using:
```sql
UPDATE products SET stock = GREATEST(stock - $1, 0), updated_at = NOW() WHERE id = $2
```

### File Upload (Cloudinary)
- Products support multiple images via `product_images` table
- Upload: `POST /api/upload/image` (admin only, rate-limited to 100/hour)
- Delete: `DELETE /api/upload/image/:publicId`
- Config: `backend/src/config/cloudinary.js`

### Frontend State Management
- **AuthContext** (`frontend/src/context/AuthContext.jsx`): user, login, logout, token refresh
- **CartContext** (`frontend/src/context/CartContext.jsx`): cart items, add/remove, totals
- React Router v7 for routing
- Framer Motion for page transitions

### Backend Structure
- **Controllers** (`backend/src/controllers/`): Business logic (auth, products, categories, webpay, etc.)
- **Models** (`backend/src/models/`): Database query encapsulation (Product, Order, User, etc.)
- **Middleware** (`backend/src/middleware/`): auth.js (JWT), errorHandler.js, validate.js
- **Routes** (`backend/src/routes/`): API endpoint definitions
- **Validators** (`backend/src/validators/`): Joi schemas for input validation

### Frontend Structure
- **Pages** (`frontend/src/pages/`): Route components (HomePage, CatalogPage, AdminDashboard, etc.)
- **Components** (`frontend/src/components/`): Reusable UI (ProductCard, Header, admin components)
- **Services** (`frontend/src/services/`): API calls (api.js, cloudinaryService.js, uploadService.js)
- **Hooks** (`frontend/src/hooks/`): Custom React hooks
- **Utils** (`frontend/src/utils/`): Helper functions

## Important Implementation Details

### Rate Limiting
- **Global rate limiting is DISABLED** to allow e-commerce browsing freedom
- Rate limiting ONLY on critical endpoints:
  - `/api/auth/*` - 200 requests/hour (auth operations)
  - `/api/upload/*` - 100 uploads/hour (file operations)
- Rationale: B2C e-commerce needs unrestricted navigation for customers

### Security Practices
- `x-powered-by` header disabled
- JWT secrets MUST be in environment variables (crashes if missing)
- Passwords hashed with bcrypt (12 salt rounds)
- CORS enabled for frontend
- Admin-only routes protected with `requireRole('admin')`
- Never return password_hash in API responses

### Database Connection
- PostgreSQL pool with 10 max connections
- Connection validated on startup
- All queries logged with duration via Winston
- Uses parameterized queries ($1, $2) to prevent SQL injection

### Logging
- Winston logger in `backend/src/config/logger.js`
- Logs to `backend/logs/` directory
- HTTP request logging (morgan) is currently DISABLED
- Query logging enabled for debugging

### Environment Variables
Backend requires (see `backend/.env.example`):
```
DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
WEBPAY_ENVIRONMENT (integration/production)
TBK_COMMERCE_CODE, TBK_API_KEY (for production WebPay)
BACKEND_URL, FRONTEND_URL
```

### Testing
- Jest configured for ES modules (`"type": "module"`)
- Test command uses `--experimental-vm-modules`
- Existing tests: auth, categories, products, validators
- Tests located in `backend/src/__tests__/`

## Common Development Scenarios

### Adding a New API Endpoint
1. Create/update controller in `backend/src/controllers/`
2. Create route in `backend/src/routes/`
3. Add validation schema in `backend/src/validators/` if needed
4. Register route in `backend/server.js`
5. Add frontend API call in `frontend/src/services/api.js`
6. Test with Jest in `backend/src/__tests__/`

### Adding a New Database Table
1. Create SQL migration in `backend/sql/`
2. Run migration: `psql -d bordados_testheb -f backend/sql/your_migration.sql`
3. Create model in `backend/src/models/`
4. Add CRUD operations to controller

### Modifying Product Stock System
- Stock is managed per product (NOT per size variant)
- To change: modify `backend/src/models/Product.js` and related controllers
- Stock deduction happens in `backend/src/models/OrderItem.js:createMany()`
- Frontend shows stock in `ProductCard` and `ProductDetailPage`

### Enabling Advanced Size System
The codebase has a prepared advanced size system (one product with multiple size variants) that is currently disabled:
1. Run migration: `psql -d bordados_testheb -f backend/sql/add_product_sizes.sql`
2. Uncomment code in `frontend/src/components/admin/ProductForm.jsx`
3. Uncomment code in `frontend/src/pages/ProductDetailPage.jsx`
4. Uncomment code in `backend/src/controllers/productController.js`
5. See `Documentos/COMO_ACTIVAR_TALLAS.md` for details

### Working with WebPay
- Test environment uses `IntegrationCommerceCodes.WEBPAY_PLUS`
- Production requires real `TBK_COMMERCE_CODE` and `TBK_API_KEY`
- All payment logic in `backend/src/controllers/webpayController.js`
- Frontend handles redirect flow in `CheckoutPage.jsx` and `PaymentResultPage.jsx`

## Project Structure Notes

- **Dual structure**: Root has active code (`backend/`, `frontend/`), while `Fase 1/` and `Fase 2/Evidencias Proyecto/` contain archived versions
- Main development happens in root-level `backend/` and `frontend/`
- Documentation in `Documentos/` folder (payment flow, testing guides, system state)
- SQL migrations in `backend/sql/` should be run in chronological order

## Admin Panel Access

Default admin credentials (for development):
- Email: `admin@testheb.cl`
- Password: `admin123`

Admin routes are prefixed with `/admin` and protected by `requireRole('admin')` middleware.

## Important Files to Review

- `backend/server.js` - Main entry point, all routes registered here
- `backend/src/config/database.js` - PostgreSQL connection pool
- `backend/src/middleware/auth.js` - JWT authentication logic
- `backend/src/models/OrderItem.js` - Stock deduction happens here
- `frontend/src/App.jsx` - Main router and context providers
- `frontend/vite.config.js` - Proxy configuration for API calls
- `backend/sql/implement_simple_system.sql` - Key migration for current product model

## Known Limitations

- Single warehouse (no multi-location inventory)
- No low-stock alerts
- No detailed inventory movement history
- No ERP features (suppliers, accounting, HR)
- Not a multi-vendor marketplace
- Admin panel does not have advanced analytics (only basic stats)
