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

Each page is a fully self-contained HTML file (inline CSS, inline SVG icons, inline JS). Cross-page navigation uses relative `.html` links compatible with both Vite preview and GHL hosting.

### Generator
- `build_pages.mjs` — single Node generator. Run `node build_pages.mjs` to rebuild all 11 pages.
- `zip_pages.mjs` — packages all pages into `public/downloads/enix-exteriors-ghl-pages.zip`.

### Pages (11 total)
- `index.html` (root) — Home
- `public/commercial-roofing.html` — Commercial Roofing
- `public/residential-roofing.html` — Residential Roofing
- `public/exterior-services.html` — Exterior Services
- `public/storm-damage-commercial.html` — Storm Damage (Commercial)
- `public/storm-damage-residential.html` — Storm Damage (Residential)
- `public/education-hub.html` — Education Hub (8 full accordion articles)
- `public/gallery.html` — Project Gallery (19 images + lightbox)
- `public/about.html` — About
- `public/contact.html` — Contact
- `public/tennessee-locations.html` — Tennessee Locations

### Features
- Company logo (`images/enix-logo-main.jpg`) in nav and footer
- 36 images in `public/images/` (logo + 19 client gallery + originals)
- Forms submit to `info@enixexteriors.com` via FormSubmit.co
- YouTube video embeds on Home and Education Hub
- Project Gallery page with lightbox viewer
- 8 fully written expandable articles in Education Hub
- Mobile menu with full accessibility (open/close, keyboard nav)
- Brand: `(865) 685-ENIX` / `tel:8656853649` / `info@enixexteriors.com` / `5992 Bearden View Ln, Knoxville TN 37909`
