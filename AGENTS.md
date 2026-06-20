# AGENTS.md

## Quick Commands

```bash
# Development
pnpm dev:server    # Fastify API on port 4000
pnpm dev:web       # Vite dev server
pnpm dev:desktop   # Electron wrapper

# Build
pnpm build:web     # tsc -b && vite build
pnpm build:desktop # electron-builder (depends on web/dist)

# Lint
pnpm --filter web lint   # ESLint in web package only
```

## Architecture

**pnpm monorepo** with 3 packages + shared:

```
src/server/   → Fastify API (port 4000, SQLite, Prisma ORM)
src/web/      → React 19 + Vite + Tailwind 4 frontend
src/desktop/  → Electron wrapper (loads web/dist)
shared/       → Common types, interfaces, enums (@on-library/shared)
```

### Server (`src/server/`)

- **Framework**: Fastify 5 with autoload, TypeBox validation
- **Database**: SQLite via Prisma 7 (better-sqlite3 adapter)
- **Schema**: `src/server/prisma/schema.prisma`
- **Generated client**: `src/server/prisma/prisma-client/` (not the default location)
- **Entry**: `src/server/src/index.ts` → `infrastructure/server.ts` builds the app
- **Route autoloading**: `src/infrastructure/http/routes/` (files named `[verb]-[resource].ts` pattern, registered at `/api` prefix)
- **Plugin autoloading**: `src/infrastructure/plugins/` (auth plugin loaded first)
- **Architecture pattern**: `application/` (business logic, features) → `infrastructure/` (HTTP, DAOs, services)
- **Dev mode**: `FASTIFY_AUTOLOAD_TYPESCRIPT=1 node --watch src/index.ts`
- **Swagger**: Available at `/documentation`
- **Media files**: Served from `src/server/media/` at `/media/` prefix
- **Env**: `.env` with `DATABASE_URL="file:./dev.db"` and `SECRET_KEY`
- **Seed**: `pnpm --filter server exec prisma db seed` → creates admin user (admin@onlibrary.com / Admin123!)

### Web (`src/web/`)

- **Stack**: React 19 + Vite 8 + Tailwind CSS 4 + React Router 7
- **Config**: `vite.config.ts` uses `base: "./"` (required for Electron compatibility)
- **Entry**: `src/web/src/main.tsx` → `AppRouter` component
- **API URL**: Configured via `VITE_API_URL` env var (defaults to `http://127.0.0.1:4000`)
- **Design system**: Raycast-inspired dark theme documented in `src/web/DESIGN.md`
- **Build**: `tsc -b && vite build` → outputs to `dist/`

### Desktop (`src/desktop/`)

- **Electron 41** with electron-serve
- **Build order**: `pnpm build:web` must run before `pnpm build:desktop`
- **Entry**: `main.js` loads `dist/` folder via electron-serve
- **Output**: `src/desktop/dist/` (AppImage, deb for Linux; NSIS for Windows)

### Shared (`shared/`)

- **Package**: `@on-library/shared` (workspace reference)
- **Exports**: interfaces, types, enums from barrel `index.ts`
- **Note**: `tsconfig.app.json` in web explicitly includes `../../shared/enums/permisions.ts` (note: filename has typo "permisions")

## Gotchas

1. **Build order matters**: Desktop needs `web/dist` to exist. Always `build:web` before `build:desktop`
2. **Prisma client location**: Generated to `./prisma-client` (not default `node_modules/.prisma/client`). Import from `../prisma/prisma-client/client.ts`
3. **Server runs with `--watch`**: Dev mode uses Node's native watch mode, not nodemon
4. **CORS is enabled**: Server allows all origins with GET, POST, PUT, DELETE methods
5. **File uploads**: 50MB limit on server multipart uploads
6. **No test suite**: No test scripts or test framework configured in any package
7. **No CI/CD**: No GitHub Actions or similar workflows found
8. **SQLite database**: `src/server/dev.db` is committed (development only)

## Key Files

- `src/server/src/infrastructure/server.ts` — Server setup, plugin registration
- `src/server/src/infrastructure/http/routes/` — All API routes
- `src/server/src/infrastructure/dao/` — Database access objects
- `src/server/prisma/schema.prisma` — Database schema
- `src/web/src/routes/index.tsx` — Frontend routes
- `src/web/DESIGN.md` — Design system reference (Raycast-inspired)
- `shared/index.ts` — Shared package barrel export
