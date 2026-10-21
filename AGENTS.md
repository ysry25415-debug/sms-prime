# Repository Guidelines

> Whatever action you can do yourself, please do yourself; this includes starting apps and verification.

## Project Structure & Module Organization

SMSPrime is a Next.js 15 application using TypeScript, Tailwind CSS, Prisma, Supabase, and React Query. Application routes and API handlers live in `src/app/`; provider endpoints are under `src/app/api/`. Reusable UI belongs in `src/components/`, provider clients and server utilities in `src/lib/`, client state in `src/stores/`, static/sample data in `src/data/`, and database models in `prisma/schema.prisma`. Keep page-specific components close to their route when they are not reused elsewhere.

## Build, Test, and Development Commands

- `pnpm dev` — run the local Next.js development server.
- `pnpm build` — create the production build; run this before submitting UI or API changes.
- `pnpm start` — serve a completed production build locally.
- `pnpm lint` — run the Next.js ESLint configuration.
- `pnpm exec tsc --noEmit` — perform a strict TypeScript check.
- `pnpm prisma generate` — regenerate the Prisma client after modifying `prisma/schema.prisma`.

Use `pnpm`; the committed `pnpm-lock.yaml` is the dependency source of truth. There is currently no automated test suite. For behavior changes, add focused tests when introducing a supported test runner, and otherwise document manual verification in the pull request.

## Coding Style & Naming Conventions

Use TypeScript for all new code. Match the existing two-space indentation, semicolons, and double quotes. Name React components in `PascalCase` (`ServiceTable.tsx`); use `kebab-case` for route and utility filenames (`smsbower.ts`); use camelCase for values and functions. Prefer path aliases such as `@/components/...` over long relative imports. Keep API keys and secrets server-only—never expose them through `NEXT_PUBLIC_` variables or client components.

## API & UI Guidelines

Provider calls must pass through server-side API routes in `src/app/api/`; browsers must never call SMSBower directly. Validate external responses, preserve provider error status codes, and handle empty/loading/error states in the UI. Keep branding and copy owned by SMSPrime; do not copy external provider trademarks, text, or assets.

## Commit & Pull Request Guidelines

Use short imperative commit subjects, e.g. `Add SMSBower error handling`. Keep each commit focused. Pull requests should explain the user-visible change, identify environment or schema changes, link the related issue when applicable, and include screenshots for UI work. Before requesting review, run `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build`.
