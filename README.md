# Eventra Bihar

Eventra Bihar is a full-stack event-services marketplace for Bihar. Customers can discover approved vendors and submit booking requests; vendors manage their profiles, services, availability, and booking responses; administrators approve vendors and oversee the platform.

## Highlights

- Customer email/password and Firebase Google authentication
- Role-based customer, vendor, and administrator access
- Approved vendor catalog with search and filters
- Vendor services, images, availability, and booking workflow
- Booking requests, status history, reviews, and customer booking history
- PostgreSQL persistence with ordered SQL migrations
- JWT cookie sessions and CSRF protection for authenticated mutations
- Cloudinary-backed vendor image uploads when configured
- Native Node.js deployment configuration for Render

## Repository structure

```text
Eventra_Bihar/
├── frontend/                 # Next.js web application
│   ├── src/                  # Customer, vendor, and admin UI
│   ├── public/               # Static images and assets
│   ├── .env.example          # Frontend environment template
│   └── package.json
├── backend/                  # Express REST API
│   ├── migrations/           # PostgreSQL schema migrations
│   ├── scripts/              # Migration, seed, and admin bootstrap scripts
│   ├── .env.example          # Backend environment template
│   ├── db.js                 # PostgreSQL pool
│   ├── index.js              # API entry point
│   └── package.json
├── render.yaml               # Render Blueprint configuration
├── DEPLOYMENT.md             # Staging and production deployment guide
└── package.json              # Optional repository convenience commands
```

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend | Express, Node.js |
| Database | PostgreSQL with SQL migrations and `pg` |
| Authentication | JWT cookies, bcrypt, Firebase Authentication |
| Authorization | Customer, vendor, and admin roles |
| Uploads | Cloudinary |
| Deployment | Native Node.js services and Render PostgreSQL |

## Prerequisites

- Node.js 20 or later recommended
- npm
- PostgreSQL 14 or later for local development
- Firebase project for Google sign-in
- Cloudinary account if vendor image uploads are needed

## Local setup

Run the frontend and backend in separate terminals.

### 1. Configure the backend

```bash
cd backend
copy .env.example .env
npm install
```

Set `DATABASE_URL`, JWT secrets, frontend origin, and Firebase Admin values in `backend/.env`. Cloudinary values are optional until image uploads are needed.

Run migrations and start the API:

```bash
npm run db:migrate
npm run dev
```

The API runs at `http://localhost:4000` by default. Confirm it is available:

```text
http://localhost:4000/health
```

### 2. Configure the frontend

```bash
cd frontend
copy .env.example .env.local
npm install
```

Set `NEXT_PUBLIC_API_BASE` to the API URL, normally:

```env
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

Add the Firebase Web SDK values to `frontend/.env.local`, then start Next.js:

```bash
npm run dev
```

The frontend runs at `http://localhost:3000` by default.

> On macOS/Linux, replace `copy` with `cp` in the commands above.

## Environment variables

Use the templates as the source of truth:

- [frontend/.env.example](frontend/.env.example)
- [backend/.env.example](backend/.env.example)

### Frontend

```text
NEXT_PUBLIC_API_BASE
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Backend

```text
NODE_ENV
PORT
DATABASE_URL
FRONTEND_ORIGIN
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
COOKIE_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
BOOTSTRAP_ADMIN_EMAIL
BOOTSTRAP_ADMIN_PASSWORD
```

Never commit `.env`, `.env.local`, Firebase service-account JSON files, JWT secrets, database URLs, or Cloudinary secrets.

## Common commands

### Frontend

```bash
cd frontend
npm run dev       # Development server
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # ESLint, when configured
```

### Backend

```bash
cd backend
npm run dev           # Nodemon development server
npm run start         # Production API server
npm run db:migrate    # Apply pending migrations
npm run db:seed       # Development-only demo catalog seed
npm run create:admin  # One-time administrator bootstrap
```

### From the repository root

```bash
npm run install:all
npm run dev:frontend
npm run dev:backend
npm run build:frontend
npm run db:migrate
npm run create:admin
```

## Roles and entry points

| Role | Entry point | Main capabilities |
|---|---|---|
| Customer | `/auth` | Browse vendors, request bookings, manage profile, review completed bookings |
| Vendor | `/vendor/auth` | Manage profile, services, availability, and assigned bookings |
| Administrator | `/admin/login` | Approve/reject vendors, view users/bookings, export CSV reports |

There is no public administrator registration. To create the first administrator, set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` in `backend/.env`, then run:

```bash
cd backend
npm run create:admin
```

The bootstrap script does not overwrite an existing account.

## Database migrations and seed data

Migrations are in `backend/migrations` and are recorded in the `schema_migrations` table. Run them before starting the application against a new database:

```bash
cd backend
npm run db:migrate
```

The seed command creates demo vendor catalog data for local development only. Do not run it in production.

## Authentication and security

- Access and refresh tokens are stored in HTTP-only cookies.
- Authenticated state-changing API calls require a CSRF token.
- Public signup permits only `customer` and `vendor` roles.
- The backend enforces role authorization for customer, vendor, and admin APIs.
- Firebase is used as a Google identity provider; the Express API verifies Firebase ID tokens using Firebase Admin credentials.
- Cloudinary credentials are used only by the backend.

## Deployment

Eventra Bihar is configured for native Node.js services on Render:

```text
Next.js frontend → Render Web Service (frontend/)
Express API      → Render Web Service (backend/)
PostgreSQL       → Render-managed database
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for Render environment variables, Firebase authorized-domain setup, migration strategy, health checks, rollback guidance, and post-deployment smoke tests.

## Validation

Before opening a pull request or deploying, run:

```bash
cd frontend
npm run build
npx tsc --noEmit

cd ../backend
node --check index.js
npm run db:migrate

cd ..
git diff --check
```

## Troubleshooting

| Problem | Check |
|---|---|
| Frontend cannot reach API | Confirm `NEXT_PUBLIC_API_BASE`, API health endpoint, and `FRONTEND_ORIGIN` |
| Google sign-in fails | Confirm Firebase Web values, provider enablement, and authorized domains |
| Backend cannot connect to PostgreSQL | Verify `DATABASE_URL` and run `npm run db:migrate` in `backend/` |
| Admin login redirects unexpectedly | Use `/admin/login`; only dashboard routes require an existing admin session |
| Image uploads fail | Configure Cloudinary backend credentials and use JPEG, PNG, or WebP files up to 5 MB |
| Cookie/session issue in production | Confirm HTTPS, `FRONTEND_ORIGIN`, and cookie-domain configuration |
