# Zakzum Online Database Foundation

Zakzum Online uses Prisma for database access.

## Database Provider

The intended database is PostgreSQL.

Do not use SQLite as the deployed database. The project is being built with Vercel deployment in mind, so production should use a hosted PostgreSQL database.

## Environment Variable

`DATABASE_URL` must be set for local development and on Vercel.

The placeholder format is documented in `.env.example`:

```text
DATABASE_URL="postgresql://zakzum:zakzum_dev_password@localhost:55432/zakzum_online_dev?schema=public"
```

Do not commit real database passwords, tokens, or connection strings.

## Local Development

Local development uses PostgreSQL through Docker Compose.

The local Docker service runs PostgreSQL inside the container on port `5432` and exposes it on host port `55432`. The host port avoids conflicts with other PostgreSQL services that may already use common PostgreSQL ports such as `5432` or `5433`.

To start local database work:

1. Copy `.env.example` to `.env` on your machine.
2. Keep the local Docker `DATABASE_URL` unless you use a different local PostgreSQL database.
3. Start PostgreSQL:

```bash
npm run db:up
```

4. Apply pending migrations locally:

```bash
npm run db:migrate
```

5. Validate the Prisma schema:

```bash
npm run db:validate
```

6. Stop the local database when finished:

```bash
npm run db:down
```

`docker compose down` stops the database container but keeps the local database volume.

`docker compose down -v` stops the database and deletes the local PostgreSQL volume. This removes local database data.

Do not run migrations unless `DATABASE_URL` points to a valid local PostgreSQL database.

## Database Scripts

The project includes simple package scripts for local database work:

- `npm run db:up` starts the local PostgreSQL container.
- `npm run db:down` stops the local PostgreSQL container and keeps the volume.
- `npm run db:reset` stops the local PostgreSQL container and deletes the local volume.
- `npm run db:migrate` applies pending migrations locally with Prisma.
- `npm run db:validate` validates `prisma/schema.prisma`.
- `npm run db:studio` opens Prisma Studio.

Use `npm run db:reset` carefully. It deletes local database data.

## Migrations

The initial migration file exists at:

```text
prisma/migrations/20260610130000_add_user_model/migration.sql
```

This migration creates:

- The `UserRole` enum
- The `User` table
- A unique index for `email`
- A unique index for `username`

The migration has not been applied to a database yet.

For deployment, use the normal Prisma and Vercel migration flow with a real production `DATABASE_URL`. Do not use the local Docker database for production.

## Current Models

### User

The `User` model is the first account foundation for Zakzum Online.

It includes:

- A generated string `id`
- Unique `email`
- Unique `username`
- `passwordHash` for future password-based authentication
- `role` using the `UserRole` enum
- `createdAt` and `updatedAt` timestamps

`UserRole` currently supports:

- `PLAYER`
- `ADMIN`

This model is auth-ready, but authentication routes, sessions, login UI, and registration UI have not been added yet.

## Future Models

Future models should be added step by step as the project needs them.

The next recommended database work is to start the local PostgreSQL service, create a local `.env`, and apply the existing initial migration.

Do not add character, combat, inventory, quest, map, or gameplay models until the account foundation is ready.
