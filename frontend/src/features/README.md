# Feature boundaries

Feature modules live under this directory: `auth`, `dashboard`,
`professionals`, `contacts`, `departments`, `positions`, and shared management
UI.

Authentication owns its API contracts, session provider integration, route
guard, and login/profile UI. Business features keep their query keys, API
hooks, validation, and components within their respective boundaries.
