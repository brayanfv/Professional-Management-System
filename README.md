# Professional Management System

Professional Management System is a Spring Boot application being evolved from
the existing Professional Management API into a full-stack portfolio project for
managing professionals and their contacts.

## Current stage

The project has completed the Foundation, Database + Domain Migration, and API
Core stages, Security + JWT, Dashboard, and OpenAPI/Swagger. It exposes
authenticated, paginated REST endpoints for Professionals, Contacts,
Departments, Positions, and dashboard summaries under `/api`.
`POST /api/auth/login` creates an HttpOnly JWT session cookie; the remaining
`/api/**` resources require that session.

## Current stack

- Java 21
- Spring Boot 3.4.4
- Spring Web
- Spring Data JPA / Hibernate
- Bean Validation
- Spring Security
- JJWT (HS256)
- Springdoc OpenAPI / Swagger UI
- PostgreSQL
- Flyway infrastructure
- Maven
- JUnit and Mockito through Spring Boot Starter Test

## Prerequisites

- Full local environment: Docker Desktop.
- Backend outside Docker: JDK 21 and Docker Desktop.
- Maven installation is not required; the repository includes Maven Wrapper.

## Local configuration

Copy `.env.example` to a local, ignored `.env` file and replace its placeholder
security values. Docker Compose reads this file automatically. The backend uses
the following environment variables:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USERNAME
DB_PASSWORD
SERVER_PORT
JWT_SECRET
JWT_EXPIRATION
CORS_ALLOWED_ORIGINS
LOGIN_RATE_LIMIT_CAPACITY
LOGIN_RATE_LIMIT_REFILL_TOKENS
LOGIN_RATE_LIMIT_REFILL_PERIOD
SESSION_COOKIE_SECURE
SESSION_COOKIE_SAME_SITE
ADMIN_NAME
ADMIN_EMAIL
ADMIN_PASSWORD
```

The `dev` and `prod` profiles use PostgreSQL, Flyway, and Hibernate `validate`.
The `test` profile uses isolated H2 with `create-drop` and does not run Flyway.
The Flyway migrations represent the official schema for a new installation.
Existing development databases that contain legacy `profissional` or `contato`
tables must be recreated or migrated explicitly; the application does not drop
or transform them automatically.

`JWT_SECRET` is required to issue or validate tokens and must have at least 32
characters. Production reads it exclusively from the environment. Browser JWTs
are transported only in the host-only `pm_session` HttpOnly cookie; JavaScript
never receives the token. The cookie uses `SameSite=Lax`; production defaults to
`Secure=true` and therefore requires HTTPS. In the current browser architecture,
the frontend must access the API through the same public host (normally by
proxying `/api`) because the host-only `XSRF-TOKEN` cookie is read by frontend
JavaScript. Separate frontend/API subdomains require an explicit CSRF
cookie-domain design and are not supported by the current configuration. When
all three `ADMIN_*` values are set, startup creates one `ADMIN` user only if
that email does not already exist; it never logs, replaces, or resets the
password.
JWT logout is stateless: `POST /api/auth/logout` returns `204 No Content` and
expires the session cookie. There is no refresh token or server-side JWT
revocation list in this stage.

`POST /api/auth/login` is protected by an in-memory, per-direct-client-IP token
bucket. Its default is 10 attempts per minute; valid and invalid attempts both
consume a token. Configure `LOGIN_RATE_LIMIT_CAPACITY`,
`LOGIN_RATE_LIMIT_REFILL_TOKENS`, and `LOGIN_RATE_LIMIT_REFILL_PERIOD` for the
deployment. This limiter is intentionally appropriate only for one application
instance and does not trust `X-Forwarded-For` before a trusted proxy topology is
configured. A horizontally scaled deployment needs a shared/distributed limiter.

## Local Development

### Full environment with Docker Compose

1. Copy `.env.example` to `.env`.
2. Set a unique `JWT_SECRET` with at least 32 characters and an
   `ADMIN_PASSWORD` suitable for local development.
3. Start PostgreSQL and the backend:

```powershell
docker compose up --build
```

The backend is available at `http://localhost:8080`, PostgreSQL at
`localhost:5432`, and Swagger UI at
`http://localhost:8080/swagger-ui/index.html`.

Useful commands:

```powershell
docker compose logs -f backend
docker compose logs -f db
docker compose down
docker compose down -v
docker compose exec db psql -U postgres -d professional_management
```

`docker compose down -v` also removes the persisted local PostgreSQL volume.

### Backend local with PostgreSQL in Docker

Start only PostgreSQL:

```powershell
docker compose up -d db
```

Then export the database and security variables in the terminal or configure
them in your IDE run configuration. At minimum, use `DB_HOST=localhost` and
the same `DB_*`, `JWT_*`, and `ADMIN_*` values used by Compose. `.env` is a
Docker Compose file; Spring Boot does not load it automatically when launched
directly. Select `SPRING_PROFILES_ACTIVE=dev` explicitly; the application no
longer defaults to the development profile when no profile is selected.

Run the backend with the Maven Wrapper:

```powershell
.\mvnw.cmd spring-boot:run
```

Tests run outside Docker. The fast suite uses H2 where appropriate, while the
database integration suite starts an isolated PostgreSQL 16 Testcontainer and
runs the real Flyway migrations:

```powershell
.\mvnw.cmd clean test
```

## Continuous Integration

GitHub Actions runs the quality pipeline for every pull request and every push
to `main`. It has independent Backend, Frontend, and E2E jobs followed by a
single Quality Gate. The backend job runs the H2 and PostgreSQL Testcontainers
suites; the frontend job runs lint, type-checking, Vitest, a production build,
and `npm audit --audit-level=high`; the E2E job uses the disposable
`docker-compose.e2e.yml` environment and Playwright Chromium smoke test.

The local equivalents are:

```powershell
.\mvnw.cmd clean test
.\mvnw.cmd clean package

cd frontend
npm run lint
npm run typecheck
npm run test
npm run build
npm audit --audit-level=high
npm run e2e:env:up
npx playwright install chromium
npm run test:e2e
npm run e2e:env:down
```

Both the backend integration tests and the E2E stack require Docker Desktop.
The E2E Compose file uses only isolated, test-only credentials and a temporary
PostgreSQL data directory; it never targets the local development database.

## Production configuration boundary

`compose.yml` is for local development and `docker-compose.e2e.yml` is
disposable test infrastructure; neither is production infrastructure.
`docker-compose.prod.yml`, `infra/caddy/Caddyfile`, and
`.env.production.example` define the repository's reproducible production
topology. They do not provision a VPS, domain, DNS, certificates, or secrets.

A production start must set `SPRING_PROFILES_ACTIVE=prod`, provide `DB_HOST`,
`DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, and an
explicit HTTPS `CORS_ALLOWED_ORIGINS`, and build the frontend with the public
same-origin `NEXT_PUBLIC_API_URL`. `JWT_SECRET` must contain at least 32
characters. The initial deployment must also provide all three `ADMIN_*`
values unless an administrator already exists. Production additionally needs
an external TLS/reverse-proxy decision, private PostgreSQL connectivity,
backups with a tested restore procedure, and a health/readiness strategy before
public go-live.

The provider-neutral [production operations runbook](docs/production-operations.md)
defines the initial backup/restore policy, same-origin deployment topology,
health-probe use, runtime configuration boundary, and trusted-proxy behavior.
It also explains how to validate the production Compose stack locally without
turning it into a real deployment.

The backend exposes only unauthenticated operational probes:
`/actuator/health`, `/actuator/health/liveness`, and
`/actuator/health/readiness`. Health details are never exposed through HTTP.
Use the readiness endpoint for traffic admission and the liveness endpoint for
process restart decisions. The runtime image intentionally does not install a
healthcheck client; the future orchestrator or ingress should probe these URLs.

## Current API

The implemented resources use the `/api` prefix:

- `/api/professionals`
- `/api/professionals/{professionalId}/contacts`
- `/api/departments`
- `/api/positions`
- `/api/auth/login`
- `/api/auth/me`
- `/api/auth/logout`
- `/api/dashboard/summary`
- `/api/dashboard/professionals-by-department`
- `/api/dashboard/professionals-by-position`
- `/api/dashboard/recent-professionals`

## API Documentation

In the `dev` profile, Swagger UI is available at:

```text
http://localhost:8080/swagger-ui/index.html
```

The OpenAPI JSON document is available at:

```text
http://localhost:8080/v3/api-docs
```

Swagger UI and OpenAPI JSON are disabled by default in the `prod` profile.
In development, authenticate through `POST /api/auth/login`; the browser keeps
the HttpOnly session cookie for same-origin Swagger requests. State-changing
requests also require the `X-XSRF-TOKEN` header that mirrors the readable
`XSRF-TOKEN` cookie. The complete HTTP contract is maintained in
[API design](docs/api-design.md).

## Documentation

Project documentation is maintained in [docs](docs/):

- [Product overview](docs/product-overview.md)
- [Requirements](docs/requirements.md)
- [Roadmap](docs/roadmap.md)
- [Architecture](docs/architecture.md)
- [Database design](docs/database.md)
- [API design](docs/api-design.md)
- [Production operations](docs/production-operations.md)
- [Legacy API requests](docs/api.http)

## Planned roadmap

The planned evolution includes a versioned database schema, the final domain
model, standardized API contracts, security, dashboard, quality improvements,
Docker validation, and a Next.js frontend. See the [roadmap](docs/roadmap.md)
for the intended sequence.
