---
name: prisma-data-safety
description: Rules for safe database operations with Prisma. Use when making schema changes, running migrations, pushing to database, or any operation that could affect existing data. Prevents accidental data loss. Triggers on "prisma migrate", "prisma db push", "schema change", "database backup", "drift detected".
license: MIT
metadata:
  author: on-library
  version: "1.0.0"
---

# Prisma Data Safety Rules

**CRITICAL: These rules exist to prevent accidental data loss. Follow them always.**

## Context

This project uses SQLite via Prisma 7. The database file (`src/server/dev.db`) is NOT committed to git and contains local development data that the user has manually created (series, chapters, tags, categories, libraries, reading progress, etc.). The seed only creates the admin user and permissions.

## Absolute Rules

### NEVER Destroy Data

1. **NEVER run `prisma migrate reset`** — This drops ALL tables and deletes ALL data. Even in development, this destroys hours of manual data entry.
2. **NEVER run `prisma db push --force-reset`** — Same destructive effect.
3. **NEVER use `--force-reset` flag on any Prisma command** unless the user explicitly says "reset everything".
4. **NEVER assume data is expendable** — The user's test data took time to create.

### Schema Changes

When adding new tables or columns:

1. **Use `prisma db push`** — This is safe and non-destructive for additive changes.
2. **If drift is detected**, do NOT reset. Instead:
   ```bash
   # Backup first
   cp src/server/dev.db src/server/dev.db.backup
   
   # Then try push
   pnpm --filter server exec prisma db push
   ```
3. **If drift persists**, ask the user before proceeding. Do not auto-reset.
4. **Always ask permission** before applying structural changes that modify existing tables (adding required columns, changing types, etc.).

### Backup Protocol

Before ANY risky operation:

```bash
# Create timestamped backup
cp src/server/dev.db src/server/dev.db.$(date +%Y%m%d_%H%M%S)

# Or manual backup
cp src/server/dev.db src/server/dev.db.backup
```

### Safe Workflow for Schema Changes

```
1. Show the user what will change (new tables, modified columns)
2. Ask for confirmation
3. Create backup: cp src/server/dev.db src/server/dev.db.$(date +%Y%m%d_%H%M%S)
4. Run: pnpm --filter server exec prisma db push
5. Run: pnpm --filter server exec prisma generate
6. Verify the operation succeeded
7. If anything went wrong, inform the user immediately
```

### What the Seed Creates

The seed (`pnpm --filter server exec prisma db seed`) creates ONLY:
- Admin user: `admin@onlibrary.com` / `Admin123!`
- Permissions for all modules

**All other data** (series, chapters, tags, categories, libraries, following, reading history) must be created manually by the user through the app or API.

### If Data Loss Occurs

1. **Immediately inform the user** — Do not hide the fact
2. **Explain what was lost** — List the affected tables/data
3. **Explain what can be recovered** — Seed data is recreatable, user data is not
4. **Offer to help restore** — If a backup exists, help restore it

## Quick Reference

| Operation | Safe? | Command |
|-----------|-------|---------|
| `prisma generate` | Yes | Always safe, regenerates client |
| `prisma db push` | Yes | Non-destructive schema sync |
| `prisma db seed` | Mostly | Creates admin user, idempotent |
| `prisma migrate dev` | Caution | Creates migration, may fail on drift |
| `prisma migrate deploy` | Yes | Applies pending migrations |
| `prisma migrate reset` | **NO** | Drops everything, never use without permission |
| `prisma db push --force-reset` | **NO** | Same as migrate reset |
