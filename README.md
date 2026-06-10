# Biometric Student Authentication and Exam Verification

Phase one delivers a production-oriented web platform with a NestJS API, NextJS admin application, and MongoDB persistence.

## Applications

- `apps/api`: NestJS REST API with JWT authentication, RBAC, MongoDB schemas, audit logging, verification workflow endpoints, imports, reports, alerts, and health checks.
- `apps/web`: NextJS dashboard for administrators to monitor students, exams, centers, devices, verifications, and reports.

## Quick Start

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
docker compose up -d mongo
npm run dev
```

API: `http://localhost:4000/api`

Web: `http://localhost:3000`

Seeded login:

- Email: `superadmin@example.com`
- Password: `ChangeMe123!`

## Quality

```bash
npm run qa
```

The QA command runs linting, unit tests, and production builds for both apps.

## Render Deployment

Deploy the API and web app as separate Render Web Services. Set `NODE_VERSION=20.19.5` on both services.

The repo also includes `.node-version`, `.nvmrc`, and `.npmrc` pins so Render fails early if it tries to use the wrong Node version.

Web service build command:

```bash
npm ci && npm run build:web
```

`npm run build:web` uses a Node-based build wrapper that forces production mode, prints Render diagnostics, cleans `.next`, and retries with Webpack if the default Next builder fails on Render.

Web service start command:

```bash
npm run start:web
```

Web environment variables:

```text
NODE_ENV=production
NODE_VERSION=20.19.5
API_BASE_URL=https://your-api-service.onrender.com/api
```

`API_BASE_URL` must point to the Nest API service, not the Next.js web service. Verify it by opening `https://your-api-service.onrender.com/api/health`; it should return JSON from the API.

Do not set `NODE_ENV=development` on Render. It can make `next build` prerender with the wrong React runtime and fail with `useContext` errors.

Do not use `npm run dev` or root `npm run build` on the web service. `npm run dev` starts both apps and is only for local development; root `npm run build` builds the API too. The web service should run only `npm run build:web`.

## CRUD Operations

The admin web app includes create, read, update, and delete screens for:

- Users
- Students
- Exams
- Centers
- Devices

Verification records, audit events, alerts, and reports are intentionally read-focused in the web app because they are compliance and operational history. New verification records are still created through the verification workflow API.

API CRUD endpoints follow the same pattern:

```text
GET    /api/centers
POST   /api/centers
PATCH  /api/centers/:id
DELETE /api/centers/:id
```

## macOS 12 Runtime Note

Current Docker Desktop requires macOS Sonoma or newer. On macOS 12, use the already configured local MongoDB fallback:

```bash
mkdir -p .mongo-data .mongo-logs
mongod --dbpath .mongo-data --logpath .mongo-logs/mongod.log --fork --bind_ip 127.0.0.1 --port 27017
npm run seed -w apps/api
npm run dev
```

If port `3000` is already in use, the web app is likely already running. Check it with `lsof -nP -iTCP:3000 -sTCP:LISTEN`.

## Compliance Notes

The API masks Aadhaar numbers, stores only encrypted Aadhaar values, and exposes explicit provider stubs for Aadhaar and biometric device integrations. Real UIDAI/device SDK integrations must be enabled only after legal, vendor, and infrastructure approval.

# codex
# nikhilBio
