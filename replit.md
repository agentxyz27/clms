# Overview

This is a **Learning Management System (LMS)** web application styled after an STI College portal. It provides a student-facing dashboard with course browsing, module viewing, assignment submission, announcements, and a calendar/task widget sidebar. The app uses a 3-column layout: left navigation sidebar, main content area, and right widget panel.

The stack is a full-stack TypeScript monorepo with a React frontend (Vite) and Express backend, backed by PostgreSQL via Drizzle ORM. Authentication is handled through Replit's OpenID Connect integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Monorepo Structure

The project is organized into three top-level directories:
- **`client/`** — React frontend (SPA)
- **`server/`** — Express backend (API + static serving)
- **`shared/`** — Shared TypeScript types, database schema, and API route contracts used by both client and server

## Frontend (`client/`)

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite (dev server proxies API requests to Express)
- **Routing**: Wouter (lightweight client-side router)
- **State/Data**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming. The theme uses a blue (#003366) and yellow accent color scheme. Fonts are DM Sans (body) and Outfit (display headings).
- **Animations**: Framer Motion for page transitions
- **Key pages**: Dashboard (`/`), CourseDetail (`/courses/:id`), NotFound
- **Layout**: 3-column — fixed left Sidebar (260px, dark blue), scrollable main content, fixed right widget sidebar (320px, hidden below xl breakpoint)
- **Path aliases**: `@/` → `client/src/`, `@shared/` → `shared/`

## Backend (`server/`)

- **Framework**: Express.js running on Node with `tsx` for TypeScript execution
- **Entry point**: `server/index.ts` creates HTTP server, registers routes, sets up Vite dev middleware or static serving
- **API pattern**: RESTful JSON API under `/api/*` prefix
- **Route contract**: `shared/routes.ts` defines a typed API contract object (`api`) with paths, methods, Zod input/response schemas. Both client hooks and server routes reference this contract.
- **Storage layer**: `server/storage.ts` defines an `IStorage` interface and `DatabaseStorage` class implementing it with Drizzle queries. This abstraction allows swapping storage implementations.
- **Authentication**: Replit Auth via OpenID Connect (passport + express-session). Sessions stored in PostgreSQL via `connect-pg-simple`. Auth code lives in `server/replit_integrations/auth/`. Currently returns a mock user for development/testing.
- **Static serving**: In production, serves built Vite output from `dist/public/` with SPA fallback

## Database

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema location**: `shared/schema.ts` and `shared/models/auth.ts`
- **Tables**:
  - `users` — User profiles (required for Replit Auth)
  - `sessions` — Session storage (required for Replit Auth)
  - `courses` — Course catalog with title, description, image, teacher reference
  - `modules` — Course modules with ordered content
  - `assignments` — Course assignments with due dates
  - `submissions` — Student assignment submissions with grades/feedback
  - `enrollments` — User-course enrollment records
  - `announcements` — System/course announcements (defined in schema, referenced in routes)
- **Migrations**: Use `drizzle-kit push` (`npm run db:push`) to sync schema to database
- **Connection**: `DATABASE_URL` environment variable required, uses `pg.Pool`

## Build System

- **Dev**: `npm run dev` — runs Express + Vite dev server with HMR
- **Build**: `npm run build` — Vite builds client to `dist/public/`, esbuild bundles server to `dist/index.cjs`
- **Production**: `npm start` — runs the bundled server which serves static files
- **Type check**: `npm run check`

## API Routes

Key endpoints (all prefixed with `/api/`):
- `GET /api/courses` — List all courses
- `GET /api/courses/:id` — Get single course
- `POST /api/courses/:id/enroll` — Enroll authenticated user (protected)
- `GET /api/courses/:id/modules` — List modules for a course
- `GET /api/modules/:id` — Get single module
- `GET /api/courses/:id/assignments` — List assignments for a course
- `POST /api/assignments/:id/submit` — Submit assignment (protected)
- `GET /api/announcements` — List announcements
- `GET /api/users/online` — Get online users
- `GET /api/auth/user` — Get current authenticated user

# External Dependencies

- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable
- **Replit Auth (OpenID Connect)** — Authentication provider using `ISSUER_URL` and `REPL_ID` environment variables
- **Express Session** — Requires `SESSION_SECRET` environment variable
- **Google Fonts** — DM Sans, Outfit, Fira Code, Geist Mono loaded via CDN
- **DiceBear Avatars** — Used for mock user profile images (external API)
- **shadcn/ui** — Component library configured in `components.json` with path aliases
- **Key npm packages**: drizzle-orm, drizzle-zod, @tanstack/react-query, wouter, framer-motion, recharts, react-day-picker, date-fns, zod, passport, express-session, connect-pg-simple