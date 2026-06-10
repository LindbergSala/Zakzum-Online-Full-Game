# Zakzum Online Database Foundation

Zakzum Online uses Prisma for database access.

## Database Provider

The intended database is PostgreSQL.

Do not use SQLite as the deployed database. The project is being built with Vercel deployment in mind, so production should use a hosted PostgreSQL database.

## Environment Variable

`DATABASE_URL` must be set for local development and on Vercel.

The placeholder format is documented in `.env.example`:

```text
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Do not commit real database passwords, tokens, or connection strings.

## Local Development

Local development requires a PostgreSQL database connection before migrations can run.

Do not run migrations unless `DATABASE_URL` points to a valid local PostgreSQL database.

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

The next recommended database work is to create and apply the first migration after a valid local PostgreSQL database is available.

Do not add character, combat, inventory, quest, map, or gameplay models until the account foundation is ready.
