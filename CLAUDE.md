# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TESTheb is an e-commerce platform for personalized embroidery ("bordados personalizados"). It's a full-stack application built for Chilean market with Transbank WebPay integration.

**Tech Stack:**
- **Backend:** Node.js (ES Modules), Express 5.x, PostgreSQL, JWT auth
- **Frontend:** React 19, Vite, TailwindCSS 4.x, React Router, Framer Motion
- **Integrations:** Cloudinary (images), Transbank SDK (payments), Nodemailer (emails)

## Repository Structure

```
testheb.cl/
├── backend/              # Node.js/Express API
│   ├── server.js         # Main entry point
│   ├── src/
│   │   ├── config/       # Database, Cloudinary, email, Transbank, logger
│   │   ├── controllers/  # Business logic handlers
│   │   ├── middleware/   # Auth (JWT), validation (Joi), error handling
│   │   ├── models/       # Database queries (direct pg pool, no ORM)
│   │   ├── routes/       # Express route definitions
│   │   ├── services/     # Email service
│   │   ├── validators/   # Joi schemas for request validation
│   │   └── __tests__/    # Jest tests (52 tests, 100% passing)
│   ├── sql/              # Database schema and seed data
│   ├── scripts/          # Dev utilities (debugging, manual testing)
│   └── load-tests/       # Artillery performance tests
│
└── frontend/             # React SPA
    ├── src/
    │   ├── pages/        # Route components (HomePage, CatalogPage, etc.)
    │   ├── components/   # Reusable UI components
    │   ├── context/      # React Context (AuthContext, CartContext)
    │   ├── services/     # API client functions
    │   ├── config/       # API configuration
    │   └── hooks/        # Custom React hooks
    └── public/           # Static assets
```

## Common Development Commands

### Backend

```bash
cd backend

# Development with hot reload
npm run dev

# Production
npm start

# Testing
npm test                    # Run all tests (52 tests)
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage report

# Load/Performance Testing
npm run load:test          # Basic load test
npm run load:auth          # Auth endpoint test
npm run load:webpay        # Payment flow test
npm run load:stress        # Stress test with report
npm run load:homepage      # Homepage performance
```

### Frontend

```bash
cd frontend

# Development server (runs on http://localhost:5173)
npm run dev

# Production build
npm run build
npm run preview    # Preview production build

# Linting
npm run lint
```

### Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE bordados_testheb;"

# Apply schema and seed data
psql -U postgres -d bordados_testheb -f backend/sql/schema_completo.sql
psql -U postgres -d bordados_testheb -f backend/sql/seed_data.sql
```

## Architecture Patterns

### Backend Architecture

**Layered Architecture:**
1. **Routes** (`src/routes/`) - Define HTTP endpoints and apply middleware
2. **Middleware** - Authentication (`auth.js`), validation (`validate.js`), error handling
3. **Controllers** (`src/controllers/`) - Handle requests, call models, return responses
4. **Models** (`src/models/`) - Direct PostgreSQL queries using `pg` pool (no ORM)
5. **Validators** (`src/validators/`) - Joi schemas for input validation

**Key Files:**
- `server.js` - Express app setup, CORS config, rate limiting, route registration
- `src/config/database.js` - PostgreSQL connection pool (max 10 connections)
- `src/middleware/auth.js` - JWT verification, role-based access control
- `src/middleware/errorHandler.js` - Global error handling

**Authentication Flow:**
- JWT-based with access tokens
- Roles: `customer`, `admin`, `employee`, `client`
- Protected routes use `authenticateToken` middleware
- Admin routes use `authorizeAdmin` middleware
- Tokens stored client-side, sent via Authorization header

**Database Pattern:**
- Direct SQL queries using parameterized statements (prevents SQL injection)
- Connection pooling via `pg` library
- No ORM - raw SQL for performance and control
- Migrations handled manually via SQL scripts in `backend/sql/`

### Frontend Architecture

**Component Organization:**
- **Pages** - Full page components mapped to routes
- **Components** - Reusable UI pieces (Header, Footer, ProductCard, etc.)
- **Context** - Global state (Auth user, Cart items)
- **Services** - API communication layer (`axios` calls)

**State Management:**
- React Context API for global state (auth, cart)
- Local state with `useState` for component-specific data
- `useEffect` for data fetching and side effects

**Routing:**
- React Router v7 with AnimatePresence for page transitions
- Protected routes check AuthContext before rendering
- Framer Motion for animations

**API Communication:**
- Base URL configured in `src/config/api.js`
- Development: Vite proxy forwards `/api/*` to backend (avoids CORS)
- Production: Direct API calls to backend URL
- JWT tokens included in Authorization header

### Key Integration Points

**Cloudinary (Image Upload):**
- Backend: `src/config/cloudinary.js` - configured uploader
- Upload endpoint: `POST /api/upload` (rate limited: 100/hour)
- Products support multiple images via `product_images` table

**Transbank WebPay:**
- Backend: `src/config/transbank.js` - WebpayPlus configuration
- Flow: Create transaction → Redirect to Transbank → Handle return/commit
- Routes: `src/routes/webpayRoutes.js`, `src/routes/paymentRoutes.js`
- Test in integration mode before production

**Email (Nodemailer):**
- Backend: `src/config/email.js` - Gmail/SMTP transport
- Service: `src/services/emailService.js`
- Used for: password reset, order confirmations, quotes

## Database Schema

**Core Tables:**
- `users` - Authentication and user profiles
- `categories` - Product categories
- `products` - Product catalog
- `product_images` - Multiple images per product
- `sizes` - Available sizes
- `orders` - WebPay purchase orders
- `order_items` - Line items for orders
- `quotes` - Customer quote requests
- `newsletter_subscribers` - Email newsletter list

**Important Notes:**
- All tables use `SERIAL PRIMARY KEY` for IDs
- Timestamps: `created_at`, `updated_at` (auto-updated via trigger)
- Foreign keys enforce referential integrity
- Indexes on frequently queried columns (email, category_id, etc.)

## Testing Guidelines

**Backend Tests (Jest + Supertest):**
- Location: `backend/src/__tests__/`
- Coverage: 52 tests across 4 suites (100% passing)
- Test types: Validators, Auth flow, Categories CRUD, Products CRUD
- Run before commits to ensure no regressions

**Test Structure:**
```javascript
describe('Module name', () => {
  describe('Specific feature', () => {
    it('should behave correctly', async () => {
      // Arrange - setup test data
      // Act - execute the action
      // Assert - verify results
    })
  })
})
```

**Load Testing (Artillery):**
- Location: `backend/load-tests/`
- Scenarios: basic navigation, auth flows, payment simulation
- Thresholds: p95 < 1000ms, p99 < 2000ms, error rate < 1%

## Environment Configuration

**Backend `.env`:**
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/bordados_testheb
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
TRANSBANK_COMMERCE_CODE=...
TRANSBANK_API_KEY=...
EMAIL_USER=...
EMAIL_PASS=...
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
ALLOW_SETUP=true  # Enable /api/setup/* and /api/debug/* endpoints (disable in prod)
```

**Frontend `.env.development`:**
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_API_URL=/api
```

**Frontend `.env.production`:**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Security Considerations

- JWT tokens for authentication (verify on each protected route)
- Bcrypt for password hashing (12 rounds)
- Rate limiting on auth (`200/hour`) and upload endpoints (`100/hour`)
- Joi validation on all input data
- Parameterized SQL queries (no string interpolation)
- CORS restricted to configured origins
- `X-Powered-By` header disabled
- Setup/debug endpoints protected by `ALLOW_SETUP` env var

## Special Endpoints

**Health Checks:**
- `GET /api/health` - Basic server health
- `GET /api/test-db` - Database connection test

**Setup Endpoints (only enabled if `ALLOW_SETUP=true`):**
- `GET /api/setup/create-users-table` - Initialize users table
- `GET /api/setup/update-users-table` - Migrate users table schema
- `GET /api/setup/create-orders-table` - Initialize orders table
- `GET /api/setup/create-admin` - Create admin user (admin@testheb.cl / admin123)
- `GET /api/debug/*` - Various debug/inspection endpoints

**IMPORTANT:** Disable setup endpoints in production by setting `ALLOW_SETUP=false` or removing from environment.

## Common Development Workflows

### Adding a New API Endpoint

1. Create validator schema in `backend/src/validators/`
2. Add model function in `backend/src/models/`
3. Implement controller in `backend/src/controllers/`
4. Define route in `backend/src/routes/`
5. Register route in `backend/server.js`
6. Add tests in `backend/src/__tests__/`
7. Create service function in `frontend/src/services/`
8. Use service in component/page

### Adding a New Page

1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Wrap in `PageTransition` for animations
4. Link from Header/Footer or other pages

### Database Migrations

1. Modify schema in `backend/sql/schema_completo.sql`
2. Test locally with fresh database
3. Create migration script if needed
4. Update seed data in `backend/sql/seed_data.sql` if applicable
5. Document changes

## Debugging Utilities

**Backend Scripts (`backend/scripts/`):**
- `node scripts/listTables.js` - List all database tables
- `node scripts/verify-user.js <email>` - Check user details
- `node scripts/verify-order.js <order_id>` - Inspect order
- `node scripts/test-auth-flow.js <email> <password>` - Test auth manually
- `node scripts/diagnostico-transbank.js` - Verify Transbank config

**Logging:**
- Winston logger configured in `backend/src/config/logger.js`
- Logs to console and file (`backend/logs/`)
- HTTP request logging via Morgan (currently disabled in `server.js`)

## Dependencies Notes

**Backend:**
- `express` 5.1.0 (latest major version)
- `pg` for PostgreSQL (connection pooling enabled)
- `bcrypt` for password hashing (v6.0.0)
- `jsonwebtoken` for JWT creation/verification
- `joi` for schema validation
- `multer` for file uploads
- `winston` for logging

**Frontend:**
- `react` 19.1.1 (latest)
- `react-router-dom` 7.9.1
- `axios` for HTTP requests
- `tailwindcss` 4.1.13
- `framer-motion` for animations
- `@cloudinary/react` for image components

## Development Tips

- Backend uses ES Modules (`"type": "module"` in package.json) - use `import/export`, not `require`
- Frontend dev server proxies `/api/*` to backend - use relative URLs in development
- Jest requires `--experimental-vm-modules` flag for ES Modules
- PostgreSQL pool max connections: 10 (configured in `database.js`)
- Default admin credentials: `admin@testheb.cl` / `admin123` (create via setup endpoint)
- Cloudinary images stored with public_id pattern for organization
- Transbank: use integration environment for testing before production
