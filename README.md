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
`Secure=true` and therefore requires HTTPS. The frontend and API must be
same-site (for example, subdomains of the same HTTPS domain). When all
three `ADMIN_*` values are set, startup creates one `ADMIN` user only if that
email does not already exist; it never logs, replaces, or resets the password.
JWT logout is stateless: `POST /api/auth/logout` returns `204 No Content` and
expires the session cookie. There is no refresh token or server-side JWT
revocation list in this stage.

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

Tests remain outside Docker and use H2:

```powershell
.\mvnw.cmd clean test
```

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
- [Legacy API requests](docs/api.http)

## Planned roadmap

The planned evolution includes a versioned database schema, the final domain
model, standardized API contracts, security, dashboard, quality improvements,
Docker validation, and a Next.js frontend. See the [roadmap](docs/roadmap.md)
for the intended sequence.
