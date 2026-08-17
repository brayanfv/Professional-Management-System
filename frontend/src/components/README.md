# Design system primitives

The components in `ui/` are the low-level visual primitives for the Professional Management System. They use semantic tokens from `src/styles/globals.css`; product features should prefer their variants instead of overriding colors, radii, shadows, or focus styles locally.

Form layouts use `FormField`, `FormLabel`, `FormDescription`, and `FormMessage` from `common/`. Inputs remain directly compatible with React Hook Form. Callers are responsible for connecting labels and helper text with `htmlFor`, `id`, and `aria-describedby`, and for setting `aria-invalid` when validation fails.

Dark mode and product-level components are intentionally outside the current design system scope.
