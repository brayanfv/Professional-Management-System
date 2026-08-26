# Production Operations: Backup, Restore, and Deployment Topology

This runbook defines the operational baseline for the first public deployment of
the Professional Management System. It is provider-neutral and does not replace
a hosting provider's operational documentation.

## Scope and operating assumptions

Production uses PostgreSQL 16, Flyway migrations, and Hibernate schema
validation. Browser authentication uses an HttpOnly `pm_session` cookie and a
readable, host-only `XSRF-TOKEN` cookie. The browser must therefore reach the
frontend and `/api/*` through the same public host.

The recommended first deployment is one small VPS running a reverse proxy,
Next.js, Spring Boot, and PostgreSQL as private services on an internal Docker
network. This is appropriate for a portfolio/MVP with a small data set only if
the backup and restore controls below are operated. Re-evaluate it before
storing material real-company or personal data at scale.

Only the reverse proxy accepts Internet traffic. PostgreSQL must never publish
port 5432 publicly. The Next.js and Spring Boot ports must also be private to
the VPS/container network.

The production Compose topology reserves `172.30.0.10` for Caddy on its
private application network. Spring trusts forwarded client-address headers
only when the direct peer is that proxy address; do not add arbitrary client
addresses to the trusted-proxy list.

## Local production-like smoke

For an isolated local drill, copy `.env.production.example` to the ignored
`.env.production` and use test-only values. If host ports 80 or 443 are in
use locally, set `CADDY_HTTP_PORT` and `CADDY_HTTPS_PORT` in that ignored file;
they default to 80 and 443 for the VPS. Caddy issues an internal local
certificate for `localhost`, so curl uses `-k` and the dedicated production
smoke uses Playwright's `ignoreHTTPSErrors` only for this local CA.

After the Compose stack is healthy, run the restored-data browser smoke from
`frontend` with `npm run test:e2e:prod-smoke`. It targets
`https://localhost:8443` by default; override `PROD_SMOKE_BASE_URL` and the
test-only administrator variables only when the local drill environment uses
different values. This smoke is complementary to, and does not replace, the
ordinary E2E suite.

### Validated local drill (2026-08-25)

An isolated drill used the production Compose topology with `PUBLIC_HOST` set
to `localhost`, Caddy internal TLS, a test-only administrator, and local port
overrides `8088`/`8443` because the host's 80/443 bindings were unavailable.
Those overrides are not part of the VPS deployment contract.

The drill created a Department, Position, and Professional through the Caddy
HTTPS origin; verified that a mutation without CSRF was rejected; created a
custom-format `pg_dump`; verified its SHA-256 checksum and `pg_restore --list`;
then removed only the isolated named Compose volumes. A fresh database started
with seven Flyway migrations and no drill records. The verified archive was
restored with the explicit target confirmation, after which Flyway validated
the restored history at version 7, Hibernate initialized with schema
validation, readiness returned `UP`, and the browser smoke loaded the restored
professional details and signed out.

Observed local baseline: backup creation was approximately 7 seconds including
the one-off PostgreSQL client container; restore was 1.08 seconds; a backend
restart returned healthy in approximately 17 seconds. These are small local
drill measurements, not production capacity guarantees. The dump stayed in
the ignored `backups/` directory outside `postgres_prod_data`; the named volume
is persistence, not a backup. Off-host encrypted backup transfer, scheduling,
and retention enforcement remain required before a public deployment.

## Backup strategy

### What is backed up

Back up the complete application PostgreSQL database, including data, schema,
indexes, and `flyway_schema_history`. For self-managed PostgreSQL, also retain a
separately protected record of application database roles when they cannot be
recreated from the secret store. Do not put production passwords in a database
dump or this repository.

Application source is recovered from Git and the tagged release/immutable
container image, not from a database backup. Runtime configuration and secrets
must be recoverable from the deployment platform's secret store or encrypted
operations vault; they are not a substitute for a database backup.

### Primary and secondary mechanisms

Prefer provider-managed, encrypted backups and point-in-time recovery whenever
the chosen PostgreSQL provider offers them. They reduce host-failure risk and
operational work.

For the recommended self-managed VPS topology, run a scheduled PostgreSQL 16
logical backup using `pg_dump` in custom format, then transfer it over TLS to
encrypted storage in a separate failure domain from the VPS. The backup job
must use least-privilege database credentials and must not print its connection
string or password. A generic form is:

```text
pg_dump --format=custom --no-owner --no-privileges --file=<backup-file> <database-connection>
```

The scheduler, storage provider, and secret delivery mechanism are deployment
choices and are deliberately not defined here. Store a checksum with every
backup and use access controls, encryption at rest, and versioning/immutability
where available. Encryption keys must be managed separately from backup storage.

### Retention, RPO, and RTO

For the portfolio/MVP baseline, retain 7 daily, 4 weekly, and 6 monthly recovery
points. Run a backup before database maintenance or a production release that
includes a Flyway migration.

| Context | RPO | RTO |
| --- | --- | --- |
| Public portfolio/demo | At most 24 hours | At most 4 hours |
| Real user/company data | At most 4 hours, or a documented business target | At most 2 hours after a practiced restore |

If real data requires a smaller RPO, use provider point-in-time recovery or
increase backup frequency; a nightly dump alone is not sufficient.

## Restore procedure and validation

1. Declare the incident and stop write traffic to the affected application.
2. Select the recovery point; verify its source, checksum, encryption access,
   and retention status.
3. Provision an isolated PostgreSQL target or preserve the failed database
   before replacing it. Never restore destructively over the only copy.
4. Create the application database and least-privilege role from secure runtime
   configuration.
5. Restore with a matching PostgreSQL client major version. A generic custom
   format restore is:

   ```text
   pg_restore --clean --if-exists --no-owner --no-privileges --dbname=<target-connection> <backup-file>
   ```

6. Before routing traffic, verify the archive with `pg_restore --list`, confirm
   the stored checksum, connect using the application role, and check critical
   record counts.
7. Start the compatible release with `SPRING_PROFILES_ACTIVE=prod`. Flyway must
   validate and Hibernate must start with `ddl-auto=validate`.
8. Confirm `/actuator/health/readiness` is `UP`, then run the Login → Dashboard
   → Logout smoke flow using a non-production test account where possible.
9. Record the validation and re-open traffic only when it succeeds.

Perform an isolated restore drill monthly for the portfolio deployment, after a
recovery-process change, and before relying on a new backup provider. Real data
needs a business-approved cadence; quarterly is a minimum practical baseline.

## Flyway, rollback, and restore

A database restore returns the database, including `flyway_schema_history`, to
the selected recovery point. On startup, Flyway validates the restored history
and may apply migrations present in the deployed artifact but absent from that
recovery point. Review this before reopening traffic.

An application rollback is different: redeploying an earlier application image
does not reverse Flyway migrations or recover data. Migrations are immutable and
are not edited to undo production changes. A database restore recovers data loss
or corruption; a forward corrective migration is normally safer for schema
defects.

## Deployment options and recommendation

| Option | Fit | Main trade-off |
| --- | --- | --- |
| Single VPS, reverse proxy, and containers | Recommended first deployment. Small operational surface, direct same-origin routing, and strong portfolio value. | The operator owns host patching, backups, and restore drills. |
| Managed frontend plus managed backend/database | Viable only when the frontend platform proxies/rewrites `/api/*` on the same public host. | Less server maintenance, but cross-provider routing needs careful validation. |
| Container-oriented managed platform | Viable with path-routing ingress and private database networking. | More platform-specific configuration and complexity than this MVP needs. |

Use **a single VPS with Docker containers and Caddy as reverse proxy** for the
first public portfolio release. Caddy keeps the first TLS and path-routing setup
compact and supports certificate automation once a domain exists. Nginx is also
capable but needs separate certificate automation; Traefik adds discovery
features that this small topology does not need. A managed-platform ingress is a
good future option if it can keep `/` and `/api/*` on one host.

The repository now provides `docker-compose.prod.yml`,
`infra/caddy/Caddyfile`, and `.env.production.example` as a reproducible
topology. They do not create or configure a VPS, domain, DNS record, public
certificate, or production secrets.

## Final traffic flow, TLS, and public services

```text
Internet
  -> DNS
  -> Caddy on TCP 443 (TLS terminates here)
       /        -> Next.js private service
       /api/*   -> Spring Boot private service
                         -> PostgreSQL private service
```

TCP 80 is for redirect/certificate handling only when the final TLS setup needs
it. The reverse proxy is the only public ingress. PostgreSQL, Next.js, and
Spring Boot have no public host-port bindings. For a managed remote backend or
database, require private networking or TLS for every non-local hop.

Build the frontend with `NEXT_PUBLIC_API_URL=https://<public-host>` because API
call paths already contain `/api`. This keeps requests same-origin, allows the
browser to read `XSRF-TOKEN`, and keeps `pm_session` HttpOnly. Keep
`SESSION_COOKIE_SAME_SITE=Lax` and production secure-cookie behavior. Do not
split frontend and API across public subdomains without a separately reviewed
CSRF cookie-domain design.

## Health and readiness integration

| Endpoint | Consumer | Purpose |
| --- | --- | --- |
| `/actuator/health/liveness` | Runtime supervisor/orchestrator | Detect a failed process; it must not depend on PostgreSQL. |
| `/actuator/health/readiness` | Deploy/orchestration traffic gate | Admit traffic only when Spring Boot and PostgreSQL are ready. |
| `/actuator/health` | Controlled operational check | Concise overall status with no component details. |

Do not route Actuator paths publicly through the reverse proxy unless the final
hosting platform requires a public probe. If unavoidable, expose only these
existing health paths; no additional Actuator endpoints are permitted.

## Environment and secrets

Use the selected host/platform secret store or protected runtime environment,
not Git, image layers, build logs, or `NEXT_PUBLIC_*` variables, for secrets.

| Variable | Delivery and value shape |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | Runtime configuration: `prod`. |
| `DB_HOST`, `DB_PORT`, `DB_NAME` | Private database connection configuration. |
| `DB_USERNAME`, `DB_PASSWORD` | Least-privilege runtime secret. |
| `JWT_SECRET` | Random 32+ character runtime secret, rotation-controlled. |
| `JWT_EXPIRATION` | Runtime configuration; preserve the reviewed session duration. |
| `CORS_ALLOWED_ORIGINS` | Exact `https://<public-host>` origin; never wildcard. |
| `SESSION_COOKIE_SAME_SITE` | Runtime configuration: `Lax` unless a reviewed design requires otherwise. |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Initial bootstrap only; protected values, then remove/blank once the intended admin exists. |
| `NEXT_PUBLIC_API_URL` | Frontend build-time non-secret: `https://<public-host>`. |

## Trusted proxy and rate limiting

The production Compose topology assigns Caddy the fixed private application
network address `172.30.0.2`. The backend accepts `X-Forwarded-For` only when
the immediate peer is that configured address; direct callers, malformed values,
and multiple forwarded addresses retain their direct remote address. Tests cover
both untrusted-header spoofing and trusted-proxy resolution.

Caddy's standard `reverse_proxy` behavior ignores client-supplied forwarded
values when Caddy is the edge proxy, then sets `X-Forwarded-For`,
`X-Forwarded-Proto`, and `X-Forwarded-Host` for the upstream. No manual header
override is needed in the Caddyfile. The backend is private to the Docker
network, so an Internet caller cannot impersonate the Caddy peer.

Do not add another proxy, CDN, or load balancer in front of Caddy without
configuring Caddy's trusted proxy ranges first. Likewise, do not enable generic
Spring forwarded-header processing as a substitute for the limiter's explicit
trusted-peer policy. Multiple backend instances still require a shared limiter.

## Repository production assets and local simulation

Copy `.env.production.example` to the ignored `.env.production` file only on a
controlled host, restrict it to its owner (for example `chmod 600` on Linux),
and use it explicitly:

```text
docker compose --env-file .env.production -f docker-compose.prod.yml config
docker compose --env-file .env.production -f docker-compose.prod.yml up --build --detach
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

After startup, inspect service health with `docker compose --env-file
.env.production -f docker-compose.prod.yml ps`. The backend readiness probe is
private to the container network and can be checked without publishing port
8080:

```text
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend \
  curl --fail http://127.0.0.1:8080/actuator/health/readiness
```

For a local topology check, the example uses `PUBLIC_HOST=localhost` and
`NEXT_PUBLIC_API_URL=https://localhost`. Caddy will use its local/internal TLS
for `localhost`; no public certificate is requested. Use a client that accepts
the local certificate only for this dedicated simulation (for example `curl -k`)
and keep the existing E2E environment unchanged. Validate `/login` through
Caddy, `/api/auth/me` returns `401` through Caddy without a session, and the
backend readiness endpoint is consumed only from the private container network.

`scripts/backup-postgres.sh` produces a PostgreSQL custom-format dump and a
SHA-256 checksum from externally supplied libpq environment variables. It does
not upload the archive: an encrypted off-host transfer and scheduler are still
required. `scripts/restore-postgres.sh` requires an explicit target confirmation
and a matching checksum before it runs `pg_restore`; use it first only against
an isolated target. Neither script performs retention deletion.

## CI/CD implications

The existing quality gate remains the release prerequisite. A future deployment
pipeline should run the same backend, frontend, and E2E gates; build immutable
artifacts; inject production secrets only at deployment; wait for readiness; and
retain a known-good artifact for rollback. It must never use a production
database for tests or print backups/secrets in logs.
