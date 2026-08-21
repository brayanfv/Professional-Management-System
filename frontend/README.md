# Professional Management System — Frontend

Frontend for the Professional Management System web application. The current stage includes the design system, responsive app shell, and backend-integrated authentication; business feature pages remain placeholders.

## Stack

- Next.js with App Router
- React and TypeScript
- Tailwind CSS
- Shadcn UI with Lucide icons
- TanStack Query
- React Hook Form, Zod and Hook Form resolvers
- Geist (self-hosted)

## Requirements

- Node.js 20.9 or newer
- npm

## Setup

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local` and configure the backend URL:

```text
NEXT_PUBLIC_API_URL=http://localhost:8080
```

`.env.local` is ignored by Git.

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/dashboard`; authentication guards are intentionally deferred.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

The API client uses native `fetch`, maps the backend error contract, includes
browser credentials centrally, and mirrors the readable CSRF cookie into the
`X-XSRF-TOKEN` header for state-changing requests.

## Automated testing

Unit and component tests use Vitest, React Testing Library, and jsdom:

```bash
npm run test
npm run test:watch
```

The Playwright smoke test uses Chromium against the real frontend, backend, and
an isolated PostgreSQL 16 environment. It never uses the development database.
Start the disposable environment from `frontend` (Docker Desktop must be
running), then run the test:

```bash
npm run e2e:env:up
npx playwright install chromium
npm run test:e2e
```

It starts the production Next.js server on `http://127.0.0.1:3001` and uses the
backend on `http://127.0.0.1:8081`. The Compose PostgreSQL data directory is a
container tmpfs and is discarded when the environment is stopped:

```bash
npm run e2e:env:down
```

The default E2E administrator is a test-only account. Override it only through
`E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` when a different isolated test
identity is required. Do not point `E2E_API_URL` or `E2E_BASE_URL` at a shared
or production environment.

## Design system foundation

Foundational components under `src/components/ui` use semantic CSS variables from `src/styles/globals.css`. Product features should consume the official component variants rather than applying local color, radius, shadow, or focus overrides.

Form composition uses the lightweight helpers in `src/components/common`. Labels and helper text must be associated through native `id`, `htmlFor`, `aria-describedby`, and `aria-invalid` attributes.

During development, `/dev/design-system` provides an internal primitive showcase. It is not linked from product navigation and returns `404` in production builds.

## App shell

Protected route placeholders share the responsive product shell under `src/components/layout`. Desktop navigation supports an expanded or collapsed sidebar, with the preference stored locally under `professional-management-sidebar`. Below the `lg` breakpoint, navigation uses an accessible left-side Sheet.

Authentication uses the backend's `/api/auth/login`, `/api/auth/me`, and
`/api/auth/logout` contracts. Login receives user metadata while the backend
stores the JWT in an HttpOnly `pm_session` cookie; no JWT is stored in
`localStorage` or exposed to JavaScript. Protected routes restore the session
through `/api/auth/me`, and logout expires the cookie, clears local user state,
and clears the TanStack Query cache.

The backend issues a readable `XSRF-TOKEN` cookie solely for CSRF protection;
the API client sends that value in `X-XSRF-TOKEN` on state-changing requests.
