# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Enix Exteriors (artifacts/enix-exteriors)

GHL (GoHighLevel) Custom HTML Block compatible multi-page site for Enix Exteriors, a Knoxville TN roofing contractor.

Each page is a self-contained HTML file (inline CSS, inline SVG icons, inline JS) that can be pasted into a separate GHL Custom HTML block. Cross-page navigation uses relative `.html` links so the same files work both in the Vite preview and once hosted in GHL.

- `build_pages.mjs` — single Node generator. All shared CSS / nav / footer / icons / scripts plus per-page bodies live here. Run `node build_pages.mjs` to regenerate every page.
- `index.html` (artifact root) — Home page.
- `public/<slug>.html` — 9 sub-pages: `commercial-roofing`, `residential-roofing`, `exterior-services`, `storm-damage-commercial`, `storm-damage-residential`, `education-hub`, `about`, `contact`, `tennessee-locations`.
- `public/images/` — 16 brand image assets referenced as `images/xxx.jpg` (relative paths so they resolve in both Vite and GHL).
- Brand: phone `(865) 685-ENIX` / `tel:8656853649`, email `INFO@ENIXEXTERIORS.COM`, HQ `5992 Bearden View Ln, Knoxville TN 37909`.
