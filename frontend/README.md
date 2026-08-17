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
npm run build
```

The API client uses native `fetch`, maps the backend error contract, and attaches the current Bearer token centrally for authenticated requests.

## Design system foundation

Foundational components under `src/components/ui` use semantic CSS variables from `src/styles/globals.css`. Product features should consume the official component variants rather than applying local color, radius, shadow, or focus overrides.

Form composition uses the lightweight helpers in `src/components/common`. Labels and helper text must be associated through native `id`, `htmlFor`, `aria-describedby`, and `aria-invalid` attributes.

During development, `/dev/design-system` provides an internal primitive showcase. It is not linked from product navigation and returns `404` in production builds.

## App shell

Protected route placeholders share the responsive product shell under `src/components/layout`. Desktop navigation supports an expanded or collapsed sidebar, with the preference stored locally under `professional-management-sidebar`. Below the `lg` breakpoint, navigation uses an accessible left-side Sheet.

Authentication uses the backend's `/api/auth/login`, `/api/auth/me`, and `/api/auth/logout` contracts. Protected routes restore the current session before rendering, and logout clears both the local session and TanStack Query cache.

### Authentication security debt

Current MVP authentication stores the access token in browser `localStorage` through the isolated `src/features/auth/auth-storage.ts` module. No page or feature should access authentication storage directly.

Planned security hardening:

- HttpOnly, Secure and SameSite cookie strategy
- BFF/server-side session evaluation
- Refresh token rotation if adopted
- Content Security Policy review
- Continued XSS hardening
